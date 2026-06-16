export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/api-auth'
import { NextResponse } from 'next/server'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { err } = await requireAdmin()
  if (err) return err
  const { id } = await params
  const k = await prisma.kunde.findUnique({
    where: { id },
    include: {
      projekte: { orderBy: { createdAt: 'desc' } },
      rechnungen: { orderBy: { datum: 'desc' } },
      termine: { orderBy: { datum: 'asc' } },
    },
  })
  if (!k) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(k)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { err } = await requireAdmin()
  if (err) return err
  const { id } = await params
  try {
    const b = await req.json()
    const k = await prisma.kunde.update({
      where: { id },
      data: {
        name: b.name, email: b.email, telefon: b.telefon,
        unternehmen: b.unternehmen, paket: b.paket,
        status: b.status, notizen: b.notizen,
      },
    })
    return NextResponse.json(k)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { err } = await requireAdmin()
  if (err) return err
  const { id } = await params
  await prisma.kunde.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
