'use client'
import { useState } from 'react'
import { Star } from 'lucide-react'
import { useStore } from '@/lib/store'
import { getCurrentUser } from '@/lib/auth'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface FeedbackEntry { projektId:string; projektName:string; sterne:number; kommentar:string; datum:string }

export default function KundeFeedbackPage() {
  const user = getCurrentUser()
  const { projekte } = useStore()
  const kundeId = user?.kundeId || ''
  const meineProjekte = projekte.filter(p => p.kundeId === kundeId && p.status !== 'Storniert')

  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [comments, setComments] = useState<Record<string, string>>({})
  const [hover, setHover] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState<Set<string>>(new Set())
  const [history, setHistory] = useState<FeedbackEntry[]>([])

  function handleSubmit(projektId: string, projektName: string) {
    const entry: FeedbackEntry = {
      projektId, projektName, sterne:ratings[projektId] || 0, kommentar:comments[projektId] || '',
      datum:new Date().toLocaleDateString('de-DE'),
    }
    setHistory(prev => [entry, ...prev])
    setSubmitted(prev => new Set([...prev, projektId]))
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Feedback</h1>
        <p className="text-gray-400 mt-1 text-sm">Dein Feedback ist uns wichtig. Vielen Dank für deine Zeit!</p>
      </div>

      {meineProjekte.length === 0 && (
        <Card className="p-12 text-center text-gray-500">Keine aktiven Projekte für Feedback.</Card>
      )}

      {meineProjekte.map(p => (
        <Card key={p.id} className="p-6">
          <h2 className="font-display font-bold text-white text-lg mb-1">{p.name}</h2>
          <p className="text-gray-400 text-sm mb-5">{p.paket} · {p.status}</p>

          {submitted.has(p.id) ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-3">🎉</div>
              <p className="text-emerald-400 font-semibold">Danke für dein Feedback!</p>
              <p className="text-gray-400 text-sm mt-1">Wir melden uns schnellstmöglich bei dir.</p>
              <div className="flex justify-center gap-0.5 mt-3">
                {Array.from({length:5}).map((_,i) => (
                  <Star key={i} size={18} className={i < (ratings[p.id]||0) ? 'text-amber-400 fill-amber-400' : 'text-gray-600'} />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Star Rating */}
              <div>
                <label className="text-sm text-gray-400 font-medium block mb-2">Deine Bewertung</label>
                <div className="flex gap-1">
                  {Array.from({length:5}).map((_,i) => {
                    const val = i + 1
                    const filled = val <= (hover[p.id] || ratings[p.id] || 0)
                    return (
                      <button key={i}
                        onMouseEnter={() => setHover(h => ({...h, [p.id]:val}))}
                        onMouseLeave={() => setHover(h => ({...h, [p.id]:0}))}
                        onClick={() => setRatings(r => ({...r, [p.id]:val}))}>
                        <Star size={28} className={`transition-colors ${filled ? 'text-amber-400 fill-amber-400' : 'text-gray-600 hover:text-amber-300'}`} />
                      </button>
                    )
                  })}
                  {ratings[p.id] > 0 && (
                    <span className="text-gray-400 text-sm ml-2 mt-1">
                      {['','Schlecht','Ausbaufähig','Okay','Gut','Ausgezeichnet!'][ratings[p.id]]}
                    </span>
                  )}
                </div>
              </div>

              {/* Comment */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-gray-400 font-medium">Kommentar</label>
                <textarea rows={4} value={comments[p.id] || ''} onChange={e => setComments(c => ({...c, [p.id]:e.target.value}))}
                  className="bg-navy-dark border border-navy-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-400 resize-none"
                  placeholder="Was läuft gut? Was können wir noch verbessern?" />
              </div>

              <Button onClick={() => handleSubmit(p.id, p.name)} disabled={!ratings[p.id] || !comments[p.id]?.trim()}>
                Feedback absenden
              </Button>
            </div>
          )}
        </Card>
      ))}

      {/* History */}
      {history.length > 0 && (
        <div>
          <h2 className="font-display font-bold text-lg text-white mb-4">Mein bisheriges Feedback</h2>
          <div className="space-y-3">
            {history.map((f, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-semibold text-sm">{f.projektName}</p>
                    <div className="flex gap-0.5 mt-1">
                      {Array.from({length:5}).map((_,j) => (
                        <Star key={j} size={14} className={j < f.sterne ? 'text-amber-400 fill-amber-400' : 'text-gray-600'} />
                      ))}
                    </div>
                    <p className="text-gray-400 text-sm mt-2">{f.kommentar}</p>
                  </div>
                  <span className="text-gray-500 text-xs">{f.datum}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
