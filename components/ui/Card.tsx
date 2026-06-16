import React from 'react'

export default function Card({ children, className='' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-navy-light border border-navy-border rounded-2xl ${className}`}>
      {children}
    </div>
  )
}
