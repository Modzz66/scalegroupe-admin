'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await signIn('credentials', { email, password, redirect: false })

      if (!res?.ok) {
        setError('E-Mail oder Passwort falsch.')
        setLoading(false)
        return
      }

      const session = await fetch('/api/auth/session').then(r => r.json())

      if (session?.user?.role === 'ADMIN') {
        window.location.href = '/admin'
      } else if (session?.user) {
        window.location.href = '/kunde'
      } else {
        window.location.href = '/admin'
      }
    } catch {
      setError('Verbindungsfehler. Bitte versuche es erneut.')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #EEE9FF 0%, #F8F7FF 60%, #F0F4FF 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 8px 48px rgba(91, 33, 182, 0.13), 0 2px 12px rgba(0,0,0,0.06)',
        width: '100%',
        maxWidth: '420px',
        padding: '44px 40px',
      }}>
        {/* Logo */}
        <img
          src="/logo.jpg"
          alt="ScaleGroupe"
          style={{ height: '48px', objectFit: 'contain', marginBottom: '36px', display: 'block' }}
        />

        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#13162B', marginBottom: '6px', margin: '0 0 6px' }}>
          Willkommen zurück
        </h1>
        <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 32px', lineHeight: 1.5 }}>
          Melde dich an, um dein Dashboard zu öffnen.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '7px' }}>
              E-Mail-Adresse
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="deine@email.de"
              required
              autoComplete="email"
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1.5px solid #E2E8F0',
                fontSize: '14px',
                color: '#13162B',
                background: '#FAFAFA',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => (e.target.style.borderColor = '#7C3AED')}
              onBlur={e => (e.target.style.borderColor = '#E2E8F0')}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                Passwort
              </label>
              <a href="/passwort-reset" style={{ fontSize: '13px', color: '#7C3AED', textDecoration: 'none', fontWeight: 500 }}>
                Vergessen?
              </a>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                style={{
                  width: '100%',
                  padding: '11px 44px 11px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid #E2E8F0',
                  fontSize: '14px',
                  color: '#13162B',
                  background: '#FAFAFA',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => (e.target.style.borderColor = '#7C3AED')}
                onBlur={e => (e.target.style.borderColor = '#E2E8F0')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9CA3AF',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              padding: '11px 14px',
              borderRadius: '10px',
              background: 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#DC2626',
              fontSize: '13px',
              fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #5B21B6, #7C3AED)',
              color: 'white',
              fontSize: '15px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '4px',
              transition: 'opacity 0.15s, transform 0.1s',
            }}
            onMouseOver={e => { if (!loading) (e.currentTarget.style.transform = 'translateY(-1px)') }}
            onMouseOut={e => { (e.currentTarget.style.transform = 'translateY(0)') }}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'Anmelden...' : 'Anmelden'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#9CA3AF', marginTop: '28px', marginBottom: 0 }}>
          Noch kein Konto?{' '}
          <a href="/registrieren" style={{ color: '#7C3AED', fontWeight: 600, textDecoration: 'none' }}>
            Jetzt registrieren
          </a>
        </p>
      </div>
    </div>
  )
}
