'use client'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, Calendar, Euro, User, Clock, ExternalLink } from 'lucide-react'
import { useStore } from '@/lib/store'
import { formatEuro, formatDate } from '@/lib/utils'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'

const STATUS_OPTIONS = ['Offen','In Bearbeitung','Review / Feedback','Abgeschlossen','Pausiert','Storniert']

export default function ProjektDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { projekte, aufgaben, updateProjekt } = useStore()
  const projekt = projekte.find(p => p.id === params.id)
  const [notes, setNotes] = useState('')

  if (!projekt) return (
    <div className="text-center py-12">
      <p className="text-gray-400">Projekt nicht gefunden.</p>
      <Button variant="ghost" onClick={() => router.back()} className="mt-4"><ArrowLeft size={14} /> Zurück</Button>
    </div>
  )

  const projektAufgaben = aufgaben.filter(a => a.projektId === projekt.id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/admin/projekte')} className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-display font-bold text-2xl text-white">{projekt.name}</h1>
            <Badge status={projekt.status} />
          </div>
          <p className="text-gray-400 text-sm mt-1">{projekt.kundeName} · {projekt.paket}</p>
        </div>
        <Select
          options={STATUS_OPTIONS.map(v => ({ value:v, label:v }))}
          value={projekt.status}
          onChange={e => updateProjekt(projekt.id, { status: e.target.value as typeof projekt.status })}
          className="w-48"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Main Content */}
        <div className="col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold text-white mb-3">Beschreibung</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{projekt.beschreibung || 'Keine Beschreibung vorhanden.'}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Fortschritt</h3>
              <span className="text-2xl font-bold text-white font-display">{projekt.fortschritt}%</span>
            </div>
            <div className="h-3 bg-navy-dark rounded-full mb-2">
              <div className="h-3 rounded-full transition-all" style={{ width:`${projekt.fortschritt}%`, background:'linear-gradient(90deg,#5B21B6,#9B59F5)' }} />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Start: {formatDate(projekt.erstellt)}</span>
              <span>Deadline: {formatDate(projekt.deadline)}</span>
            </div>
            <div className="mt-4">
              <input
                type="range" min="0" max="100" value={projekt.fortschritt}
                onChange={e => updateProjekt(projekt.id, { fortschritt: parseInt(e.target.value) })}
                className="w-full accent-purple"
              />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-white mb-4">Aufgaben ({projektAufgaben.length})</h3>
            {projektAufgaben.length === 0 ? (
              <p className="text-gray-500 text-sm">Keine Aufgaben für dieses Projekt.</p>
            ) : (
              <div className="space-y-3">
                {projektAufgaben.map(a => (
                  <div key={a.id} className="flex items-center justify-between p-3 bg-navy-dark rounded-xl">
                    <div>
                      <p className="text-sm font-semibold text-white">{a.titel}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{a.beschreibung}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge status={a.status} />
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        a.prioritaet==='Hoch' ? 'bg-red-500/15 text-red-400' :
                        a.prioritaet==='Mittel' ? 'bg-amber-500/15 text-amber-400' :
                        'bg-gray-500/15 text-gray-400'
                      }`}>{a.prioritaet}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-white mb-3">Notizen</h3>
            <textarea
              rows={4}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Notizen zum Projekt..."
              className="w-full bg-navy-dark border border-navy-border rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-400 resize-none"
            />
          </Card>
        </div>

        {/* Right: Info Card */}
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold text-white mb-4">Projekt Info</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Calendar size={14} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Deadline</p>
                  <p className="text-sm text-white font-semibold">{formatDate(projekt.deadline)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <Euro size={14} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Budget</p>
                  <p className="text-sm text-white font-semibold">{formatEuro(projekt.budget)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <User size={14} className="text-purple-light" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Verantwortlich</p>
                  <p className="text-sm text-white font-semibold">{projekt.verantwortlich}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
                  <Clock size={14} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Erstellt am</p>
                  <p className="text-sm text-white font-semibold">{formatDate(projekt.erstellt)}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-white mb-4">Kunde</h3>
            <p className="text-sm text-white font-semibold">{projekt.kundeName}</p>
            <p className="text-xs text-gray-500 mt-1">{projekt.paket}</p>
            <button
              onClick={() => router.push(`/admin/kunden/${projekt.kundeId}`)}
              className="mt-4 flex items-center gap-2 text-xs text-purple-light hover:text-purple transition-colors"
            >
              <ExternalLink size={12} /> Kundenprofil öffnen
            </button>
          </Card>
        </div>
      </div>
    </div>
  )
}
