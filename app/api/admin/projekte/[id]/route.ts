export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/api-auth'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { err } = await requireAdmin()
  if (err) return err
  const { id } = await params
  try {
    const b = await req.json()
    const p = await prisma.projekt.update({
      where: { id },
      data: {
        name: b.name, beschreibung: b.beschreibung, paket: b.paket,
        status: b.status, fortschritt: b.fortschritt !== undefined ? parseInt(b.fortschritt) : undefined,
        budget: b.budget !== undefined ? parseFloat(b.budget) : undefined,
        deadline: b.deadline ? new Date(b.deadline) : undefined,
        verantwortlich: b.verantwortlich,
      },
      include: { kunde: true },
    })
    return NextResponse.json(p)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { err } = await requireAdmin()
  if (err) return err
  const { id } = await params
  await prisma.projekt.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
