import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The dev-only badge overlaps the header button and the mobile tab bar. Build errors still show as an overlay.
  devIndicators: false,
};

export default nextConfig;
