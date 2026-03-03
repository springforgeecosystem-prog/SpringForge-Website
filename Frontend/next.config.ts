import type { NextConfig } from 'next'

const API_URL = process.env.API_URL ?? 'http://localhost:4000'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_URL}/api/:path*`,
      },
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '1gb',
    },
  },
  // Disable body size limit for API routes
  api: {
    bodyParser: {
      sizeLimit: '1gb',
    },
  },
}

export default nextConfig
