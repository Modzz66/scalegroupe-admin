import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  if (pathname.startsWith('/admin')) {
    if (!session?.user)
      return NextResponse.redirect(new URL('/login', req.url))
    if ((session.user as any).role !== 'ADMIN')
      return NextResponse.redirect(new URL('/kunde', req.url))
  }

  if (pathname.startsWith('/kunde')) {
    if (!session?.user)
      return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*', '/kunde/:path*'],
}
