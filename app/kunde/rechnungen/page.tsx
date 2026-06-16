'use client'
import { useState } from 'react'
import { Download } from 'lucide-react'
import { useStore } from '@/lib/store'
import { getCurrentUser } from '@/lib/auth'
import { formatEuro, formatDate } from '@/lib/utils'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

export default function KundeRechnungenPage() {
  const user = getCurrentUser()
  const { rechnungen } = useStore()
  const kundeId = user?.kundeId || ''
  const meineRechnungen = rechnungen.filter(r => r.kundeId === kundeId)
  const [payModal, setPayModal] = useState<string | null>(null)

  function handlePrint(r: { nummer:string; kundeName:string; beschreibung:string; betrag:number; datum:string; faellig:string }) {
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
      <html><head><title>${r.nummer}</title>
      <style>body{font-family:Arial;padding:40px;max-width:700px;margin:auto}h1{color:#1C1F3A}
      .total{font-size:24px;font-weight:bold;color:#7C3AED}</style></head><body>
      <h1>ScaleGroupe – ${r.nummer}</h1>
      <p>An: ${r.kundeName}</p>
      <p>Leistung: ${r.beschreibung}</p>
      <p>Datum: ${formatDate(r.datum)} | Fällig: ${formatDate(r.faellig)}</p>
      <hr/>
      <p class="total">Gesamt: ${formatEuro(r.betrag)}</p>
      </body></html>`)
    win.print()
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-2xl text-white">Meine Rechnungen</h1>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-emerald-400 font-bold text-xl">{formatEuro(meineRechnungen.filter(r=>r.status==='Bezahlt').reduce((s,r)=>s+r.betrag,0))}</p>
          <p className="text-gray-400 text-sm">Bezahlt</p>
        </Card>
        <Card className="p-4">
          <p className="text-amber-400 font-bold text-xl">{formatEuro(meineRechnungen.filter(r=>r.status==='Ausstehend'||r.status==='Überfällig').reduce((s,r)=>s+r.betrag,0))}</p>
          <p className="text-gray-400 text-sm">Offen</p>
        </Card>
        <Card className="p-4">
          <p className="text-white font-bold text-xl">{meineRechnungen.length}</p>
          <p className="text-gray-400 text-sm">Gesamt</p>
        </Card>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-navy-border">
            <tr>
              {['Rechnung','Beschreibung','Betrag','Status','Datum','Fällig',''].map(h => (
                <th key={h} className="text-left text-gray-500 px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-border">
            {meineRechnungen.map(r => (
              <tr key={r.id} className="hover:bg-navy-dark/30">
                <td className="px-4 py-3 text-white font-mono text-xs">{r.nummer}</td>
                <td className="px-4 py-3 text-gray-400 max-w-[200px] truncate">{r.beschreibung}</td>
                <td className="px-4 py-3 text-white font-bold">{formatEuro(r.betrag)}</td>
                <td className="px-4 py-3"><Badge status={r.status} /></td>
                <td className="px-4 py-3 text-gray-400">{formatDate(r.datum)}</td>
                <td className={`px-4 py-3 text-sm ${r.status === 'Überfällig' ? 'text-red-400 font-semibold' : 'text-gray-400'}`}>{formatDate(r.faellig)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handlePrint(r)} className="text-gray-400 hover:text-white transition-colors" title="PDF">
                      <Download size={15} />
                    </button>
                    {(r.status === 'Ausstehend' || r.status === 'Überfällig') && (
                      <button onClick={() => setPayModal(r.id)}
                        className="text-xs px-3 py-1 rounded-lg text-white font-semibold transition-all hover:scale-105"
                        style={{ background:'linear-gradient(135deg,#059669,#34d399)' }}>
                        Bezahlen
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {meineRechnungen.length === 0 && (
        <div className="text-center py-12 text-gray-500">Keine Rechnungen vorhanden.</div>
      )}

      {/* Pay Modal */}
      <Modal open={!!payModal} onClose={() => setPayModal(null)} title="Sicher bezahlen">
        <div className="space-y-4 text-center py-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background:'linear-gradient(135deg,#059669,#34d399)' }}>
            <span className="text-2xl">🔒</span>
          </div>
          <h3 className="text-white font-semibold text-lg">Sichere Zahlung</h3>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
            Du wirst zu unserem sicheren Zahlungsanbieter weitergeleitet.
            Deine Zahlungsdaten werden verschlüsselt übertragen.
          </p>
          <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
            <span>🔐 256-bit SSL</span>
            <span>·</span>
            <span>💳 Powered by Stripe</span>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <Button className="flex-1" onClick={() => { alert('Stripe Integration kommt bald!'); setPayModal(null) }}>
            Weiter zur Zahlung
          </Button>
          <Button variant="ghost" onClick={() => setPayModal(null)}>Abbrechen</Button>
        </div>
      </Modal>
    </div>
  )
}
