'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/auth'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 500))
    const user = login(email, password)
    if (user) {
      router.push(user.role === 'ADMIN' ? '/admin' : '/kunde')
    } else {
      setError('E-Mail oder Passwort falsch.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-dark flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-dark/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple/10 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
        <div className="bg-navy-light border border-navy-border rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <Image src="/logo.png" alt="ScaleGroupe" width={150} height={40} className="invert h-10 w-auto object-contain mb-4" />
            <h1 className="font-display font-bold text-2xl text-white">Admin Login</h1>
            <p className="text-gray-400 text-sm mt-1">Meld dich mit deinem Account an</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-400 font-medium">E-Mail</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="deine@email.de"
                  required
                  className="w-full bg-navy-dark border border-navy-border rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-400 transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-400 font-medium">Passwort</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-navy-dark border border-navy-border rounded-xl pl-10 pr-10 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ background:'linear-gradient(135deg,#5B21B6,#9B59F5)' }}
            >
              {loading ? 'Wird angemeldet...' : 'Anmelden'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-navy-dark rounded-xl border border-navy-border">
            <p className="text-xs text-gray-500 font-semibold mb-2">Test-Zugänge:</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p><span className="text-gray-400">Admin:</span> enes@scalegroupe.de / admin123</p>
              <p><span className="text-gray-400">Kunde:</span> mueller@baeckerei.de / kunde123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
