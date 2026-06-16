'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react'
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

    const res = await signIn('credentials', { email, password, redirect: false })

    if (!res?.ok) {
      setError('E-Mail oder Passwort falsch.')
      setLoading(false)
      return
    }

    // Session abrufen und nach Rolle weiterleiten
    const session = await fetch('/api/auth/session').then(r => r.json())
    if (session?.user?.role === 'ADMIN') {
      router.push('/admin')
    } else {
      router.push('/kunde')
    }
    router.refresh()
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
              className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg,#5B21B6,#9B59F5)' }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Wird angemeldet...' : 'Anmelden'}
            </button>

            <div className="flex items-center justify-between text-sm pt-1">
              <a href="/passwort-reset" className="text-purple-400 hover:text-purple-300 transition-colors">
                Passwort vergessen?
              </a>
              <a href="/registrieren" className="text-gray-500 hover:text-gray-300 transition-colors">
                Konto erstellen →
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
