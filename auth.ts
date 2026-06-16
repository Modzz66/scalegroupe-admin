import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.twoFactorEnabled = (user as any).twoFactorEnabled
        token.twoFactorVerified = false
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as string
      ;(session.user as any).role = token.role
      ;(session.user as any).twoFactorEnabled = token.twoFactorEnabled
      ;(session.user as any).twoFactorVerified = token.twoFactorVerified
      return session
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })
        if (!user) return null
        // ADMINs können sich ohne E-Mail-Verifikation einloggen
        if (user.role !== 'ADMIN' && !user.emailVerified) return null
        const ok = await bcrypt.compare(credentials.password as string, user.password)
        return ok ? user : null
      }
    })
  ]
})
