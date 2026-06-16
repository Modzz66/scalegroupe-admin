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

  loadAdminData: () => Promise<void>

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

async function apiFetch(url: string, opts?: RequestInit) {
  try {
    const r = await fetch(url, opts)
    if (!r.ok) return null
    return r.json()
  } catch {
    return null
  }
}

export const useStore = create<StoreState>((set, get) => ({
  projekte: PROJEKTE,
  kunden: KUNDEN,
  rechnungen: RECHNUNGEN,
  leads: LEADS,
  aufgaben: AUFGABEN,
  termine: TERMINE,
  todos: [],

  loadAdminData: async () => {
    const [projekte, kunden, rechnungen, leads, aufgaben, termine] = await Promise.all([
      apiFetch('/api/admin/projekte'),
      apiFetch('/api/admin/kunden'),
      apiFetch('/api/admin/rechnungen'),
      apiFetch('/api/admin/leads'),
      apiFetch('/api/admin/aufgaben'),
      apiFetch('/api/admin/kalender'),
    ])
    if (Array.isArray(projekte))   set({ projekte })
    if (Array.isArray(kunden))     set({ kunden })
    if (Array.isArray(rechnungen)) set({ rechnungen })
    if (Array.isArray(leads))      set({ leads })
    if (Array.isArray(aufgaben))   set({ aufgaben })
    if (Array.isArray(termine))    set({ termine })
  },

  addProjekt: (p) => {
    set(s => ({ projekte: [...s.projekte, p] }))
    apiFetch('/api/admin/projekte', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p),
    })
  },
  updateProjekt: (id, updates) => {
    set(s => ({ projekte: s.projekte.map(p => p.id === id ? { ...p, ...updates } : p) }))
    apiFetch(`/api/admin/projekte/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
  },
  deleteProjekt: (id) => {
    set(s => ({ projekte: s.projekte.filter(p => p.id !== id) }))
    apiFetch(`/api/admin/projekte/${id}`, { method: 'DELETE' })
  },

  addKunde: (k) => {
    set(s => ({ kunden: [...s.kunden, k] }))
    apiFetch('/api/admin/kunden', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(k),
    })
  },
  updateKunde: (id, updates) => {
    set(s => ({ kunden: s.kunden.map(k => k.id === id ? { ...k, ...updates } : k) }))
    apiFetch(`/api/admin/kunden/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
  },
  deleteKunde: (id) => {
    set(s => ({ kunden: s.kunden.filter(k => k.id !== id) }))
    apiFetch(`/api/admin/kunden/${id}`, { method: 'DELETE' })
  },

  addRechnung: (r) => {
    set(s => ({ rechnungen: [...s.rechnungen, r] }))
    apiFetch('/api/admin/rechnungen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(r),
    })
  },
  updateRechnung: (id, updates) => {
    set(s => ({ rechnungen: s.rechnungen.map(r => r.id === id ? { ...r, ...updates } : r) }))
    apiFetch(`/api/admin/rechnungen/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
  },
  deleteRechnung: (id) => {
    set(s => ({ rechnungen: s.rechnungen.filter(r => r.id !== id) }))
    apiFetch(`/api/admin/rechnungen/${id}`, { method: 'DELETE' })
  },

  addLead: (l) => {
    set(s => ({ leads: [...s.leads, l] }))
    apiFetch('/api/admin/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(l),
    })
  },
  updateLead: (id, updates) => {
    set(s => ({ leads: s.leads.map(l => l.id === id ? { ...l, ...updates } : l) }))
    apiFetch(`/api/admin/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
  },
  deleteLead: (id) => {
    set(s => ({ leads: s.leads.filter(l => l.id !== id) }))
    apiFetch(`/api/admin/leads/${id}`, { method: 'DELETE' })
  },

  addAufgabe: (a) => {
    set(s => ({ aufgaben: [...s.aufgaben, a] }))
    apiFetch('/api/admin/aufgaben', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(a),
    })
  },
  updateAufgabe: (id, updates) => {
    set(s => ({ aufgaben: s.aufgaben.map(a => a.id === id ? { ...a, ...updates } : a) }))
    apiFetch(`/api/admin/aufgaben/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
  },
  deleteAufgabe: (id) => {
    set(s => ({ aufgaben: s.aufgaben.filter(a => a.id !== id) }))
    apiFetch(`/api/admin/aufgaben/${id}`, { method: 'DELETE' })
  },

  addTermin: (t) => {
    set(s => ({ termine: [...s.termine, t] }))
    apiFetch('/api/admin/kalender', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(t),
    })
  },

  addTodo: (text) => set(s => ({
    todos: [...s.todos, { id: Date.now().toString(), text, done: false }]
  })),
  toggleTodo: (id) => set(s => ({
    todos: s.todos.map(t => t.id === id ? { ...t, done: !t.done } : t)
  })),
}))
