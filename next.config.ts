import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the dev-only badge clear of the mobile bottom tab bar.
  devIndicators: { position: "top-right" },
};

export default nextConfig;
