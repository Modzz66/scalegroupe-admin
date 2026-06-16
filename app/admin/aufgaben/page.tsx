'use client'
import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Plus } from 'lucide-react'
import { useStore } from '@/lib/store'
import { PROJEKTE, Aufgabe } from '@/lib/mock-data'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'

const COLUMNS = [
  { id:'Todo',     label:'Todo',     color:'text-gray-400' },
  { id:'In Arbeit',label:'In Arbeit',color:'text-amber-400' },
  { id:'Review',   label:'Review',   color:'text-purple-300' },
  { id:'Fertig',   label:'Fertig',   color:'text-emerald-400' },
]
const PRIO_COLORS: Record<string, string> = { Hoch:'border-red-400', Mittel:'border-amber-400', Niedrig:'border-gray-500' }

export default function AufgabenPage() {
  const { aufgaben, addAufgabe, updateAufgabe } = useStore()
  const [showModal, setShowModal] = useState(false)
  const [filterProjekt, setFilterProjekt] = useState('Alle')
  const [form, setForm] = useState({
    titel:'', beschreibung:'', projektId:'p5', verantwortlich:'Enes Gökgül',
    prioritaet:'Mittel' as Aufgabe['prioritaet'], faellig:'',
  })

  function onDragEnd(result: DropResult) {
    if (!result.destination) return
    const newStatus = result.destination.droppableId as Aufgabe['status']
    updateAufgabe(result.draggableId, { status: newStatus })
  }

  const filtered = filterProjekt === 'Alle' ? aufgaben : aufgaben.filter(a => a.projektId === filterProjekt)

  function handleSave() {
    const proj = PROJEKTE.find(p => p.id === form.projektId)
    addAufgabe({
      id: `a${Date.now()}`,
      titel: form.titel,
      beschreibung: form.beschreibung,
      projektId: form.projektId,
      projektName: proj?.name || '',
      verantwortlich: form.verantwortlich,
      prioritaet: form.prioritaet,
      status: 'Todo',
      faellig: form.faellig,
    })
    setShowModal(false)
    setForm({ titel:'', beschreibung:'', projektId:'p5', verantwortlich:'Enes Gökgül', prioritaet:'Mittel', faellig:'' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-white">Aufgaben</h1>
        <div className="flex items-center gap-3">
          <Select
            value={filterProjekt}
            onChange={e => setFilterProjekt(e.target.value)}
            options={[{ value:'Alle', label:'Alle Projekte' }, ...PROJEKTE.map(p => ({ value:p.id, label:p.name }))]}
          />
          <Button onClick={() => setShowModal(true)} size="sm"><Plus size={14} /> Neue Aufgabe</Button>
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-4 gap-4 min-h-[60vh]">
          {COLUMNS.map(col => {
            const colAufgaben = filtered.filter(a => a.status === col.id)
            return (
              <div key={col.id} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className={`font-semibold text-sm ${col.color}`}>{col.label}</h3>
                  <span className="bg-navy-light text-gray-400 text-xs rounded-full px-2 py-0.5 font-semibold">{colAufgaben.length}</span>
                </div>
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 rounded-2xl p-2 min-h-[200px] transition-colors ${snapshot.isDraggingOver ? 'bg-purple-500/10' : 'bg-navy-dark/50'}`}
                    >
                      {colAufgaben.map((a, idx) => (
                        <Draggable key={a.id} draggableId={a.id} index={idx}>
                          {(prov, snap) => (
                            <div
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              className={`bg-navy-light border-l-4 ${PRIO_COLORS[a.prioritaet]} rounded-xl p-3 mb-2 cursor-grab shadow-sm transition-shadow ${snap.isDragging ? 'shadow-2xl opacity-90' : ''}`}
                            >
                              <p className="text-white text-sm font-semibold leading-snug mb-1">{a.titel}</p>
                              <p className="text-purple-300 text-xs mb-3">{a.projektName}</p>
                              <div className="flex items-center justify-between">
                                <div className="w-6 h-6 rounded-full bg-purple-500/30 flex items-center justify-center text-xs text-white font-bold">
                                  {a.verantwortlich.split(' ').map(n => n[0]).join('').slice(0,2)}
                                </div>
                                <span className={`text-xs ${new Date(a.faellig) < new Date() && a.status !== 'Fertig' ? 'text-red-400 font-semibold' : 'text-gray-500'}`}>
                                  {a.faellig ? new Date(a.faellig).toLocaleDateString('de-DE', { day:'2-digit', month:'2-digit' }) : ''}
                                </span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            )
          })}
        </div>
      </DragDropContext>

      {/* New Aufgabe Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Neue Aufgabe">
        <div className="space-y-4">
          <Input label="Titel" value={form.titel} onChange={e => setForm(f => ({...f, titel:e.target.value}))} placeholder="Aufgabentitel..." />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Projekt" value={form.projektId} onChange={e => setForm(f => ({...f, projektId:e.target.value}))}
              options={PROJEKTE.map(p => ({ value:p.id, label:p.name }))} />
            <Select label="Verantwortlich" value={form.verantwortlich} onChange={e => setForm(f => ({...f, verantwortlich:e.target.value}))}
              options={['Enes Gökgül','Kevin Ochs','Damian Rzepa'].map(v => ({ value:v, label:v }))} />
            <Select label="Priorität" value={form.prioritaet} onChange={e => setForm(f => ({...f, prioritaet:e.target.value as Aufgabe['prioritaet']}))}
              options={[{ value:'Hoch', label:'Hoch' },{ value:'Mittel', label:'Mittel' },{ value:'Niedrig', label:'Niedrig' }]} />
            <Input label="Fällig am" type="date" value={form.faellig} onChange={e => setForm(f => ({...f, faellig:e.target.value}))} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-400 font-medium">Beschreibung</label>
            <textarea rows={2} value={form.beschreibung} onChange={e => setForm(f => ({...f, beschreibung:e.target.value}))}
              className="bg-navy-dark border border-navy-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-400 resize-none" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button onClick={handleSave} disabled={!form.titel}>Aufgabe erstellen</Button>
          <Button variant="ghost" onClick={() => setShowModal(false)}>Abbrechen</Button>
        </div>
      </Modal>
    </div>
  )
}
