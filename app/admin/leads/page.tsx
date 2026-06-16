'use client'
import { useState } from 'react'
import { Mail, Phone, UserCheck, Trash2, Plus } from 'lucide-react'
import { useStore } from '@/lib/store'
import { Lead } from '@/lib/mock-data'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'

export default function LeadsPage() {
  const { leads, addLead, updateLead, deleteLead, addKunde } = useStore()
  const [selected, setSelected] = useState<Lead | null>(leads[0] || null)
  const [showModal, setShowModal] = useState(false)
  const [showKundeModal, setShowKundeModal] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', telefon:'', unternehmen:'', interesse:'Pro-Paket', nachricht:'' })
  const [kundeForm, setKundeForm] = useState({ name:'', email:'', telefon:'', unternehmen:'', paket:'Pro-Paket' })

  const statusCounts = {
    Neu: leads.filter(l => l.status === 'Neu').length,
    Kontaktiert: leads.filter(l => l.status === 'Kontaktiert').length,
    Qualifiziert: leads.filter(l => l.status === 'Qualifiziert').length,
    Verloren: leads.filter(l => l.status === 'Verloren').length,
  }

  function handleSaveLead() {
    addLead({ id:`l${Date.now()}`, ...form, datum:new Date().toISOString().split('T')[0], status:'Neu' })
    setShowModal(false)
    setForm({ name:'', email:'', telefon:'', unternehmen:'', interesse:'Pro-Paket', nachricht:'' })
  }

  function handleToKunde() {
    if (!selected) return
    setKundeForm({ name:selected.name, email:selected.email, telefon:selected.telefon, unternehmen:selected.unternehmen, paket:selected.interesse })
    setShowKundeModal(true)
  }

  function handleSaveKunde() {
    addKunde({
      id:`k${Date.now()}`, ...kundeForm, umsatz:0, status:'Aktiv',
      seit:new Date().toISOString().slice(0,7), avatar:kundeForm.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase(),
    })
    if (selected) updateLead(selected.id, { status:'Qualifiziert' })
    setShowKundeModal(false)
    alert('Kunde erfolgreich erstellt!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="font-display font-bold text-2xl text-white">Leads</h1>
          <div className="flex gap-4">
            {Object.entries(statusCounts).map(([s, n]) => (
              <div key={s} className="flex items-center gap-1.5">
                <Badge status={s} />
                <span className="text-white font-semibold text-sm">{n}</span>
              </div>
            ))}
          </div>
        </div>
        <Button onClick={() => setShowModal(true)} size="sm"><Plus size={14} /> Lead hinzufügen</Button>
      </div>

      {/* Inbox Layout */}
      <div className="grid grid-cols-3 gap-4 h-[calc(100vh-220px)]">
        {/* Lead List */}
        <Card className="overflow-y-auto">
          <div className="divide-y divide-navy-border">
            {leads.map(l => (
              <div key={l.id} onClick={() => setSelected(l)}
                className={`p-4 cursor-pointer transition-colors ${selected?.id === l.id ? 'bg-purple-500/10 border-l-4 border-purple-400' : 'hover:bg-navy-dark/40'}`}>
                <div className="flex items-start justify-between mb-1">
                  <p className="text-white font-semibold text-sm">{l.name}</p>
                  {l.status === 'Neu' && (
                    <span className="relative flex h-2 w-2 mt-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-400" />
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-xs mb-2">{l.unternehmen}</p>
                <div className="flex items-center justify-between">
                  <Badge status={l.interesse} />
                  <span className="text-gray-600 text-xs">{new Date(l.datum).toLocaleDateString('de-DE', { day:'2-digit', month:'2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Lead Detail */}
        <div className="col-span-2">
          {selected ? (
            <Card className="p-6 h-full overflow-y-auto">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-display font-bold text-xl text-white">{selected.name}</h2>
                  <p className="text-gray-400">{selected.unternehmen}</p>
                </div>
                <Badge status={selected.status} />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-navy-dark rounded-xl p-4">
                  <p className="text-gray-500 text-xs mb-1">E-Mail</p>
                  <p className="text-white text-sm">{selected.email}</p>
                </div>
                <div className="bg-navy-dark rounded-xl p-4">
                  <p className="text-gray-500 text-xs mb-1">Telefon</p>
                  <p className="text-white text-sm">{selected.telefon}</p>
                </div>
                <div className="bg-navy-dark rounded-xl p-4">
                  <p className="text-gray-500 text-xs mb-1">Interesse</p>
                  <p className="text-white text-sm">{selected.interesse}</p>
                </div>
                <div className="bg-navy-dark rounded-xl p-4">
                  <p className="text-gray-500 text-xs mb-1">Eingegangen</p>
                  <p className="text-white text-sm">{new Date(selected.datum).toLocaleDateString('de-DE')}</p>
                </div>
              </div>

              <div className="bg-navy-dark rounded-xl p-4 mb-6">
                <p className="text-gray-500 text-xs mb-2">Nachricht</p>
                <p className="text-gray-300 text-sm leading-relaxed">{selected.nachricht}</p>
              </div>

              {/* Status Change */}
              <div className="mb-6">
                <label className="text-sm text-gray-400 font-medium block mb-2">Status ändern</label>
                <select value={selected.status}
                  onChange={e => {
                    updateLead(selected.id, { status:e.target.value as Lead['status'] })
                    setSelected(leads.find(l => l.id === selected.id) || null)
                  }}
                  className="bg-navy-dark border border-navy-border rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-purple-400">
                  {['Neu','Kontaktiert','Qualifiziert','Verloren'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <Button size="sm" onClick={() => window.open(`mailto:${selected.email}`)}>
                  <Mail size={14} /> E-Mail senden
                </Button>
                <Button size="sm" variant="secondary" onClick={() => window.open(`tel:${selected.telefon}`)}>
                  <Phone size={14} /> Anrufen
                </Button>
                <Button size="sm" onClick={handleToKunde}>
                  <UserCheck size={14} /> Zu Kunde machen
                </Button>
                <Button size="sm" variant="danger" onClick={() => { deleteLead(selected.id); setSelected(leads[0] || null) }}>
                  <Trash2 size={14} /> Ablehnen
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="flex items-center justify-center h-full">
              <p className="text-gray-500">Lead auswählen</p>
            </Card>
          )}
        </div>
      </div>

      {/* New Lead Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Neuer Lead" size="lg">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Name" value={form.name} onChange={e => setForm(f => ({...f, name:e.target.value}))} placeholder="Max Mustermann" />
          <Input label="Unternehmen" value={form.unternehmen} onChange={e => setForm(f => ({...f, unternehmen:e.target.value}))} placeholder="Muster GmbH" />
          <Input label="E-Mail" type="email" value={form.email} onChange={e => setForm(f => ({...f, email:e.target.value}))} />
          <Input label="Telefon" value={form.telefon} onChange={e => setForm(f => ({...f, telefon:e.target.value}))} />
          <Select label="Interesse" value={form.interesse} onChange={e => setForm(f => ({...f, interesse:e.target.value}))}
            options={['Starter-Paket','Pro-Paket','Premium-Paket','Marketing-Retainer'].map(v => ({ value:v, label:v }))} className="col-span-2" />
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm text-gray-400 font-medium">Nachricht</label>
            <textarea rows={3} value={form.nachricht} onChange={e => setForm(f => ({...f, nachricht:e.target.value}))}
              className="bg-navy-dark border border-navy-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-400 resize-none" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button onClick={handleSaveLead} disabled={!form.name}>Lead erstellen</Button>
          <Button variant="ghost" onClick={() => setShowModal(false)}>Abbrechen</Button>
        </div>
      </Modal>

      {/* To Kunde Modal */}
      <Modal open={showKundeModal} onClose={() => setShowKundeModal(false)} title="Zu Kunde machen" size="lg">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Name" value={kundeForm.name} onChange={e => setKundeForm(f => ({...f, name:e.target.value}))} />
          <Input label="E-Mail" value={kundeForm.email} onChange={e => setKundeForm(f => ({...f, email:e.target.value}))} />
          <Input label="Telefon" value={kundeForm.telefon} onChange={e => setKundeForm(f => ({...f, telefon:e.target.value}))} />
          <Input label="Unternehmen" value={kundeForm.unternehmen} onChange={e => setKundeForm(f => ({...f, unternehmen:e.target.value}))} />
          <Select label="Paket" value={kundeForm.paket} onChange={e => setKundeForm(f => ({...f, paket:e.target.value}))}
            options={['Starter-Paket','Pro-Paket','Premium-Paket','Marketing-Retainer'].map(v => ({ value:v, label:v }))} className="col-span-2" />
        </div>
        <div className="flex gap-3 mt-6">
          <Button onClick={handleSaveKunde}>Kunde erstellen</Button>
          <Button variant="ghost" onClick={() => setShowKundeModal(false)}>Abbrechen</Button>
        </div>
      </Modal>
    </div>
  )
}
