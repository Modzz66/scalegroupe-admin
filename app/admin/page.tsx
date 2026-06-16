'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts'
import {
  Euro, FolderOpen, UserPlus, AlertCircle, Plus, Receipt, Inbox, CheckSquare, Check
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { getCurrentUser } from '@/lib/auth'
import { formatEuro, formatDate, getInitials } from '@/lib/utils'
import { UMSATZ_MONATLICH, LEADS_WOECHENTLICH, KUNDEN } from '@/lib/mock-data'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'

const QUOTES = [
  'Heute ist ein guter Tag, um Großes zu erreichen.',
  'Jedes Projekt ist eine Chance zu wachsen.',
  'Dein Team ist deine größte Stärke.',
]

const PIE_COLORS = ['#7C3AED','#9B59F5','#A78BFA','#C4B5FD']

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Guten Morgen'
  if (h < 18) return 'Guten Tag'
  return 'Guten Abend'
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-navy-dark border border-navy-border rounded-xl px-3 py-2 text-sm">
      <p className="text-gray-400">{label}</p>
      <p className="text-white font-semibold">{formatEuro(payload[0].value)}</p>
    </div>
  )
}

function LeadsTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-navy-dark border border-navy-border rounded-xl px-3 py-2 text-sm">
      <p className="text-gray-400">{label}</p>
      <p className="text-white font-semibold">{payload[0].value} Leads</p>
    </div>
  )
}

