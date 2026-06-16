export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { requireSession } from '@/lib/api-auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const { session, err } = await requireSession()
  if (err) return err
  const kunde = await prisma.kunde.findUnique({ where: { userId: session!.user.id } })
  if (!kunde) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const projekte = await prisma.projekt.findMany({
    where: { kundeId: kunde.id },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(projekte.map(p => ({
    id: p.id, name: p.name, status: p.status, fortschritt: p.fortschritt,
    paket: p.paket || '', deadline: p.deadline ? new Date(p.deadline).toISOString().split('T')[0] : '',
    beschreibung: p.beschreibung || '',
  })))
}
