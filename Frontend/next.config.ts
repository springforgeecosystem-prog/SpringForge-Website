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
    // middleware.ts matches /api/* which causes Next.js to buffer the body.
    // Default is 10MB — must increase for large plugin uploads.
    // @ts-ignore — type definitions lag behind; proxyClientMaxBodySize is valid at runtime
    proxyClientMaxBodySize: '1gb',
  },

}

export default nextConfig
