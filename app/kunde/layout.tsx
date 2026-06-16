'use client'
import { useEffect, useState } from 'react'
import { requireAuth } from '@/lib/auth'
import KundeSidebar from '@/components/layout/KundeSidebar'

export default function KundeLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    const user = requireAuth('KUNDE')
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
      <KundeSidebar />
      <main className="flex-1 ml-64 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  )
}
