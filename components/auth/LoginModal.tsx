'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Eye, EyeOff, Loader2 } from 'lucide-react'

export default function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'login' | '2fa'>('login')
  const [code, setCode] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const res = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (!res?.ok) { setError('E-Mail oder Passwort falsch.'); return }
    const session = await fetch('/api/auth/session').then(r => r.json())
    if (session?.user?.twoFactorEnabled && !session?.user?.twoFactorVerified) {
      setStep('2fa'); return
    }
    onClose()
    router.push(session?.user?.role === 'ADMIN' ? '/admin' : '/kunde')
    router.refresh()
  }

  const handle2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/2fa/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
    setLoading(false)
    if (!res.ok) { setError('Ungültiger Code.'); return }
    onClose()
    const session = await fetch('/api/auth/session').then(r => r.json())
    router.push(session?.user?.role === 'ADMIN' ? '/admin' : '/kunde')
    router.refresh()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div className="relative bg-navy-light border border-navy-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            <div className="px-8 pt-8 pb-6 text-center border-b border-navy-border">
              <h2 className="text-2xl font-bold text-white">
                {step === 'login' ? 'Willkommen zurück' : '2-Faktor-Authentifizierung'}
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                {step === 'login' ? 'Melde dich in deinem ScaleGroupe-Konto an' : 'Gib den 6-stelligen Code aus deiner App ein'}
              </p>
            </div>
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white bg-navy-dark rounded-full p-1.5 transition-colors">
              <X size={18} />
            </button>
            <div className="p-8">
              {step === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">E-Mail-Adresse</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                      className="w-full px-4 py-3 bg-navy-dark border border-navy-border rounded-xl text-white text-sm focus:outline-none focus:border-purple-400 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Passwort</label>
                    <div className="relative">
                      <input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                        className="w-full px-4 py-3 pr-12 bg-navy-dark border border-navy-border rounded-xl text-white text-sm focus:outline-none focus:border-purple-400 transition-colors" />
                      <button type="button" onClick={() => setShow(!show)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                        {show ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  {error && <p className="text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}
                  <button type="submit" disabled={loading}
                    className="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-70"
                    style={{ background: 'linear-gradient(135deg,#5B21B6,#9B59F5)' }}>
                    {loading && <Loader2 size={18} className="animate-spin" />}
                    {loading ? 'Anmelden...' : 'Anmelden'}
                  </button>
                  <div className="flex justify-between text-sm">
                    <a href="/passwort-reset" className="text-purple-400 hover:underline">Passwort vergessen?</a>
                    <a href="/registrieren" className="text-gray-500 hover:text-gray-300">Konto erstellen →</a>
                  </div>
                </form>
              ) : (
                <form onSubmit={handle2FA} className="space-y-4">
                  <input type="text" value={code} maxLength={6} inputMode="numeric"
                    onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="w-full text-center text-4xl font-mono tracking-[0.5em] px-4 py-4 bg-navy-dark border-2 border-navy-border rounded-xl text-white focus:outline-none focus:border-purple-400" />
                  {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                  <button type="submit" disabled={loading || code.length !== 6}
                    className="w-full py-3 rounded-xl text-white font-bold disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg,#5B21B6,#9B59F5)' }}>
                    {loading ? 'Prüfen...' : 'Bestätigen'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
