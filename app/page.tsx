'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('sg_user')
    if (stored) {
      const user = JSON.parse(stored)
      if (user.role === 'ADMIN') {
        router.replace('/admin')
      } else {
        router.replace('/kunde')
      }
    } else {
      router.replace('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-navy-dark flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-purple border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Wird geladen...</p>
      </div>
    </div>
  )
}
