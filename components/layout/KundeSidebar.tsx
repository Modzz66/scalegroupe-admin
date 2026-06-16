'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Home, FolderOpen, Receipt, Files, MessageSquare, LogOut } from 'lucide-react'
import { getInitials } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/kunde',            icon: Home,          label: 'Mein Dashboard' },
  { href: '/kunde/projekte',   icon: FolderOpen,    label: 'Meine Projekte' },
  { href: '/kunde/rechnungen', icon: Receipt,       label: 'Rechnungen'     },
  { href: '/kunde/dateien',    icon: Files,         label: 'Meine Dateien'  },
  { href: '/kunde/feedback',   icon: MessageSquare, label: 'Feedback'       },
]

export default function KundeSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  function isActive(href: string) {
    if (href === '/kunde') return pathname === '/kunde'
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-navy-dark border-r border-navy-border flex flex-col z-30">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-navy-border">
        <Image src="/logo.png" alt="ScaleGroupe" width={120} height={32} className="invert h-8 w-auto object-contain" />
      </div>
      <div className="px-4 py-3 bg-purple-500/10 border-b border-navy-border">
        <p className="text-xs text-purple-light font-semibold">Kundenportal</p>
      </div>
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="px-3 space-y-0.5">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  active
                    ? 'bg-purple-500/20 text-white border-l-4 border-purple-400 pl-2'
                    : 'text-gray-400 hover:text-white hover:bg-navy-light'
                }`}
              >
                <Icon size={18} className={active ? 'text-purple-light' : 'text-gray-500 group-hover:text-gray-300'} />
                <span>{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
      <div className="p-4 border-t border-navy-border">
        {session?.user && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#5B21B6,#9B59F5)' }}>
              {getInitials(session.user.name || '')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{session.user.name}</p>
              <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-gray-500 hover:text-red-400 transition-colors"
              title="Abmelden"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
