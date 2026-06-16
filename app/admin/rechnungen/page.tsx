'use client'
import { useState } from 'react'
import { Plus, Eye, Download, Trash2, Send } from 'lucide-react'
import { useStore } from '@/lib/store'
import { formatEuro, formatDate } from '@/lib/utils'
import { KUNDEN, Rechnung } from '@/lib/mock-data'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'

const FILTER_TABS = ['Alle', 'Bezahlt', 'Ausstehend', 'Überfällig', 'Entwurf']

export default function RechnungenPage() {
  const { rechnungen, addRechnung, updateRechnung, deleteRechnung } = useStore()
  const [filter, setFilter] = useState('Alle')
  const [showModal, setShowModal] = useState(false)
  const [viewModal, setViewModal] = useState<Rechnung | null>(null)
  const [form, setForm] = useState({
    kundeId: 'k1', paket: 'Pro-Paket', betrag: '', beschreibung: '',
    datum: new Date().toISOString().split('T')[0], faellig: '', isAngebot: false,
  })

  const filtered = filter === 'Alle' ? rechnungen : rechnungen.filter(r => r.status === filter)

  const bezahlt = rechnungen.filter(r => r.status === 'Bezahlt').reduce((s, r) => s + r.betrag, 0)
  const ausstehend = rechnungen.filter(r => r.status === 'Ausstehend').reduce((s, r) => s + r.betrag, 0)
  const ueberfaellig = rechnungen.filter(r => r.status === 'Überfällig').reduce((s, r) => s + r.betrag, 0)
  const entwuerfe = rechnungen.filter(r => r.status === 'Entwurf').length

  function handleSave() {
    const kunde = KUNDEN.find(k => k.id === form.kundeId)
    const nextNr = form.isAngebot
      ? `ANG-2024-${String(rechnungen.filter(r => r.nummer.startsWith('ANG')).length + 2).padStart(3, '0')}`
      : `RE-2024-${String(rechnungen.filter(r => r.nummer.startsWith('RE')).length + 2).padStart(3, '0')}`
    addRechnung({
      id: `r${Date.now()}`,
      nummer: nextNr,
      kundeId: form.kundeId,
      kundeName: kunde?.name || '',
      paket: form.paket,
      betrag: parseInt(form.betrag) || 0,
      status: form.isAngebot ? 'Entwurf' : 'Ausstehend',
      datum: form.datum,
      faellig: form.faellig,
      beschreibung: form.beschreibung,
    })
    setShowModal(false)
    setForm({ kundeId:'k1', paket:'Pro-Paket', betrag:'', beschreibung:'', datum:new Date().toISOString().split('T')[0], faellig:'', isAngebot:false })
  }

  function handlePrint(r: Rechnung) {
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
      <html><head><title>Rechnung ${r.nummer}</title>
      <style>body{font-family:Arial,sans-serif;padding:40px;max-width:700px;margin:auto}
      h1{color:#1C1F3A}.header{display:flex;justify-content:space-between;margin-bottom:40px}
      .info{margin-bottom:20px}.total{font-size:24px;font-weight:bold;color:#7C3AED}
      </style></head><body>
      <div class="header"><div><h1>ScaleGroupe</h1><p>info@scalegroupe.de</p></div>
      <div style="text-align:right"><h2>${r.nummer}</h2><p>Datum: ${formatDate(r.datum)}</p><p>Fällig: ${formatDate(r.faellig)}</p></div></div>
      <div class="info"><h3>An:</h3><p>${r.kundeName}</p></div>
      <hr/>
      <div style="margin:30px 0"><p><strong>Leistung:</strong> ${r.beschreibung}</p></div>
      <hr/>
      <div style="text-align:right;margin-top:20px">
      <p>Netto: ${formatEuro(r.betrag * 0.84)}</p>
      <p>MwSt (19%): ${formatEuro(r.betrag * 0.16)}</p>
      <p class="total">Gesamt: ${formatEuro(r.betrag)}</p></div>
      <div style="margin-top:40px;color:#666;font-size:12px">
      <p>Bankverbindung: IBAN DE89 3704 0044 0532 0130 00 · BIC: COBADEFFXXX</p>
      </div></body></html>`)
    win.print()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-white">Rechnungen & Angebote</h1>
        <div className="flex gap-3">
          <Button onClick={() => setShowModal(true)} size="sm"><Plus size={14} /> Neue Rechnung</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label:'Bezahlt', value:formatEuro(bezahlt), color:'text-emerald-400', bg:'bg-emerald-500/10' },
          { label:'Ausstehend', value:formatEuro(ausstehend), color:'text-amber-400', bg:'bg-amber-500/10' },
          { label:'Überfällig', value:formatEuro(ueberfaellig), color:'text-red-400', bg:'bg-red-500/10' },
          { label:'Entwürfe', value:`${entwuerfe} Stück`, color:'text-gray-400', bg:'bg-gray-500/10' },
        ].map(c => (
          <Card key={c.label} className="p-5">
            <p className={`text-2xl font-bold font-display ${c.color}`}>{c.value}</p>
            <p className="text-sm text-gray-400 mt-1">{c.label}</p>
          </Card>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 bg-navy-light rounded-xl p-1 w-fit">
        {FILTER_TABS.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === t ? 'bg-navy-dark text-white' : 'text-gray-400 hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-navy-border">
            <tr>
              {['Nr.','Kunde','Paket','Betrag','Status','Datum','Fällig',''].map(h => (
                <th key={h} className="text-left text-gray-500 px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-border">
            {filtered.map(r => (
              <tr key={r.id} className="hover:bg-navy-dark/30">
                <td className="px-4 py-3 text-white font-mono text-xs">{r.nummer}</td>
                <td className="px-4 py-3 text-gray-300">{r.kundeName}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{r.paket}</td>
                <td className="px-4 py-3 text-white font-semibold">{formatEuro(r.betrag)}</td>
                <td className="px-4 py-3"><Badge status={r.status} /></td>
                <td className="px-4 py-3 text-gray-400">{formatDate(r.datum)}</td>
                <td className={`px-4 py-3 text-sm font-medium ${r.status === 'Überfällig' ? 'text-red-400' : 'text-gray-400'}`}>{formatDate(r.faellig)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setViewModal(r)} className="text-gray-400 hover:text-white transition-colors" title="Ansehen"><Eye size={15} /></button>
                    <button onClick={() => handlePrint(r)} className="text-gray-400 hover:text-white transition-colors" title="PDF"><Download size={15} /></button>
                    <button className="text-gray-400 hover:text-purple-light transition-colors" title="Senden"><Send size={15} /></button>
                    {r.status === 'Ausstehend' && (
                      <button onClick={() => updateRechnung(r.id, { status:'Bezahlt' })} className="text-xs text-emerald-400 hover:text-emerald-300 font-medium">✓ Bezahlt</button>
                    )}
                    <button onClick={() => deleteRechnung(r.id)} className="text-gray-400 hover:text-red-400 transition-colors" title="Löschen"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* New Rechnung Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Neue Rechnung" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select label="Kunde" value={form.kundeId} onChange={e => setForm(f => ({...f, kundeId:e.target.value}))}
              options={KUNDEN.map(k => ({ value:k.id, label:k.name + ' – ' + k.unternehmen }))} />
            <Select label="Paket" value={form.paket} onChange={e => setForm(f => ({...f, paket:e.target.value}))}
              options={['Starter-Paket','Pro-Paket','Premium-Paket','Marketing-Retainer','Custom / Individuell'].map(v => ({ value:v, label:v }))} />
            <Input label="Betrag (€)" type="number" value={form.betrag} onChange={e => setForm(f => ({...f, betrag:e.target.value}))} placeholder="2499" />
            <Input label="Rechnungsdatum" type="date" value={form.datum} onChange={e => setForm(f => ({...f, datum:e.target.value}))} />
            <Input label="Fälligkeitsdatum" type="date" value={form.faellig} onChange={e => setForm(f => ({...f, faellig:e.target.value}))} />
            <div className="flex items-center gap-3 pt-6">
              <input type="checkbox" id="angebot" checked={form.isAngebot} onChange={e => setForm(f => ({...f, isAngebot:e.target.checked}))} className="w-4 h-4 accent-purple" />
              <label htmlFor="angebot" className="text-sm text-gray-300">Als Angebot speichern</label>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-400 font-medium">Beschreibung</label>
            <textarea rows={2} value={form.beschreibung} onChange={e => setForm(f => ({...f, beschreibung:e.target.value}))}
              className="bg-navy-dark border border-navy-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-400 transition-colors resize-none"
              placeholder="Leistungsbeschreibung..." />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button onClick={handleSave} disabled={!form.betrag}>Rechnung erstellen</Button>
          <Button variant="ghost" onClick={() => setShowModal(false)}>Abbrechen</Button>
        </div>
      </Modal>

      {/* View Modal */}
      {viewModal && (
        <Modal open={!!viewModal} onClose={() => setViewModal(null)} title={`Rechnung ${viewModal.nummer}`} size="lg">
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400">An:</p>
                <p className="text-white font-semibold text-base">{viewModal.kundeName}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400">Datum: {formatDate(viewModal.datum)}</p>
                <p className="text-gray-400">Fällig: {formatDate(viewModal.faellig)}</p>
                <Badge status={viewModal.status} />
              </div>
            </div>
            <div className="border border-navy-border rounded-xl p-4">
              <p className="text-gray-400 text-xs mb-1">Leistung</p>
              <p className="text-white">{viewModal.beschreibung}</p>
              <p className="text-gray-400 text-xs mt-2">Paket: {viewModal.paket}</p>
            </div>
            <div className="border-t border-navy-border pt-4 space-y-1 text-right">
              <p className="text-gray-400">Netto: {formatEuro(viewModal.betrag * 0.84)}</p>
              <p className="text-gray-400">MwSt (19%): {formatEuro(viewModal.betrag * 0.16)}</p>
              <p className="text-white font-bold text-xl">Gesamt: {formatEuro(viewModal.betrag)}</p>
            </div>
            <div className="flex gap-3 mt-4">
              <Button onClick={() => handlePrint(viewModal)} size="sm"><Download size={14} /> PDF drucken</Button>
              {viewModal.status === 'Ausstehend' && (
                <Button size="sm" onClick={() => { updateRechnung(viewModal.id, { status:'Bezahlt' }); setViewModal(null) }}>Als bezahlt markieren</Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
