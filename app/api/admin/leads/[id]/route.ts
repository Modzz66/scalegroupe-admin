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
    const l = await prisma.lead.update({
      where: { id },
      data: { status: b.status, gelesen: b.gelesen },
    })
    return NextResponse.json(l)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { err } = await requireAdmin()
  if (err) return err
  const { id } = await params
  await prisma.lead.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
