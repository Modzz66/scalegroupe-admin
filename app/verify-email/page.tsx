'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { Suspense } from 'react'

function VerifyContent() {
  const router = useRouter()
  const params = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const token = params.get('token')
    if (!token) { setStatus('error'); setMsg('Kein Token angegeben.'); return }
    fetch(`/api/verify-email?token=${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setStatus('success')
        else { setStatus('error'); setMsg(data.error || 'Fehler') }
      })
      .catch(() => { setStatus('error'); setMsg('Netzwerkfehler.') })
  }, [params])

  return (
    <div className="min-h-screen bg-navy-dark flex items-center justify-center p-4">
      <div className="bg-navy-light border border-navy-border rounded-2xl p-10 max-w-md w-full text-center">
        <Image src="/logo.png" alt="ScaleGroupe" width={120} height={32} className="invert h-8 w-auto object-contain mx-auto mb-6" />
        {status === 'loading' && (
          <>
            <Loader2 size={48} className="animate-spin text-purple mx-auto mb-4" />
            <p className="text-gray-400">E-Mail wird verifiziert...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle size={56} className="text-emerald-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">E-Mail bestätigt!</h1>
            <p className="text-gray-400 mb-6">Dein Konto ist jetzt aktiv. Du kannst dich jetzt anmelden.</p>
            <button onClick={() => router.push('/login')}
              className="w-full py-3 rounded-xl text-white font-semibold"
              style={{ background: 'linear-gradient(135deg,#5B21B6,#9B59F5)' }}>
              Zum Login
            </button>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle size={56} className="text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Link ungültig</h1>
            <p className="text-gray-400 mb-6">{msg}</p>
            <button onClick={() => router.push('/registrieren')}
              className="w-full py-3 rounded-xl text-white font-semibold"
              style={{ background: 'linear-gradient(135deg,#5B21B6,#9B59F5)' }}>
              Erneut registrieren
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-navy-dark flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-purple" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  )
}
