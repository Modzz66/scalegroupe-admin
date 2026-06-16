'use client'
import { useState, useRef } from 'react'
import { Upload, Download, Trash2, FileText, Image, File, MoreVertical } from 'lucide-react'
import { MOCK_DATEIEN, KUNDEN } from '@/lib/mock-data'
import Card from '@/components/ui/Card'

interface Datei { id:string; name:string; typ:string; groesse:string; datum:string; kundeId:string; ordner:string }

const TYP_ICONS: Record<string, React.ElementType> = {
  pdf: FileText, fig: Image, ppt: File, doc: FileText, zip: File, img: Image,
}
const TYP_COLORS: Record<string, string> = {
  pdf:'text-red-400 bg-red-500/10', fig:'text-purple-300 bg-purple-500/10', ppt:'text-amber-400 bg-amber-500/10',
  doc:'text-blue-400 bg-blue-500/10', zip:'text-amber-400 bg-amber-500/10', img:'text-purple-300 bg-purple-500/10',
}

const ORDNER = ['Alle','Verträge','Designs','Rechnungen','Präsentationen']

export default function DateienPage() {
  const [dateien, setDateien] = useState<Datei[]>(MOCK_DATEIEN)
  const [ordner, setOrdner] = useState('Alle')
  const [kundeFilter, setKundeFilter] = useState('Alle')
  const [search, setSearch] = useState('')
  const [menuId, setMenuId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const dropRef = useRef<HTMLDivElement>(null)

  const filtered = dateien.filter(d => {
    if (ordner !== 'Alle' && d.ordner !== ordner) return false
    if (kundeFilter !== 'Alle' && d.kundeId !== kundeFilter) return false
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  function simulateUpload(name: string) {
    setUploading(true)
    setProgress(0)
    const iv = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(iv)
          setUploading(false)
          const ext = name.split('.').pop() || 'doc'
          setDateien(prev => [...prev, {
            id:`d${Date.now()}`, name, typ:ext, groesse:`${(Math.random()*5+0.5).toFixed(1)} MB`,
            datum:new Date().toISOString().split('T')[0], kundeId:'', ordner:'Alle',
          }])
          return 100
        }
        return p + 20
      })
    }, 150)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    files.forEach(f => simulateUpload(f.name))
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    files.forEach(f => simulateUpload(f.name))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-white">Dateien</h1>
        <label className="cursor-pointer">
          <input type="file" multiple className="hidden" onChange={handleFileInput} />
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:scale-105"
            style={{ background:'linear-gradient(135deg,#5B21B6,#9B59F5)' }}>
            <Upload size={14} /> Datei hochladen
          </div>
        </label>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Datei suchen..."
          className="bg-navy-dark border border-navy-border rounded-xl px-4 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-400 w-64" />
        <div className="flex gap-1 bg-navy-light rounded-xl p-1">
          {ORDNER.map(o => (
            <button key={o} onClick={() => setOrdner(o)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${ordner === o ? 'bg-navy-dark text-white' : 'text-gray-400 hover:text-white'}`}>
              {o}
            </button>
          ))}
        </div>
        <select value={kundeFilter} onChange={e => setKundeFilter(e.target.value)}
          className="bg-navy-dark border border-navy-border rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-400">
          <option value="Alle">Alle Kunden</option>
          {KUNDEN.map(k => <option key={k.id} value={k.id}>{k.unternehmen}</option>)}
        </select>
      </div>

      {/* Drop Zone */}
      <div ref={dropRef} onDrop={handleDrop} onDragOver={e => e.preventDefault()}
        className="border-2 border-dashed border-navy-border rounded-2xl p-8 text-center hover:border-purple-400 transition-colors cursor-pointer">
        {uploading ? (
          <div className="space-y-3">
            <p className="text-gray-400 text-sm">Wird hochgeladen...</p>
            <div className="bg-navy-dark rounded-full h-2 mx-auto max-w-xs">
              <div className="h-2 rounded-full bg-purple transition-all" style={{ width:`${progress}%` }} />
            </div>
            <p className="text-purple-light text-sm font-semibold">{progress}%</p>
          </div>
        ) : (
          <div>
            <Upload size={24} className="text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Dateien hier hineinziehen oder oben auf &quot;Hochladen&quot; klicken</p>
          </div>
        )}
      </div>

      {/* File Grid */}
      <div className="grid grid-cols-4 gap-4">
        {filtered.map(d => {
          const Icon = TYP_ICONS[d.typ] || File
          const colorClass = TYP_COLORS[d.typ] || 'text-gray-400 bg-gray-500/10'
          return (
            <Card key={d.id} className="p-4 relative group">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${colorClass}`}>
                <Icon size={24} />
              </div>
              <p className="text-white text-sm font-semibold leading-snug mb-1 truncate" title={d.name}>{d.name}</p>
              <p className="text-gray-500 text-xs">{d.groesse} · {new Date(d.datum).toLocaleDateString('de-DE')}</p>
              {d.ordner !== 'Alle' && <p className="text-gray-600 text-xs mt-0.5">{d.ordner}</p>}

              {/* Actions */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="relative">
                  <button onClick={() => setMenuId(menuId === d.id ? null : d.id)}
                    className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-navy-dark">
                    <MoreVertical size={16} />
                  </button>
                  {menuId === d.id && (
                    <div className="absolute right-0 top-7 bg-navy-dark border border-navy-border rounded-xl shadow-xl z-10 py-1 w-36">
                      <button onClick={() => alert('Download simuliert')} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-navy-light hover:text-white transition-colors">
                        <Download size={14} /> Herunterladen
                      </button>
                      <button onClick={() => { setDateien(prev => prev.filter(f => f.id !== d.id)); setMenuId(null) }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-navy-light transition-colors">
                        <Trash2 size={14} /> Löschen
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">Keine Dateien gefunden.</div>
      )}
    </div>
  )
}
