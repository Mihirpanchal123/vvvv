import type { Metadata } from "next";
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-dvh antialiased`}>
        <SyncProvider>
          <SiteNav />
          <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">{children}</main>
          <footer className="no-print mx-auto max-w-6xl px-4 pb-10 text-xs text-muted sm:px-6">
            MedPlate is a planning tool, not medical advice. Nutrient limits are general defaults — confirm yours with your
            doctor or registered dietitian. Nutrient values are estimates from USDA data and vary by brand and preparation.
          </footer>
        </SyncProvider>
      </body>
    </html>
  );
}
