import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: '/api/:path*',
}

export function middleware(request: NextRequest) {
  // Allow large file uploads by not limiting body size in middleware
  return NextResponse.next()
}
