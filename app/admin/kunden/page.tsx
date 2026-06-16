'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Download, Plus, Users, TrendingUp, Euro } from 'lucide-react'
import { useStore } from '@/lib/store'
import { formatEuro, formatDate, getInitials, exportCSV } from '@/lib/utils'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'

export default function KundenPage() {
  const router = useRouter()
  const { kunden, addKunde } = useStore()
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<'name'|'umsatz'|'seit'>('name')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', telefon:'', unternehmen:'', paket:'Pro-Paket' })

  const filtered = kunden
    .filter(k => !search || k.name.toLowerCase().includes(search.toLowerCase()) || k.unternehmen.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortKey === 'umsatz') return b.umsatz - a.umsatz
      if (sortKey === 'seit') return a.seit.localeCompare(b.seit)
      return a.name.localeCompare(b.name)
    })

  const totalUmsatz = kunden.reduce((s, k) => s + k.umsatz, 0)
  const activeCount = kunden.filter(k => k.status === 'Aktiv').length

  function handleSave() {
    addKunde({
      id:`k${Date.now()}`, ...form, umsatz:0, status:'Aktiv',
      seit:new Date().toISOString().slice(0,7), avatar:getInitials(form.name)
    })
    setShowModal(false)
    setForm({ name:'', email:'', telefon:'', unternehmen:'', paket:'Pro-Paket' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">{kunden.length} Kunden gesamt</p>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => exportCSV(kunden as unknown as Record<string, unknown>[], 'kunden')}>
            <Download size={14} /> CSV Export
          </Button>
          <Button onClick={() => setShowModal(true)}><Plus size={14} /> Neuer Kunde</Button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Users size={20} className="text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white font-display">{kunden.length}</p>
            <p className="text-sm text-gray-400">Gesamt Kunden</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <TrendingUp size={20} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white font-display">{activeCount}</p>
            <p className="text-sm text-gray-400">Aktive Kunden</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Euro size={20} className="text-purple-light" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white font-display">{formatEuro(totalUmsatz)}</p>
            <p className="text-sm text-gray-400">Gesamtumsatz</p>
          </div>
        </Card>
      </div>

      {/* Search + Sort */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Kunden suchen..."
            className="w-full bg-navy-light border border-navy-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-400" />
        </div>
        <Select options={[{ value:'name', label:'Name' }, { value:'umsatz', label:'Umsatz' }, { value:'seit', label:'Seit' }]}
          value={sortKey} onChange={e => setSortKey(e.target.value as typeof sortKey)} />
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-navy-border">
            <tr>
              {['Kunde','Unternehmen','Paket','Umsatz','Status','Seit'].map(h => (
                <th key={h} className="text-left text-gray-500 px-4 py-3 font-medium text-xs uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-border">
            {filtered.map(k => (
              <tr key={k.id} onClick={() => router.push(`/admin/kunden/${k.id}`)}
                className="hover:bg-navy-light/50 cursor-pointer transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background:'linear-gradient(135deg,#5B21B6,#9B59F5)' }}>
                      {k.avatar}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{k.name}</p>
                      <p className="text-xs text-gray-500">{k.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-400">{k.unternehmen}</td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-navy-dark border border-navy-border px-2 py-1 rounded-lg text-gray-300">{k.paket}</span>
                </td>
                <td className="px-4 py-3 text-white font-semibold">{formatEuro(k.umsatz)}</td>
                <td className="px-4 py-3"><Badge status={k.status} /></td>
                <td className="px-4 py-3 text-gray-400">{formatDate(k.seit + '-01')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Neuer Kunde">
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={e => setForm(f => ({...f, name:e.target.value}))} placeholder="Klaus Müller" />
          <Input label="E-Mail" value={form.email} onChange={e => setForm(f => ({...f, email:e.target.value}))} placeholder="email@firma.de" />
          <Input label="Telefon" value={form.telefon} onChange={e => setForm(f => ({...f, telefon:e.target.value}))} placeholder="+49 711 ..." />
          <Input label="Unternehmen" value={form.unternehmen} onChange={e => setForm(f => ({...f, unternehmen:e.target.value}))} placeholder="Musterfirma GmbH" />
          <Select label="Paket" value={form.paket} onChange={e => setForm(f => ({...f, paket:e.target.value}))}
            options={['Starter-Paket','Pro-Paket','Premium-Paket','Marketing-Retainer'].map(v => ({ value:v, label:v }))} />
        </div>
        <div className="flex gap-3 mt-6">
          <Button onClick={handleSave} disabled={!form.name || !form.email}>Kunde erstellen</Button>
          <Button variant="ghost" onClick={() => setShowModal(false)}>Abbrechen</Button>
        </div>
      </Modal>
    </div>
  )
}
