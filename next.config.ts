import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow larger file uploads (50MB)
  serverExternalPackages: [],
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
