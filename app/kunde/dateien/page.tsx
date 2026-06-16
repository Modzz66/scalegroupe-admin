'use client'
import { Download, FileText, Image, File } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { MOCK_DATEIEN } from '@/lib/mock-data'
import Card from '@/components/ui/Card'

const TYP_ICONS: Record<string, React.ElementType> = {
  pdf: FileText, fig: Image, ppt: File, doc: FileText, zip: File, img: Image,
}
const TYP_COLORS: Record<string, string> = {
  pdf:'text-red-400 bg-red-500/10', fig:'text-purple-300 bg-purple-500/10', ppt:'text-amber-400 bg-amber-500/10',
  doc:'text-blue-400 bg-blue-500/10', zip:'text-amber-400 bg-amber-500/10', img:'text-purple-300 bg-purple-500/10',
}

export default function KundeDateienPage() {
  const user = getCurrentUser()
  const kundeId = user?.kundeId || ''
  const meineDateien = MOCK_DATEIEN.filter(d => d.kundeId === kundeId)

  const grouped: Record<string, typeof MOCK_DATEIEN> = {}
  meineDateien.forEach(d => {
    if (!grouped[d.ordner]) grouped[d.ordner] = []
    grouped[d.ordner].push(d)
  })

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-2xl text-white">Meine Dateien</h1>

      {meineDateien.length === 0 && (
        <Card className="p-12 text-center text-gray-500">Noch keine Dateien vorhanden.</Card>
      )}

      {Object.entries(grouped).map(([ordner, dateien]) => (
        <div key={ordner}>
          <h2 className="font-semibold text-gray-300 text-sm mb-3 uppercase tracking-wider">{ordner}</h2>
          <div className="grid grid-cols-3 gap-4">
            {dateien.map(d => {
              const Icon = TYP_ICONS[d.typ] || File
              const colorClass = TYP_COLORS[d.typ] || 'text-gray-400 bg-gray-500/10'
              return (
                <Card key={d.id} className="p-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colorClass}`}>
                    <Icon size={20} />
                  </div>
                  <p className="text-white text-sm font-semibold truncate mb-1" title={d.name}>{d.name}</p>
                  <p className="text-gray-500 text-xs">{d.groesse}</p>
                  <p className="text-gray-600 text-xs">{new Date(d.datum).toLocaleDateString('de-DE')}</p>
                  <button
                    onClick={() => alert('Download simuliert – Datei: ' + d.name)}
                    className="mt-3 flex items-center gap-1.5 text-purple-light text-xs hover:text-purple transition-colors font-medium">
                    <Download size={12} /> Herunterladen
                  </button>
                </Card>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
