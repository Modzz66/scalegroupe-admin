'use client'
import { useState, useEffect, useCallback } from 'react'
import { Search, Bell, X } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { getInitials } from '@/lib/utils'
import { PROJEKTE, KUNDEN, RECHNUNGEN, LEADS } from '@/lib/mock-data'
import NotificationPanel from './NotificationPanel'
import { useRouter } from 'next/navigation'

interface AdminTopbarProps {
  title: string
}

export default function AdminTopbar({ title }: AdminTopbarProps) {
  const user = getCurrentUser()
  const router = useRouter()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      setShowSearch(true)
    }
    if (e.key === 'Escape') {
      setShowSearch(false)
      setSearchQuery('')
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const searchResults = searchQuery.length >= 2 ? {
    projekte: PROJEKTE.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.kundeName.toLowerCase().includes(searchQuery.toLowerCase())),
    kunden: KUNDEN.filter(k => k.name.toLowerCase().includes(searchQuery.toLowerCase()) || k.unternehmen.toLowerCase().includes(searchQuery.toLowerCase())),
    rechnungen: RECHNUNGEN.filter(r => r.nummer.toLowerCase().includes(searchQuery.toLowerCase()) || r.kundeName.toLowerCase().includes(searchQuery.toLowerCase())),
    leads: LEADS.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.unternehmen.toLowerCase().includes(searchQuery.toLowerCase())),
  } : null

  return (
    <>
      <div className="h-16 bg-navy-dark/80 backdrop-blur-sm border-b border-navy-border flex items-center justify-between px-6 sticky top-0 z-20">
        <h2 className="font-display font-bold text-white text-xl">{title}</h2>
        <div className="flex items-center gap-3">
          {/* Search */}
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 bg-navy-light border border-navy-border rounded-xl px-4 py-2 text-sm text-gray-500 hover:text-gray-300 hover:border-navy-border/80 transition-colors min-w-[200px]"
          >
            <Search size={14} />
            <span>Suche... Ctrl+K</span>
          </button>

          {/* Bell */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-navy-light border border-navy-border text-gray-400 hover:text-white transition-colors"
          >
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Avatar */}
          {user && (
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white cursor-pointer"
              style={{ background:'linear-gradient(135deg,#5B21B6,#9B59F5)' }}
            >
              {getInitials(user.name)}
            </div>
          )}
        </div>
      </div>

      <NotificationPanel open={showNotifications} onClose={() => setShowNotifications(false)} />

      {/* Global Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setShowSearch(false); setSearchQuery('') }} />
          <div className="relative w-full max-w-2xl bg-navy-dark border border-navy-border rounded-2xl shadow-2xl">
            <div className="flex items-center gap-3 p-4 border-b border-navy-border">
              <Search size={18} className="text-gray-500" />
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Projekte, Kunden, Rechnungen, Leads suchen..."
                className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
              />
              <button onClick={() => { setShowSearch(false); setSearchQuery('') }} className="text-gray-400 hover:text-white">
                <X size={16} />
              </button>
            </div>
            {searchResults ? (
              <div className="max-h-96 overflow-y-auto p-4 space-y-4">
                {searchResults.projekte.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Projekte</p>
                    {searchResults.projekte.map(p => (
                      <button key={p.id} onClick={() => { router.push(`/admin/projekte/${p.id}`); setShowSearch(false); setSearchQuery('') }}
                        className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-navy-light transition-colors">
                        <span className="text-sm text-white font-medium">{p.name}</span>
                        <span className="text-xs text-gray-500">{p.kundeName}</span>
                      </button>
                    ))}
                  </div>
                )}
                {searchResults.kunden.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Kunden</p>
                    {searchResults.kunden.map(k => (
                      <button key={k.id} onClick={() => { router.push(`/admin/kunden/${k.id}`); setShowSearch(false); setSearchQuery('') }}
                        className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-navy-light transition-colors">
                        <span className="text-sm text-white font-medium">{k.name}</span>
                        <span className="text-xs text-gray-500">{k.unternehmen}</span>
                      </button>
                    ))}
                  </div>
                )}
                {searchResults.rechnungen.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Rechnungen</p>
                    {searchResults.rechnungen.map(r => (
                      <button key={r.id} onClick={() => { router.push('/admin/rechnungen'); setShowSearch(false); setSearchQuery('') }}
                        className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-navy-light transition-colors">
                        <span className="text-sm text-white font-medium">{r.nummer}</span>
                        <span className="text-xs text-gray-500">{r.kundeName}</span>
                      </button>
                    ))}
                  </div>
                )}
                {searchResults.leads.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Leads</p>
                    {searchResults.leads.map(l => (
                      <button key={l.id} onClick={() => { router.push('/admin/leads'); setShowSearch(false); setSearchQuery('') }}
                        className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-navy-light transition-colors">
                        <span className="text-sm text-white font-medium">{l.name}</span>
                        <span className="text-xs text-gray-500">{l.unternehmen}</span>
                      </button>
                    ))}
                  </div>
                )}
                {searchResults.projekte.length === 0 && searchResults.kunden.length === 0 && searchResults.rechnungen.length === 0 && searchResults.leads.length === 0 && (
                  <p className="text-center text-gray-500 text-sm py-4">Keine Ergebnisse für &quot;{searchQuery}&quot;</p>
                )}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500 text-sm">Suchbegriff eingeben (mind. 2 Zeichen)</p>
                <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-600">
                  <span><kbd className="bg-navy-light border border-navy-border rounded px-1.5 py-0.5">Esc</kbd> Schließen</span>
                  <span><kbd className="bg-navy-light border border-navy-border rounded px-1.5 py-0.5">Enter</kbd> Öffnen</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
