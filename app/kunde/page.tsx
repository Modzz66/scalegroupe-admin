'use client'
import Link from 'next/link'
import { Mail, Phone, Download } from 'lucide-react'
import { useStore } from '@/lib/store'
import { getCurrentUser } from '@/lib/auth'
import { MOCK_DATEIEN } from '@/lib/mock-data'
import { formatEuro, formatDate } from '@/lib/utils'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

export default function KundeDashboard() {
  const user = getCurrentUser()
  const { projekte, rechnungen } = useStore()

  const kundeId = user?.kundeId || ''
  const meineProjekte = projekte.filter(p => p.kundeId === kundeId)
  const meineRechnungen = rechnungen.filter(r => r.kundeId === kundeId)
  const offeneRechnungen = meineRechnungen.filter(r => r.status === 'Ausstehend' || r.status === 'Überfällig')
  const letzteDateien = MOCK_DATEIEN.filter(d => d.kundeId === kundeId).slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="font-display font-bold text-3xl text-white">
          Hallo, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-400 mt-1">Hier ist dein ScaleGroupe-Bereich.</p>
      </div>

      {/* Meine Projekte */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-white">Meine Projekte</h2>
          <Link href="/kunde/projekte" className="text-purple-light text-sm hover:text-purple transition-colors">Alle ansehen →</Link>
        </div>
        <div className="space-y-3">
          {meineProjekte.length === 0 && (
            <Card className="p-6 text-center text-gray-500">Noch keine Projekte vorhanden.</Card>
          )}
          {meineProjekte.map(p => (
            <Card key={p.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-semibold">{p.name}</h3>
                  <p className="text-gray-500 text-sm mt-0.5">{p.paket}</p>
                </div>
                <Badge status={p.status} />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Fortschritt</span>
                  <span className="font-semibold text-white">{p.fortschritt}%</span>
                </div>
                <div className="h-2.5 bg-navy-dark rounded-full">
                  <div className="h-2.5 rounded-full transition-all"
                    style={{ width:`${p.fortschritt}%`, background:'linear-gradient(135deg,#5B21B6,#9B59F5)' }} />
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <p className="text-gray-500 text-xs">Deadline: {formatDate(p.deadline)}</p>
                <Link href="/kunde/projekte" className="text-purple-light text-xs hover:text-purple transition-colors">Details →</Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Offene Rechnungen */}
      {offeneRechnungen.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg text-white">Offene Rechnungen</h2>
            <Link href="/kunde/rechnungen" className="text-purple-light text-sm hover:text-purple transition-colors">Alle ansehen →</Link>
          </div>
          <div className="space-y-3">
            {offeneRechnungen.map(r => (
              <Card key={r.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">{r.nummer}</p>
                    <p className="text-gray-400 text-sm">{r.beschreibung}</p>
                    <p className="text-gray-500 text-xs mt-0.5">Fällig: {formatDate(r.faellig)}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <p className="text-white font-bold text-lg">{formatEuro(r.betrag)}</p>
                    <Badge status={r.status} />
                    <Link href="/kunde/rechnungen"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-white text-xs font-semibold"
                      style={{ background:'linear-gradient(135deg,#5B21B6,#9B59F5)' }}>
                      Jetzt bezahlen
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Letzte Dateien */}
      {letzteDateien.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg text-white">Letzte Dateien</h2>
            <Link href="/kunde/dateien" className="text-purple-light text-sm hover:text-purple transition-colors">Alle ansehen →</Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {letzteDateien.map(d => (
              <Card key={d.id} className="p-4">
                <p className="text-white text-sm font-semibold truncate mb-1">{d.name}</p>
                <p className="text-gray-500 text-xs">{d.groesse}</p>
                <button onClick={() => alert('Download simuliert')}
                  className="mt-3 flex items-center gap-1 text-purple-light text-xs hover:text-purple transition-colors">
                  <Download size={12} /> Herunterladen
                </button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Ansprechpartner */}
      <Card className="p-5">
        <h2 className="font-display font-bold text-white text-base mb-4">Dein Ansprechpartner</h2>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white"
            style={{ background:'linear-gradient(135deg,#5B21B6,#9B59F5)' }}>
            EG
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold">Enes Gökgül</p>
            <p className="text-gray-400 text-sm">Gründer & Creative Director</p>
            <div className="flex gap-4 mt-2">
              <a href="mailto:enes@scalegroupe.de" className="flex items-center gap-1 text-purple-light text-xs hover:text-purple transition-colors">
                <Mail size={12} /> enes@scalegroupe.de
              </a>
              <a href="tel:+4917600000000" className="flex items-center gap-1 text-purple-light text-xs hover:text-purple transition-colors">
                <Phone size={12} /> +49 176 000 000 00
              </a>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
