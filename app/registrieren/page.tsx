'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import Image from 'next/image'

export default function RegistrierenPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', unternehmen: '', agb: false })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Passwörter stimmen nicht überein.'); return }
    if (form.password.length < 8) { setError('Passwort muss mindestens 8 Zeichen haben.'); return }
    setLoading(true); setError('')
    const res = await fetch('/api/registrieren', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password, unternehmen: form.unternehmen }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error || 'Fehler beim Registrieren.'); return }
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-navy-dark flex items-center justify-center p-4">
        <div className="bg-navy-light border border-navy-border rounded-2xl p-10 max-w-md w-full text-center">
          <CheckCircle size={56} className="text-emerald-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Fast geschafft!</h1>
          <p className="text-gray-400 mb-6">Wir haben dir eine Bestätigungs-E-Mail geschickt.<br />Bitte bestätige deine E-Mail-Adresse, um dich anzumelden.</p>
          <button onClick={() => router.push('/login')}
            className="w-full py-3 rounded-xl text-white font-semibold"
            style={{ background: 'linear-gradient(135deg,#5B21B6,#9B59F5)' }}>
            Zum Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-navy-light border border-navy-border rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div style={{ background: 'white', borderRadius: '10px', padding: '6px 14px', display: 'inline-flex', marginBottom: '16px' }}>
              <Image src="/logo.jpg" alt="ScaleGroupe" width={130} height={36} className="h-9 w-auto object-contain" />
            </div>
            <h1 className="font-bold text-2xl text-white">Konto erstellen</h1>
            <p className="text-gray-400 text-sm mt-1">Starte dein ScaleGroupe-Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Name', key: 'name', type: 'text', placeholder: 'Max Mustermann' },
              { label: 'E-Mail', key: 'email', type: 'email', placeholder: 'max@firma.de' },
              { label: 'Unternehmen (optional)', key: 'unternehmen', type: 'text', placeholder: 'Muster GmbH' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-sm text-gray-400 font-medium block mb-1.5">{f.label}</label>
                <input type={f.type} value={(form as any)[f.key]} onChange={e => set(f.key, e.target.value)}
                  placeholder={f.placeholder} required={f.key !== 'unternehmen'}
                  className="w-full bg-navy-dark border border-navy-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-400 transition-colors" />
              </div>
            ))}

            {(['password', 'confirm'] as const).map((k, i) => (
              <div key={k}>
                <label className="text-sm text-gray-400 font-medium block mb-1.5">{i === 0 ? 'Passwort' : 'Passwort bestätigen'}</label>
                <div className="relative">
                  <input type={show ? 'text' : 'password'} value={form[k]} onChange={e => set(k, e.target.value)}
                    placeholder="••••••••" required minLength={8}
                    className="w-full bg-navy-dark border border-navy-border rounded-xl px-4 py-2.5 pr-10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-400 transition-colors" />
                  {i === 0 && (
                    <button type="button" onClick={() => setShow(!show)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                      {show ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.agb} onChange={e => set('agb', e.target.checked)} required
                className="w-4 h-4 rounded border-navy-border accent-purple" />
              <span className="text-sm text-gray-400">Ich akzeptiere die <a href="/agb" className="text-purple-400 hover:underline">AGB</a></span>
            </label>

            {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"><p className="text-red-400 text-sm">{error}</p></div>}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg,#5B21B6,#9B59F5)' }}>
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Wird erstellt...' : 'Konto erstellen'}
            </button>

            <p className="text-center text-sm text-gray-500">
              Bereits registriert? <a href="/login" className="text-purple-400 hover:underline">Anmelden</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
