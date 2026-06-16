'use client'
import { STATUS_COLORS } from '@/lib/mock-data'

export default function Badge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] || { bg:'bg-gray-500/15', text:'text-gray-400', dot:'bg-gray-400' }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  )
}
