import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  // Exclude /api/admin/upload from middleware to avoid 10MB body buffering limit
  matcher: '/api/((?!admin/upload).*)',
}

export function middleware(request: NextRequest) {
  // Allow large file uploads by not limiting body size in middleware
  return NextResponse.next()
}
