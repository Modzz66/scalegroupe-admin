import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export async function requireAdmin() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return { session: null, err: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  return { session, err: null }
}

export async function requireSession() {
  const session = await auth()
  if (!session?.user) {
    return { session: null, err: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  return { session, err: null }
}
