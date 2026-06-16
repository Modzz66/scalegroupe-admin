'use client'
import { useState } from 'react'
import { MessageSquare, X } from 'lucide-react'
import { useStore } from '@/lib/store'
import { getCurrentUser } from '@/lib/auth'
import { formatDate } from '@/lib/utils'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

export default function KundeProjektePage() {
  const user = getCurrentUser()
  const { projekte } = useStore()
  const kundeId = user?.kundeId || ''
  const meineProjekte = projekte.filter(p => p.kundeId === kundeId)
  const [feedbackProjekt, setFeedbackProjekt] = useState<string | null>(null)
  const [feedback, setFeedback] = useState('')
  const [danke, setDanke] = useState<Set<string>>(new Set())

  function handleFeedback(projektId: string) {
    setDanke(prev => new Set([...prev, projektId]))
    setFeedbackProjekt(null)
    setFeedback('')
  }

  const MILESTONES = [
    'Kick-off & Briefing', 'Design Entwurf', 'Design Freigabe', 'Entwicklung', 'Review & Testing', 'Launch',
  ]

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-2xl text-white">Meine Projekte</h1>

      {meineProjekte.length === 0 && (
        <Card className="p-12 text-center text-gray-500">Noch keine Projekte vorhanden.</Card>
      )}

      {meineProjekte.map(p => {
        const milestoneIdx = Math.round((p.fortschritt / 100) * (MILESTONES.length - 1))
        return (
          <Card key={p.id} className="p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="font-display font-bold text-xl text-white">{p.name}</h2>
                <p className="text-gray-400 text-sm mt-1">{p.paket}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge status={p.status} />
                {!danke.has(p.id) ? (
                  <Button size="sm" onClick={() => setFeedbackProjekt(p.id)}>
                    <MessageSquare size={14} /> Feedback geben
                  </Button>
                ) : (
                  <span className="text-emerald-400 text-sm font-semibold">✓ Feedback gesendet</span>
                )}
              </div>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Fortschritt</span>
                <span className="text-white font-bold">{p.fortschritt}%</span>
              </div>
              <div className="h-3 bg-navy-dark rounded-full">
                <div className="h-3 rounded-full transition-all"
                  style={{ width:`${p.fortschritt}%`, background:'linear-gradient(135deg,#5B21B6,#9B59F5)' }} />
              </div>
            </div>

            {/* Timeline */}
            <div className="mb-5">
              <p className="text-gray-500 text-xs mb-3 uppercase tracking-wider">Projekt-Timeline</p>
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 right-0 top-3 h-0.5 bg-navy-border" />
                <div className="absolute left-0 top-3 h-0.5 bg-purple transition-all" style={{ width:`${p.fortschritt}%` }} />
                {MILESTONES.map((m, i) => (
                  <div key={m} className="relative flex flex-col items-center gap-2 flex-1">
                    <div className={`w-6 h-6 rounded-full border-2 z-10 flex items-center justify-center ${
                      i <= milestoneIdx ? 'bg-purple border-purple' : 'bg-navy-dark border-navy-border'
                    }`}>
                      {i <= milestoneIdx && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span className="text-xs text-gray-400 text-center leading-tight max-w-[60px]">{m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="bg-navy-dark rounded-xl p-3">
                <p className="text-gray-500 text-xs mb-0.5">Deadline</p>
                <p className="text-white font-semibold">{formatDate(p.deadline)}</p>
              </div>
              <div className="bg-navy-dark rounded-xl p-3">
                <p className="text-gray-500 text-xs mb-0.5">Verantwortlich</p>
                <p className="text-white font-semibold">{p.verantwortlich.split(' ')[0]}</p>
              </div>
              <div className="bg-navy-dark rounded-xl p-3">
                <p className="text-gray-500 text-xs mb-0.5">Beschreibung</p>
                <p className="text-white text-xs leading-relaxed">{p.beschreibung}</p>
              </div>
            </div>
          </Card>
        )
      })}

      {/* Feedback Modal */}
      <Modal open={!!feedbackProjekt} onClose={() => setFeedbackProjekt(null)} title="Feedback geben">
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">Dein Feedback hilft uns, besser zu werden. Vielen Dank!</p>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-400 font-medium">Dein Kommentar</label>
            <textarea rows={4} value={feedback} onChange={e => setFeedback(e.target.value)}
              className="bg-navy-dark border border-navy-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-400 resize-none"
              placeholder="Was läuft gut? Was können wir verbessern?" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button onClick={() => feedbackProjekt && handleFeedback(feedbackProjekt)} disabled={!feedback.trim()}>
            Feedback absenden
          </Button>
          <Button variant="ghost" onClick={() => setFeedbackProjekt(null)}>Abbrechen</Button>
        </div>
      </Modal>
    </div>
  )
}
