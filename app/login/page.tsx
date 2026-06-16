'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

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

    const session = await fetch('/api/auth/session').then(r => r.json())
    if (session?.user?.role === 'ADMIN') {
      router.push('/admin')
    } else {
      router.push('/kunde')
    }
    router.refresh()
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0D0F1F' }}>
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #1C1F3A 0%, #13162B 100%)' }}>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #7C3AED, transparent)' }} />
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #9B59F5, transparent)' }} />
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="relative text-center px-12">
          <img src="/logo.jpg" alt="ScaleGroupe" className="h-12 w-auto mx-auto mb-8 object-contain brightness-0 invert" />
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'system-ui' }}>
            Willkommen zurück
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Dein persönliches Dashboard für Projekte, Rechnungen und mehr.
          </p>
          <div className="mt-10 flex flex-col gap-4">
            {['Projekte verwalten', 'Rechnungen einsehen', 'Dateien austauschen'].map(item => (
              <div key={item} className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)' }}>
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <img src="/logo.jpg" alt="ScaleGroupe" className="h-10 w-auto mb-8 object-contain brightness-0 invert lg:hidden" />
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'system-ui' }}>Anmelden</h1>
          <p className="text-gray-400 text-sm mb-8">Gib deine Zugangsdaten ein um fortzufahren.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">E-Mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="deine@email.de"
                required
                className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-gray-600 outline-none transition-all"
                style={{ background: '#1C1F3A', border: '1px solid rgba(255,255,255,0.08)' }}
                onFocus={e => (e.target.style.borderColor = '#7C3AED')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Passwort</label>
                <a href="/passwort-reset" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                  Vergessen?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-11 rounded-xl text-white text-sm placeholder-gray-600 outline-none transition-all"
                  style={{ background: '#1C1F3A', border: '1px solid rgba(255,255,255,0.08)' }}
                  onFocus={e => (e.target.style.borderColor = '#7C3AED')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl text-sm text-red-400"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-opacity disabled:opacity-60 mt-1"
              style={{ background: 'linear-gradient(135deg, #5B21B6, #7C3AED)' }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Anmelden...' : 'Anmelden'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Noch kein Konto?{' '}
            <a href="/registrieren" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
              Jetzt registrieren
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
