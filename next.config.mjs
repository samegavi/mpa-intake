/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow larger file uploads (10MB)
  api: {
    bodyParser: false,
  },
};

export default nextConfig;
