export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/api-auth'
import { NextResponse } from 'next/server'

function toAufgabe(a: any) {
  return {
    id: a.id,
    titel: a.titel,
    beschreibung: a.beschreibung || '',
    projektId: a.projektId || '',
    projektName: a.projekt?.name || '',
    verantwortlich: a.verantwortlich || '',
    prioritaet: a.prioritaet,
    status: a.status,
    faellig: a.faellig ? new Date(a.faellig).toISOString().split('T')[0] : '',
  }
}

export async function GET() {
  const { err } = await requireAdmin()
  if (err) return err
  const rows = await prisma.aufgabe.findMany({ include: { projekt: true }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(rows.map(toAufgabe))
}

export async function POST(req: Request) {
  const { err } = await requireAdmin()
  if (err) return err
  try {
    const b = await req.json()
    const a = await prisma.aufgabe.create({
      data: {
        titel: b.titel, beschreibung: b.beschreibung, status: b.status || 'Todo',
        prioritaet: b.prioritaet || 'Mittel', verantwortlich: b.verantwortlich,
        faellig: b.faellig ? new Date(b.faellig) : null,
        projektId: b.projektId || null,
      },
      include: { projekt: true },
    })
    return NextResponse.json(toAufgabe(a))
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
