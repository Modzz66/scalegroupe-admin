'use client'
import { useState } from 'react'
import { Save } from 'lucide-react'
import { USERS } from '@/lib/mock-data'
import { getCurrentUser } from '@/lib/auth'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import { getInitials } from '@/lib/utils'

const TABS = ['Profil','Team','Benachrichtigungen']

type Notif = { id:string; label:string; on:boolean }

const INITIAL_NOTIFS: Notif[] = [
  { id:'n1', label:'Neuer Lead eingegangen', on:true },
  { id:'n2', label:'Projekt-Deadline in 3 Tagen', on:true },
  { id:'n3', label:'Rechnung überfällig', on:true },
  { id:'n4', label:'Neues Kunden-Feedback', on:false },
  { id:'n5', label:'Wöchentliche Zusammenfassung', on:true },
]

export default function EinstellungenPage() {
  const user = getCurrentUser()
  const [tab, setTab] = useState('Profil')
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [pw, setPw] = useState('')
  const [saved, setSaved] = useState(false)
  const [notifs, setNotifs] = useState<Notif[]>(INITIAL_NOTIFS)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function toggleNotif(id: string) {
    setNotifs(prev => prev.map(n => n.id === id ? {...n, on:!n.on} : n))
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="font-display font-bold text-2xl text-white">Einstellungen</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-navy-light rounded-xl p-1 w-fit">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-navy-dark text-white' : 'text-gray-400 hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Profil */}
      {tab === 'Profil' && (
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white"
              style={{ background:'linear-gradient(135deg,#5B21B6,#9B59F5)' }}>
              {getInitials(name)}
            </div>
            <div>
              <p className="text-white font-semibold text-lg">{name}</p>
              <p className="text-gray-400 text-sm">{user?.role === 'ADMIN' ? 'Administrator' : 'Kunde'}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Vollständiger Name" value={name} onChange={e => setName(e.target.value)} />
            <Input label="E-Mail" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            <Input label="Neues Passwort" type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Leer lassen wenn keine Änderung" />
            <Input label="Passwort bestätigen" type="password" placeholder="Passwort wiederholen" />
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleSave}><Save size={14} /> Speichern</Button>
            {saved && <span className="text-emerald-400 text-sm font-medium">✓ Gespeichert!</span>}
          </div>
        </Card>
      )}

      {/* Team */}
      {tab === 'Team' && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-navy-border flex items-center justify-between">
            <h3 className="text-white font-semibold">Benutzer & Zugänge</h3>
            <Button size="sm" onClick={() => alert('Einladung per E-Mail würde hier versendet werden.')}>+ Einladen</Button>
          </div>
          <table className="w-full text-sm">
            <thead className="border-b border-navy-border">
              <tr>
                {['Benutzer','E-Mail','Rolle','Status',''].map(h => (
                  <th key={h} className="text-left text-gray-500 px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-border">
              {USERS.map(u => (
                <tr key={u.id} className="hover:bg-navy-dark/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ background:'linear-gradient(135deg,#5B21B6,#9B59F5)' }}>
                        {getInitials(u.name)}
                      </div>
                      <span className="text-white font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${u.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-400'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3"><Badge status="Aktiv" /></td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-gray-500 hover:text-red-400 transition-colors">Entfernen</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Benachrichtigungen */}
      {tab === 'Benachrichtigungen' && (
        <Card className="p-6">
          <h3 className="text-white font-semibold mb-5">Benachrichtigungen</h3>
          <div className="space-y-4">
            {notifs.map(n => (
              <div key={n.id} className="flex items-center justify-between py-3 border-b border-navy-border last:border-0">
                <div>
                  <p className="text-white text-sm font-medium">{n.label}</p>
                  <p className="text-gray-500 text-xs mt-0.5">Per E-Mail & In-App</p>
                </div>
                <button onClick={() => toggleNotif(n.id)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${n.on ? 'bg-purple' : 'bg-navy-border'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${n.on ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            ))}
          </div>
          <Button onClick={handleSave} className="mt-6"><Save size={14} /> Einstellungen speichern</Button>
        </Card>
      )}
    </div>
  )
}
