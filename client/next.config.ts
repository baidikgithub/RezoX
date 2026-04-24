import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/predict/:path*',
        destination: 'http://localhost:8000/api/predict/:path*',
      },
      {
        source: '/api/listings/:path*',
        destination: 'http://localhost:8000/api/listings/:path*',
      },
    ];
  },
};

export default nextConfig;
