import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow larger file uploads (10MB)
  api: {
    bodyParser: false,
  },
};

export default nextConfig;
