import { create } from 'zustand'
import {
  Projekt, Kunde, Rechnung, Lead, Aufgabe, Termin,
  PROJEKTE, KUNDEN, RECHNUNGEN, LEADS, AUFGABEN, TERMINE
} from './mock-data'

export interface Todo {
  id: string
  text: string
  done: boolean
}

interface StoreState {
  projekte: Projekt[]
  kunden: Kunde[]
  rechnungen: Rechnung[]
  leads: Lead[]
  aufgaben: Aufgabe[]
  termine: Termin[]
  todos: Todo[]

  addProjekt: (p: Projekt) => void
  updateProjekt: (id: string, updates: Partial<Projekt>) => void
  deleteProjekt: (id: string) => void

  addKunde: (k: Kunde) => void
  updateKunde: (id: string, updates: Partial<Kunde>) => void
  deleteKunde: (id: string) => void

  addRechnung: (r: Rechnung) => void
  updateRechnung: (id: string, updates: Partial<Rechnung>) => void
  deleteRechnung: (id: string) => void

  addLead: (l: Lead) => void
  updateLead: (id: string, updates: Partial<Lead>) => void
  deleteLead: (id: string) => void

  addAufgabe: (a: Aufgabe) => void
  updateAufgabe: (id: string, updates: Partial<Aufgabe>) => void
  deleteAufgabe: (id: string) => void

  addTermin: (t: Termin) => void

  addTodo: (text: string) => void
  toggleTodo: (id: string) => void
}

export const useStore = create<StoreState>((set) => ({
  projekte: PROJEKTE,
  kunden: KUNDEN,
  rechnungen: RECHNUNGEN,
  leads: LEADS,
  aufgaben: AUFGABEN,
  termine: TERMINE,
  todos: [],

  addProjekt: (p) => set((s) => ({ projekte: [...s.projekte, p] })),
  updateProjekt: (id, updates) => set((s) => ({
    projekte: s.projekte.map(p => p.id === id ? { ...p, ...updates } : p)
  })),
  deleteProjekt: (id) => set((s) => ({ projekte: s.projekte.filter(p => p.id !== id) })),

  addKunde: (k) => set((s) => ({ kunden: [...s.kunden, k] })),
  updateKunde: (id, updates) => set((s) => ({
    kunden: s.kunden.map(k => k.id === id ? { ...k, ...updates } : k)
  })),
  deleteKunde: (id) => set((s) => ({ kunden: s.kunden.filter(k => k.id !== id) })),

  addRechnung: (r) => set((s) => ({ rechnungen: [...s.rechnungen, r] })),
  updateRechnung: (id, updates) => set((s) => ({
    rechnungen: s.rechnungen.map(r => r.id === id ? { ...r, ...updates } : r)
  })),
  deleteRechnung: (id) => set((s) => ({ rechnungen: s.rechnungen.filter(r => r.id !== id) })),

  addLead: (l) => set((s) => ({ leads: [...s.leads, l] })),
  updateLead: (id, updates) => set((s) => ({
    leads: s.leads.map(l => l.id === id ? { ...l, ...updates } : l)
  })),
  deleteLead: (id) => set((s) => ({ leads: s.leads.filter(l => l.id !== id) })),

  addAufgabe: (a) => set((s) => ({ aufgaben: [...s.aufgaben, a] })),
  updateAufgabe: (id, updates) => set((s) => ({
    aufgaben: s.aufgaben.map(a => a.id === id ? { ...a, ...updates } : a)
  })),
  deleteAufgabe: (id) => set((s) => ({ aufgaben: s.aufgaben.filter(a => a.id !== id) })),

  addTermin: (t) => set((s) => ({ termine: [...s.termine, t] })),

  addTodo: (text) => set((s) => ({
    todos: [...s.todos, { id: Date.now().toString(), text, done: false }]
  })),
  toggleTodo: (id) => set((s) => ({
    todos: s.todos.map(t => t.id === id ? { ...t, done: !t.done } : t)
  })),
}))
