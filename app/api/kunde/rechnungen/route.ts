export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { requireSession } from '@/lib/api-auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const { session, err } = await requireSession()
  if (err) return err
  const kunde = await prisma.kunde.findUnique({ where: { userId: session!.user.id } })
  if (!kunde) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const rechnungen = await prisma.rechnung.findMany({
    where: { kundeId: kunde.id },
    orderBy: { datum: 'desc' },
  })
  return NextResponse.json(rechnungen.map(r => ({
    id: r.id, nummer: r.nummer, betrag: r.betrag, status: r.status,
    datum: new Date(r.datum).toISOString().split('T')[0],
    faellig: r.faellig ? new Date(r.faellig).toISOString().split('T')[0] : '',
    beschreibung: r.beschreibung || '',
  })))
}
