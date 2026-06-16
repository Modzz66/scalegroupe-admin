import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/api-auth'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { err } = await requireAdmin()
  if (err) return err
  const { id } = await params
  try {
    const b = await req.json()
    const r = await prisma.rechnung.update({
      where: { id },
      data: {
        status: b.status, betrag: b.betrag ? parseFloat(b.betrag) : undefined,
        beschreibung: b.beschreibung,
        faellig: b.faellig ? new Date(b.faellig) : undefined,
        bezahltAm: b.bezahltAm ? new Date(b.bezahltAm) : undefined,
      },
    })
    return NextResponse.json(r)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { err } = await requireAdmin()
  if (err) return err
  const { id } = await params
  await prisma.rechnung.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
