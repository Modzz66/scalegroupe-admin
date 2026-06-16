import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/api-auth'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { err } = await requireAdmin()
  if (err) return err
  const { id } = await params
  try {
    const b = await req.json()
    const a = await prisma.aufgabe.update({
      where: { id },
      data: {
        titel: b.titel, beschreibung: b.beschreibung, status: b.status,
        prioritaet: b.prioritaet, verantwortlich: b.verantwortlich,
        faellig: b.faellig ? new Date(b.faellig) : undefined,
        projektId: b.projektId || null,
      },
    })
    return NextResponse.json(a)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { err } = await requireAdmin()
  if (err) return err
  const { id } = await params
  await prisma.aufgabe.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
