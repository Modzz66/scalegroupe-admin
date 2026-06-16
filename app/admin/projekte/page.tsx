'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, LayoutGrid, List, Search, Calendar, Euro } from 'lucide-react'
import { useStore } from '@/lib/store'
import { KUNDEN } from '@/lib/mock-data'
import { formatEuro, formatDate } from '@/lib/utils'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'

const STATUS_FILTERS = ['Alle','Offen','In Bearbeitung','Review / Feedback','Abgeschlossen','Pausiert','Storniert']

export default function ProjektePage() {
  const router = useRouter()
  const { projekte, addProjekt } = useStore()
  const [filter, setFilter] = useState('Alle')
  const [view, setView] = useState<'karten'|'tabelle'>('karten')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    name:'', kundeId:'k1', paket:'Pro-Paket', deadline:'', budget:'', beschreibung:'', verantwortlich:'Enes Gökgül'
  })

  const filtered = projekte.filter(p => {
    const matchFilter = filter === 'Alle' || p.status === filter
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.kundeName.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  function handleSave() {
    const k = KUNDEN.find(k => k.id === form.kundeId)
    addProjekt({
      id:`p${Date.now()}`, name:form.name, kundeId:form.kundeId, kundeName:k?.unternehmen||'', paket:form.paket,
      status:'Offen', deadline:form.deadline, budget:parseInt(form.budget)||0, fortschritt:0,
      beschreibung:form.beschreibung, verantwortlich:form.verantwortlich, erstellt:new Date().toISOString().split('T')[0]
    })
    setShowModal(false)
    setForm({ name:'', kundeId:'k1', paket:'Pro-Paket', deadline:'', budget:'', beschreibung:'', verantwortlich:'Enes Gökgül' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{projekte.length} Projekte gesamt</p>
        </div>
        <Button onClick={() => setShowModal(true)}><Plus size={14} /> Neues Projekt</Button>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-1 flex-wrap">
          {STATUS_FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filter === f ? 'bg-purple text-white' : 'text-gray-400 hover:text-white hover:bg-navy-light'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Suchen..."
              className="bg-navy-light border border-navy-border rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-400 w-48" />
          </div>
          <button onClick={() => setView('karten')}
            className={`p-2 rounded-xl transition-colors ${view==='karten' ? 'bg-purple text-white' : 'text-gray-400 hover:text-white hover:bg-navy-light'}`}>
            <LayoutGrid size={16} />
          </button>
          <button onClick={() => setView('tabelle')}
            className={`p-2 rounded-xl transition-colors ${view==='tabelle' ? 'bg-purple text-white' : 'text-gray-400 hover:text-white hover:bg-navy-light'}`}>
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      {view === 'karten' ? (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map(p => (
            <Card key={p.id} className="p-5 hover:border-purple/50 transition-all cursor-pointer group" onClick={() => router.push(`/admin/projekte/${p.id}`)}>
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-white group-hover:text-purple-light transition-colors">{p.name}</h3>
                <Badge status={p.status} />
              </div>
              <p className="text-sm text-gray-400 mb-4">{p.kundeName}</p>
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>Fortschritt</span>
                  <span className="font-semibold text-white">{p.fortschritt}%</span>
                </div>
                <div className="h-2 bg-navy-dark rounded-full">
                  <div className="h-2 rounded-full transition-all" style={{ width:`${p.fortschritt}%`, background:'linear-gradient(90deg,#5B21B6,#9B59F5)' }} />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1"><Calendar size={12} /> {formatDate(p.deadline)}</div>
                <div className="flex items-center gap-1"><Euro size={12} /> {formatEuro(p.budget)}</div>
              </div>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-12 text-gray-500">Keine Projekte gefunden.</div>
          )}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-navy-border">
              <tr>
                {['#','Projekt','Kunde','Paket','Status','Fortschritt','Deadline','Budget'].map(h => (
                  <th key={h} className="text-left text-gray-500 px-4 py-3 font-medium text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-border">
              {filtered.map((p, i) => (
                <tr key={p.id} className="hover:bg-navy-light/50 cursor-pointer transition-colors" onClick={() => router.push(`/admin/projekte/${p.id}`)}>
                  <td className="px-4 py-3 text-gray-500">{i+1}</td>
                  <td className="px-4 py-3 text-white font-semibold">{p.name}</td>
                  <td className="px-4 py-3 text-gray-400">{p.kundeName}</td>
                  <td className="px-4 py-3 text-gray-400">{p.paket}</td>
                  <td className="px-4 py-3"><Badge status={p.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-navy-dark rounded-full">
                        <div className="h-1.5 rounded-full bg-purple" style={{ width:`${p.fortschritt}%` }} />
                      </div>
                      <span className="text-gray-400 text-xs">{p.fortschritt}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{formatDate(p.deadline)}</td>
                  <td className="px-4 py-3 text-white font-semibold">{formatEuro(p.budget)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Neues Projekt" size="lg">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Projektname" value={form.name} onChange={e => setForm(f => ({...f, name:e.target.value}))} placeholder="z.B. Website Relaunch" className="col-span-2" />
          <Select label="Kunde" value={form.kundeId} onChange={e => setForm(f => ({...f, kundeId:e.target.value}))}
            options={KUNDEN.map(k => ({ value:k.id, label:k.unternehmen }))} />
          <Select label="Paket" value={form.paket} onChange={e => setForm(f => ({...f, paket:e.target.value}))}
            options={['Starter-Paket','Pro-Paket','Premium-Paket','Marketing-Retainer'].map(v => ({ value:v, label:v }))} />
          <Input label="Deadline" type="date" value={form.deadline} onChange={e => setForm(f => ({...f, deadline:e.target.value}))} />
          <Input label="Budget (€)" type="number" value={form.budget} onChange={e => setForm(f => ({...f, budget:e.target.value}))} placeholder="2499" />
          <Select label="Verantwortlich" value={form.verantwortlich} onChange={e => setForm(f => ({...f, verantwortlich:e.target.value}))}
            options={['Enes Gökgül','Kevin Ochs','Damian Rzepa'].map(v => ({ value:v, label:v }))} className="col-span-2" />
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm text-gray-400 font-medium">Beschreibung</label>
            <textarea rows={3} value={form.beschreibung} onChange={e => setForm(f => ({...f, beschreibung:e.target.value}))}
              className="bg-navy-dark border border-navy-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-400 resize-none"
              placeholder="Projektbeschreibung..." />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button onClick={handleSave} disabled={!form.name}>Projekt erstellen</Button>
          <Button variant="ghost" onClick={() => setShowModal(false)}>Abbrechen</Button>
        </div>
      </Modal>
    </div>
  )
}
