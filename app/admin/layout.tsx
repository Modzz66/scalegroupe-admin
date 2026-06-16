'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import AdminSidebar from '@/components/layout/AdminSidebar'
import AdminTopbar from '@/components/layout/AdminTopbar'

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/projekte': 'Projekte',
  '/admin/kunden': 'Kunden',
  '/admin/rechnungen': 'Rechnungen',
  '/admin/aufgaben': 'Aufgaben',
  '/admin/leads': 'Leads',
  '/admin/kalender': 'Kalender',
  '/admin/dateien': 'Dateien',
  '/admin/einstellungen': 'Einstellungen',
}

function getTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  if (pathname.startsWith('/admin/projekte/')) return 'Projekt Detail'
  if (pathname.startsWith('/admin/kunden/')) return 'Kunden Detail'
  return 'Admin'
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    const user = requireAuth('ADMIN')
    if (user) setAuthed(true)
  }, [])

  if (!authed) {
    return (
      <div className="min-h-screen bg-navy-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-navy-dark">
      <AdminSidebar />
      <main className="flex-1 ml-64 flex flex-col overflow-hidden">
        <AdminTopbar title={getTitle(pathname)} />
        <div className="flex-1 overflow-y-auto p-6 bg-navy-dark">
          {children}
        </div>
      </main>
    </div>
  )
}
