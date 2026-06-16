'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import KundeSidebar from '@/components/layout/KundeSidebar'

export default function KundeLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading' || !session) {
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
