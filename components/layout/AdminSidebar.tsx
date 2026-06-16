'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  LayoutDashboard, FolderOpen, Users, Receipt, CheckSquare,
  Inbox, Calendar, Files, Settings, LogOut
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { getInitials } from '@/lib/utils'

const NAV_ITEMS = [
  { href:'/admin',              icon:LayoutDashboard, label:'Dashboard'     },
  { href:'/admin/projekte',     icon:FolderOpen,      label:'Projekte'      },
  { href:'/admin/kunden',       icon:Users,           label:'Kunden'        },
  { href:'/admin/rechnungen',   icon:Receipt,         label:'Rechnungen'    },
  { href:'/admin/aufgaben',     icon:CheckSquare,     label:'Aufgaben'      },
  { href:'/admin/leads',        icon:Inbox,           label:'Leads'         },
  { href:'/admin/kalender',     icon:Calendar,        label:'Kalender'      },
  { href:'/admin/dateien',      icon:Files,           label:'Dateien'       },
  { href:'/admin/einstellungen',icon:Settings,        label:'Einstellungen' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const leads = useStore(s => s.leads)
  const newLeadsCount = leads.filter(l => l.status === 'Neu').length

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-navy-dark border-r border-navy-border flex flex-col z-30">
      <div className="flex items-center px-5 py-4 border-b border-navy-border">
        <div style={{ background: 'white', borderRadius: '8px', padding: '5px 10px', display: 'inline-flex', alignItems: 'center' }}>
          <Image src="/logo.jpg" alt="ScaleGroupe" width={110} height={28} className="h-7 w-auto object-contain" />
        </div>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="px-3 space-y-0.5">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                  active
                    ? 'bg-purple-500/20 text-white border-l-4 border-purple-400 pl-2'
                    : 'text-gray-400 hover:text-white hover:bg-navy-light'
                }`}
              >
                <Icon size={18} className={active ? 'text-purple-light' : 'text-gray-500 group-hover:text-gray-300'} />
                <span>{label}</span>
                {label === 'Leads' && newLeadsCount > 0 && (
                  <span className="ml-auto bg-purple text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                    {newLeadsCount}
                  </span>
                )}
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
