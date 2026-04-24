import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Keep Turbopack scoped to the client app to avoid manifest writes
    // resolving against the monorepo root when multiple lockfiles exist.
    root: path.resolve(__dirname),
  },
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
