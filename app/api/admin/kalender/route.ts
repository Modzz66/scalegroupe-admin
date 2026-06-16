export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/api-auth'
import { NextResponse } from 'next/server'

function toTermin(t: any) {
  return {
    id: t.id,
    titel: t.titel,
    datum: new Date(t.datum).toISOString().split('T')[0],
    uhrzeit: t.uhrzeit,
    typ: t.typ,
    kundeId: t.kundeId || undefined,
  }
}

export async function GET() {
  const { err } = await requireAdmin()
  if (err) return err
  const rows = await prisma.termin.findMany({ orderBy: { datum: 'asc' } })
  return NextResponse.json(rows.map(toTermin))
}

export async function POST(req: Request) {
  const { err } = await requireAdmin()
  if (err) return err
  try {
    const b = await req.json()
    const t = await prisma.termin.create({
      data: {
        titel: b.titel,
        datum: new Date(b.datum),
        uhrzeit: b.uhrzeit,
        typ: b.typ || 'Meeting',
        notizen: b.notizen,
        kundeId: b.kundeId || null,
      },
    })
    return NextResponse.json(toTermin(t))
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
