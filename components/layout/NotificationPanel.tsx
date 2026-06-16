'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, FileText, UserPlus, AlertCircle, CheckCircle, Calendar } from 'lucide-react'

const NOTIFICATIONS = [
  { id:1, icon: AlertCircle, color:'text-red-400', bg:'bg-red-500/10', title:'Rechnung überfällig', desc:'FashionLoop – RE-2024-006 ist seit 15 Tagen überfällig.', time:'Vor 2 Std.' },
  { id:2, icon: UserPlus, color:'text-purple-300', bg:'bg-purple-500/10', title:'Neuer Lead eingegangen', desc:'Thomas Bauer (Gastro Bauer GmbH) hat Interesse am Pro-Paket.', time:'Vor 3 Std.' },
  { id:3, icon: CheckCircle, color:'text-emerald-400', bg:'bg-emerald-500/10', title:'Projekt abgeschlossen', desc:'Shopify Redesign für SportGear24 wurde abgeschlossen.', time:'Gestern' },
  { id:4, icon: Calendar, color:'text-blue-400', bg:'bg-blue-500/10', title:'Termin morgen', desc:'Kick-off Call mit TechStart GmbH um 10:00 Uhr.', time:'Gestern' },
  { id:5, icon: FileText, color:'text-amber-400', bg:'bg-amber-500/10', title:'Feedback erhalten', desc:'TechStart GmbH hat Änderungswünsche zur Landing Page gesendet.', time:'Vor 2 Tagen' },
]

interface NotificationPanelProps {
  open: boolean
  onClose: () => void
}

export default function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity:0, x:20 }}
            animate={{ opacity:1, x:0 }}
            exit={{ opacity:0, x:20 }}
            transition={{ duration:0.2 }}
            className="fixed right-4 top-16 z-50 w-96 bg-navy-dark border border-navy-border rounded-2xl shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-navy-border">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-purple-light" />
                <h3 className="font-semibold text-white">Benachrichtigungen</h3>
                <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">2</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-xs text-purple-light hover:text-purple transition-colors">
                  Alle gelesen
                </button>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="divide-y divide-navy-border max-h-[480px] overflow-y-auto">
              {NOTIFICATIONS.map((n) => (
                <div key={n.id} className="flex gap-3 p-4 hover:bg-navy-light/50 transition-colors cursor-pointer">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${n.bg}`}>
                    <n.icon size={16} className={n.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{n.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{n.desc}</p>
                    <p className="text-xs text-gray-600 mt-1">{n.time}</p>
                  </div>
                  {n.id <= 2 && <div className="w-2 h-2 rounded-full bg-purple-light flex-shrink-0 mt-1.5" />}
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