export default function AdminDashboard() {
  const router = useRouter()
  const user = getCurrentUser()
  const { projekte, rechnungen, leads, todos, addTodo, toggleTodo, addProjekt } = useStore()
  const [showProjektModal, setShowProjektModal] = useState(false)
  const [todoInput, setTodoInput] = useState('')
  const [newProjekt, setNewProjekt] = useState({
    name:'', kundeId:'k1', paket:'Pro-Paket', deadline:'', budget:'', beschreibung:'', verantwortlich:'Enes Gökgül'
  })

  const bezahlt = rechnungen.filter(r => r.status === 'Bezahlt').reduce((sum, r) => sum + r.betrag, 0)
  const aktiveProjekte = projekte.filter(p => !['Abgeschlossen','Storniert'].includes(p.status)).length
  const neueLeads = leads.filter(l => l.status === 'Neu').length
  const offeneRechnungen = rechnungen.filter(r => ['Ausstehend','Überfällig'].includes(r.status)).reduce((sum, r) => sum + r.betrag, 0)
  const aktiveProjekteListe = projekte.filter(p => !['Abgeschlossen','Storniert'].includes(p.status))

  const paketVerteilung = KUNDEN.reduce((acc, k) => {
    acc[k.paket] = (acc[k.paket] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  const pieData = Object.entries(paketVerteilung).map(([name, value]) => ({ name, value }))

  const kpiCards = [
    { label:'Gesamtumsatz', value:formatEuro(bezahlt), icon:Euro, color:'text-emerald-400', bg:'bg-emerald-500/10', change:'+23%' },
    { label:'Aktive Projekte', value:aktiveProjekte.toString(), icon:FolderOpen, color:'text-blue-400', bg:'bg-blue-500/10', change:'3 Projekte' },
    { label:'Neue Leads', value:neueLeads.toString(), icon:UserPlus, color:'text-purple-light', bg:'bg-purple-500/10', change:'Letzte 7 Tage' },
    { label:'Offene Rechnungen', value:formatEuro(offeneRechnungen), icon:AlertCircle, color:'text-amber-400', bg:'bg-amber-500/10', change:'2 ausstehend' },
  ]

  function handleAddTodo(e: React.FormEvent) {
    e.preventDefault()
    if (todoInput.trim()) {
      addTodo(todoInput.trim())
      setTodoInput('')
    }
  }

  function handleSaveProjekt() {
    const kunden = KUNDEN
    const k = kunden.find(k => k.id === newProjekt.kundeId)
    addProjekt({
      id: `p${Date.now()}`,
      name: newProjekt.name,
      kundeId: newProjekt.kundeId,
      kundeName: k?.unternehmen || '',
      paket: newProjekt.paket,
      status: 'Offen',
      deadline: newProjekt.deadline,
      budget: parseInt(newProjekt.budget) || 0,
      fortschritt: 0,
      beschreibung: newProjekt.beschreibung,
      verantwortlich: newProjekt.verantwortlich,
      erstellt: new Date().toISOString().split('T')[0],
    })
    setShowProjektModal(false)
    setNewProjekt({ name:'', kundeId:'k1', paket:'Pro-Paket', deadline:'', budget:'', beschreibung:'', verantwortlich:'Enes Gökgül' })
  }

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl text-white">
            {getGreeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-400 mt-1 text-sm italic">&quot;{QUOTES[new Date().getDay() % QUOTES.length]}&quot;</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-sm">{new Date().toLocaleDateString('de-DE', { weekday:'long', day:'numeric', month:'long' })}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 flex-wrap">
        <Button onClick={() => setShowProjektModal(true)} size="sm">
          <Plus size={14} /> Neues Projekt
        </Button>
        <Button onClick={() => router.push('/admin/rechnungen')} size="sm" variant="secondary">
          <Receipt size={14} /> Neue Rechnung
        </Button>
        <Button onClick={() => router.push('/admin/leads')} size="sm" variant="secondary">
          <Inbox size={14} /> Neuer Lead
        </Button>
        <Button onClick={() => router.push('/admin/aufgaben')} size="sm" variant="secondary">
          <CheckSquare size={14} /> Aufgabe
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <Card key={card.label} className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.bg}`}>
                <card.icon size={20} className={card.color} />
              </div>
              <span className="text-xs text-gray-500 font-medium">{card.change}</span>
            </div>
            <p className="text-2xl font-bold text-white font-display">{card.value}</p>
            <p className="text-sm text-gray-400 mt-1">{card.label}</p>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2 p-5">
          <h3 className="font-semibold text-white mb-4">Umsatz Übersicht 2024</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={UMSATZ_MONATLICH} animationDuration={800}>
              <XAxis dataKey="monat" tick={{ fill:'#6B7280', fontSize:12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#6B7280', fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v => `€${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="umsatz" fill="url(#purpleGrad)" radius={[6,6,0,0]} />
              <defs>
                <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#5B21B6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold text-white mb-4">Pakete Verteilung</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" animationDuration={800}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v} Kunden`, '']} contentStyle={{ background:'#13162B', border:'1px solid #2E3260', borderRadius:12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background:PIE_COLORS[i] }} />
                  <span className="text-gray-400 truncate max-w-[120px]">{d.name}</span>
                </div>
                <span className="text-white font-semibold">{d.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Leads Chart */}
      <Card className="p-5">
        <h3 className="font-semibold text-white mb-4">Lead Entwicklung (letzte 4 Wochen)</h3>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={LEADS_WOECHENTLICH} animationDuration={800}>
            <XAxis dataKey="woche" tick={{ fill:'#6B7280', fontSize:12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill:'#6B7280', fontSize:11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<LeadsTooltip />} />
            <Line type="monotone" dataKey="leads" stroke="#A78BFA" strokeWidth={2.5} dot={{ fill:'#A78BFA', strokeWidth:0, r:5 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2 p-5">
          <h3 className="font-semibold text-white mb-4">Aktive Projekte</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-border">
                  <th className="text-left text-gray-500 pb-3 font-medium">Projekt</th>
                  <th className="text-left text-gray-500 pb-3 font-medium">Kunde</th>
                  <th className="text-left text-gray-500 pb-3 font-medium">Status</th>
                  <th className="text-left text-gray-500 pb-3 font-medium">Fortschritt</th>
                  <th className="text-left text-gray-500 pb-3 font-medium">Deadline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-border">
                {aktiveProjekteListe.map(p => (
                  <tr key={p.id} className="hover:bg-navy-dark/30 cursor-pointer" onClick={() => router.push(`/admin/projekte/${p.id}`)}>
                    <td className="py-3 text-white font-medium">{p.name}</td>
                    <td className="py-3 text-gray-400">{p.kundeName}</td>
                    <td className="py-3"><Badge status={p.status} /></td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-navy-dark rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-purple" style={{ width:`${p.fortschritt}%` }} />
                        </div>
                        <span className="text-gray-400 text-xs w-8">{p.fortschritt}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-gray-400">{formatDate(p.deadline)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-white mb-4">Team Auslastung</h3>
          <div className="space-y-4">
            {[
              { name:'Enes Gökgül', pct:78, color:'#7C3AED' },
              { name:'Kevin Ochs', pct:85, color:'#A78BFA' },
              { name:'Damian Rzepa', pct:60, color:'#9B59F5' },
            ].map(({ name, pct, color }) => {
              const r = 30
              const circ = 2 * Math.PI * r
              const dash = (pct / 100) * circ
              return (
                <div key={name} className="flex items-center gap-4">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <svg width="64" height="64" viewBox="0 0 64 64">
                      <circle cx="32" cy="32" r={r} fill="none" stroke="#2E3260" strokeWidth="5" />
                      <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="5"
                        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
                        transform="rotate(-90 32 32)" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">{pct}%</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{name}</p>
                    <p className="text-xs text-gray-500">Auslastung</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Bottom Row 2 */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-semibold text-white mb-4">Offene Rechnungen</h3>
          <div className="space-y-3">
            {rechnungen.filter(r => r.status !== 'Bezahlt' && r.status !== 'Entwurf').map(r => (
              <div key={r.id} className="flex items-center justify-between p-3 bg-navy-dark rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-white">{r.nummer}</p>
                  <p className="text-xs text-gray-500">{r.kundeName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{formatEuro(r.betrag)}</p>
                  <Badge status={r.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-white mb-4">To-Do Liste</h3>
          <form onSubmit={handleAddTodo} className="flex gap-2 mb-4">
            <input
              value={todoInput}
              onChange={e => setTodoInput(e.target.value)}
              placeholder="Neue Aufgabe hinzufügen..."
              className="flex-1 bg-navy-dark border border-navy-border rounded-xl px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-400 transition-colors"
            />
            <Button type="submit" size="sm"><Plus size={14} /></Button>
          </form>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {todos.length === 0 && <p className="text-gray-500 text-sm text-center py-4">Keine Aufgaben</p>}
            {todos.map(t => (
              <div key={t.id} onClick={() => toggleTodo(t.id)} className="flex items-center gap-3 p-2 rounded-xl hover:bg-navy-dark cursor-pointer group">
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all ${t.done ? 'bg-purple border-purple' : 'border-navy-border'}`}>
                  {t.done && <Check size={12} className="text-white" />}
                </div>
                <span className={`text-sm ${t.done ? 'line-through text-gray-500' : 'text-gray-300'}`}>{t.text}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* New Projekt Modal */}
      <Modal open={showProjektModal} onClose={() => setShowProjektModal(false)} title="Neues Projekt" size="lg">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Projektname" value={newProjekt.name} onChange={e => setNewProjekt(p => ({...p, name:e.target.value}))} placeholder="z.B. Website Relaunch" className="col-span-2" />
          <Select label="Kunde" value={newProjekt.kundeId} onChange={e => setNewProjekt(p => ({...p, kundeId:e.target.value}))}
            options={KUNDEN.map(k => ({ value:k.id, label:k.unternehmen }))} />
          <Select label="Paket" value={newProjekt.paket} onChange={e => setNewProjekt(p => ({...p, paket:e.target.value}))}
            options={['Starter-Paket','Pro-Paket','Premium-Paket','Marketing-Retainer'].map(v => ({ value:v, label:v }))} />
          <Input label="Deadline" type="date" value={newProjekt.deadline} onChange={e => setNewProjekt(p => ({...p, deadline:e.target.value}))} />
          <Input label="Budget (€)" type="number" value={newProjekt.budget} onChange={e => setNewProjekt(p => ({...p, budget:e.target.value}))} placeholder="2499" />
          <Select label="Verantwortlich" value={newProjekt.verantwortlich} onChange={e => setNewProjekt(p => ({...p, verantwortlich:e.target.value}))}
            options={['Enes Gökgül','Kevin Ochs','Damian Rzepa'].map(v => ({ value:v, label:v }))} className="col-span-2" />
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm text-gray-400 font-medium">Beschreibung</label>
            <textarea rows={3} value={newProjekt.beschreibung} onChange={e => setNewProjekt(p => ({...p, beschreibung:e.target.value}))}
              className="bg-navy-dark border border-navy-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-400 transition-colors resize-none"
              placeholder="Projektbeschreibung..." />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button onClick={handleSaveProjekt} disabled={!newProjekt.name}>Projekt erstellen</Button>
          <Button variant="ghost" onClick={() => setShowProjektModal(false)}>Abbrechen</Button>
        </div>
      </Modal>
    </div>
  )
}
