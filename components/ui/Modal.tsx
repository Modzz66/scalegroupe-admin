'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export default function Modal({ open, onClose, title, children, size='md' }: ModalProps) {
  const widths = { sm:'max-w-sm', md:'max-w-lg', lg:'max-w-2xl' }
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            exit={{ opacity:0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity:0, scale:0.95 }}
            animate={{ opacity:1, scale:1 }}
            exit={{ opacity:0, scale:0.95 }}
            transition={{ duration:0.2 }}
            className={`relative w-full ${widths[size]} bg-navy-dark border border-navy-border rounded-2xl shadow-2xl`}
          >
            <div className="flex items-center justify-between p-6 border-b border-navy-border">
              <h3 className="font-display font-bold text-white text-lg">{title}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
