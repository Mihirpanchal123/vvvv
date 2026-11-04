import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteNav } from "@/components/site-nav";
import { SyncProvider } from "@/components/sync-provider";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "MedPlate — meal plans for medical diets", template: "%s · MedPlate" },
  description:
    "Weekly meal plans and grocery lists built around diabetic, kidney (CKD) and low-FODMAP diets — with every limit explained.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Lets the bottom tab bar and sheets pad for the iPhone home indicator via env(safe-area-inset-*).
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1412" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-dvh antialiased`}>
        <SyncProvider>
          <SiteNav />
          <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
          <footer className="no-print mx-auto max-w-6xl px-4 pb-10 text-xs text-muted sm:px-6">
            MedPlate is a planning tool, not medical advice. Nutrient limits are general defaults — confirm yours with your
            doctor or registered dietitian. Nutrient values are estimates from USDA data and vary by brand and preparation.
          </footer>
        </SyncProvider>
      </body>
    </html>
  );
}
