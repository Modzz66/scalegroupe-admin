'use client'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useStore } from '@/lib/store'
import { KUNDEN, Termin } from '@/lib/mock-data'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'

const TYP_COLORS: Record<string, string> = {
  Call:'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Meeting:'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Aufgabe:'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Intern:'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export default function KalenderPage() {
  const { termine, addTermin } = useStore()
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate())
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ titel:'', datum:'', uhrzeit:'10:00', typ:'Call', kundeId:'' })

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = (getFirstDayOfMonth(year, month) + 6) % 7 // Mon-first

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1)
  }

  function getTermineForDay(day: number) {
    const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    return termine.filter(t => t.datum === dateStr)
  }

  const selectedDateStr = selectedDay ? `${year}-${String(month + 1).padStart(2,'0')}-${String(selectedDay).padStart(2,'0')}` : null
  const selectedTermine = selectedDateStr ? termine.filter(t => t.datum === selectedDateStr) : []

  const upcomingTermine = termine
    .filter(t => t.datum >= today.toISOString().split('T')[0])
    .sort((a, b) => a.datum.localeCompare(b.datum))
    .slice(0, 7)

  function handleSave() {
    addTermin({ id:`t${Date.now()}`, ...form, kundeId:form.kundeId || undefined })
    setShowModal(false)
    setForm({ titel:'', datum:'', uhrzeit:'10:00', typ:'Call', kundeId:'' })
  }

  const MONTH_NAMES = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember']
  const DAY_NAMES = ['Mo','Di','Mi','Do','Fr','Sa','So']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-white">Kalender</h1>
        <Button onClick={() => setShowModal(true)} size="sm"><Plus size={14} /> Neuer Termin</Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="col-span-2 p-5">
          {/* Month Nav */}
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth} className="text-gray-400 hover:text-white p-1 transition-colors"><ChevronLeft size={20} /></button>
            <h2 className="font-display font-bold text-white text-lg">{MONTH_NAMES[month]} {year}</h2>
            <button onClick={nextMonth} className="text-gray-400 hover:text-white p-1 transition-colors"><ChevronRight size={20} /></button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAY_NAMES.map(d => (
              <div key={d} className="text-center text-xs text-gray-500 font-semibold py-1">{d}</div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
              const isSelected = day === selectedDay
              const dayTermine = getTermineForDay(day)
              return (
                <div key={day} onClick={() => setSelectedDay(day)}
                  className={`relative p-2 rounded-xl cursor-pointer min-h-[52px] transition-all ${
                    isSelected ? 'bg-purple-500/30 ring-1 ring-purple-400' :
                    isToday ? 'bg-purple-500/15' : 'hover:bg-navy-dark'
                  }`}>
                  <span className={`text-sm font-semibold ${isToday ? 'text-purple-300' : isSelected ? 'text-white' : 'text-gray-300'}`}>{day}</span>
                  {dayTermine.length > 0 && (
                    <div className="flex flex-wrap gap-0.5 mt-1">
                      {dayTermine.slice(0,2).map(t => (
                        <div key={t.id} className={`text-xs px-1 py-0.5 rounded text-[10px] ${TYP_COLORS[t.typ]} border`} title={t.titel}>
                          {t.uhrzeit}
                        </div>
                      ))}
                      {dayTermine.length > 2 && <span className="text-[10px] text-gray-500">+{dayTermine.length-2}</span>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Selected day detail */}
          {selectedDay && (
            <div className="mt-5 pt-5 border-t border-navy-border">
              <h3 className="font-semibold text-white mb-3 text-sm">
                {selectedDay}. {MONTH_NAMES[month]} – {selectedTermine.length} Termin{selectedTermine.length !== 1 ? 'e' : ''}
              </h3>
              {selectedTermine.length === 0 ? (
                <p className="text-gray-500 text-sm">Keine Termine an diesem Tag.</p>
              ) : (
                <div className="space-y-2">
                  {selectedTermine.map(t => (
                    <div key={t.id} className={`flex items-center gap-3 p-3 rounded-xl border ${TYP_COLORS[t.typ]}`}>
                      <span className="font-semibold text-sm">{t.uhrzeit}</span>
                      <div>
                        <p className="font-semibold text-sm text-white">{t.titel}</p>
                        <span className="text-xs opacity-70">{t.typ}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Upcoming */}
        <Card className="p-5">
          <h3 className="font-semibold text-white mb-4">Kommende Termine</h3>
          <div className="space-y-3">
            {upcomingTermine.length === 0 && <p className="text-gray-500 text-sm">Keine Termine</p>}
            {upcomingTermine.map(t => (
              <div key={t.id} className="flex gap-3 p-3 bg-navy-dark rounded-xl">
                <div className="text-center min-w-[40px]">
                  <p className="text-xs text-gray-500">{MONTH_NAMES[new Date(t.datum).getMonth()].slice(0,3)}</p>
                  <p className="text-lg font-bold text-white leading-tight">{new Date(t.datum).getDate()}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{t.titel}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{t.uhrzeit}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${TYP_COLORS[t.typ]} border`}>{t.typ}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* New Termin Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Neuer Termin">
        <div className="space-y-4">
          <Input label="Titel" value={form.titel} onChange={e => setForm(f => ({...f, titel:e.target.value}))} placeholder="Termin Titel..." />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Datum" type="date" value={form.datum} onChange={e => setForm(f => ({...f, datum:e.target.value}))} />
            <Input label="Uhrzeit" type="time" value={form.uhrzeit} onChange={e => setForm(f => ({...f, uhrzeit:e.target.value}))} />
            <Select label="Typ" value={form.typ} onChange={e => setForm(f => ({...f, typ:e.target.value}))}
              options={['Call','Meeting','Aufgabe','Intern'].map(v => ({ value:v, label:v }))} />
            <Select label="Kunde (optional)" value={form.kundeId} onChange={e => setForm(f => ({...f, kundeId:e.target.value}))}
              options={[{ value:'', label:'Kein Kunde' }, ...KUNDEN.map(k => ({ value:k.id, label:k.unternehmen }))]} />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button onClick={handleSave} disabled={!form.titel || !form.datum}>Termin speichern</Button>
          <Button variant="ghost" onClick={() => setShowModal(false)}>Abbrechen</Button>
        </div>
      </Modal>
    </div>
  )
}
