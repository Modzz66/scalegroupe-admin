'use client'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, Phone, Mail, Euro, FolderOpen, Receipt, FileText } from 'lucide-react'
import { useStore } from '@/lib/store'
import { MOCK_DATEIEN } from '@/lib/mock-data'
import { formatEuro, formatDate } from '@/lib/utils'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

const TABS = ['Projekte','Rechnungen','Dateien','Notizen'] as const
type Tab = typeof TABS[number]

export default function KundeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { kunden, projekte, rechnungen } = useStore()
  const kunde = kunden.find(k => k.id === params.id)
  const [tab, setTab] = useState<Tab>('Projekte')
  const [notes, setNotes] = useState('')

  if (!kunde) return (
    <div className="text-center py-12">
      <p className="text-gray-400">Kunde nicht gefunden.</p>
      <Button variant="ghost" onClick={() => router.back()} className="mt-4"><ArrowLeft size={14} /> Zurück</Button>
    </div>
  )

  const kundeProjects = projekte.filter(p => p.kundeId === kunde.id)
  const kundeRechnungen = rechnungen.filter(r => r.kundeId === kunde.id)
  const kundeDateien = MOCK_DATEIEN.filter(d => d.kundeId === kunde.id)
  const offeneRechnungen = kundeRechnungen.filter(r => r.status !== 'Bezahlt').reduce((s, r) => s + r.betrag, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/admin/kunden')} className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
      </div>

      <Card className="p-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
            style={{ background:'linear-gradient(135deg,#5B21B6,#9B59F5)' }}>
            {kunde.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="font-display font-bold text-2xl text-white">{kunde.name}</h1>
                <p className="text-gray-400 mt-1">{kunde.unternehmen}</p>
                <span className="inline-block mt-2 text-xs bg-purple/20 text-purple-light px-2.5 py-1 rounded-full font-semibold">{kunde.paket}</span>
              </div>
              <Badge status={kunde.status} />
            </div>
          </div>
        </div>
      </Card>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><Euro size={20} className="text-emerald-400" /></div>
          <div><p className="text-2xl font-bold text-white font-display">{formatEuro(kunde.umsatz)}</p><p className="text-sm text-gray-400">Gesamtumsatz</p></div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><FolderOpen size={20} className="text-blue-400" /></div>
          <div><p className="text-2xl font-bold text-white font-display">{kundeProjects.length}</p><p className="text-sm text-gray-400">Projekte gesamt</p></div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center"><Receipt size={20} className="text-amber-400" /></div>
          <div><p className="text-2xl font-bold text-white font-display">{formatEuro(offeneRechnungen)}</p><p className="text-sm text-gray-400">Offene Rechnungen</p></div>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          {/* Tabs */}
          <div className="flex gap-1 mb-4 border-b border-navy-border">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 ${tab===t ? 'text-white border-purple' : 'text-gray-400 border-transparent hover:text-white'}`}>
                {t}
              </button>
            ))}
          </div>

          {tab === 'Projekte' && (
            <div className="space-y-3">
              {kundeProjects.map(p => (
                <Card key={p.id} className="p-4 hover:border-purple/50 cursor-pointer transition-all" onClick={() => router.push(`/admin/projekte/${p.id}`)}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-white">{p.name}</p>
                    <Badge status={p.status} />
                  </div>
                  <div className="h-1.5 bg-navy-dark rounded-full">
                    <div className="h-1.5 rounded-full bg-purple" style={{ width:`${p.fortschritt}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{p.fortschritt}% abgeschlossen · Deadline: {formatDate(p.deadline)}</p>
                </Card>
              ))}
              {kundeProjects.length === 0 && <p className="text-gray-500 text-sm py-4">Keine Projekte.</p>}
            </div>
          )}

          {tab === 'Rechnungen' && (
            <div className="space-y-3">
              {kundeRechnungen.map(r => (
                <Card key={r.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{r.nummer}</p>
                      <p className="text-xs text-gray-500 mt-1">{r.beschreibung}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">{formatEuro(r.betrag)}</p>
                      <Badge status={r.status} />
                    </div>
                  </div>
                </Card>
              ))}
              {kundeRechnungen.length === 0 && <p className="text-gray-500 text-sm py-4">Keine Rechnungen.</p>}
            </div>
          )}

          {tab === 'Dateien' && (
            <div className="space-y-3">
              {kundeDateien.map(d => (
                <Card key={d.id} className="p-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${d.typ==='pdf' ? 'bg-red-500/10' : d.typ==='fig' ? 'bg-purple-500/10' : 'bg-blue-500/10'}`}>
                    <FileText size={18} className={d.typ==='pdf' ? 'text-red-400' : d.typ==='fig' ? 'text-purple-light' : 'text-blue-400'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{d.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{d.groesse} · {formatDate(d.datum)}</p>
                  </div>
                  <span className="text-xs bg-navy-dark border border-navy-border px-2 py-1 rounded-lg text-gray-400">{d.ordner}</span>
                </Card>
              ))}
              {kundeDateien.length === 0 && <p className="text-gray-500 text-sm py-4">Keine Dateien.</p>}
            </div>
          )}

          {tab === 'Notizen' && (
            <Card className="p-4">
              <textarea rows={8} value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Notizen zum Kunden..."
                className="w-full bg-navy-dark border border-navy-border rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-400 resize-none" />
              <Button className="mt-3" size="sm">Speichern</Button>
            </Card>
          )}
        </div>

        {/* Right: Contact */}
        <Card className="p-6 h-fit">
          <h3 className="font-semibold text-white mb-4">Kontaktdaten</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center"><Mail size={14} className="text-blue-400" /></div>
              <div><p className="text-xs text-gray-500">E-Mail</p><p className="text-sm text-white">{kunde.email}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center"><Phone size={14} className="text-emerald-400" /></div>
              <div><p className="text-xs text-gray-500">Telefon</p><p className="text-sm text-white">{kunde.telefon}</p></div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-navy-border">
            <p className="text-xs text-gray-500">Kunde seit</p>
            <p className="text-sm text-white font-semibold mt-1">{formatDate(kunde.seit + '-01')}</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
