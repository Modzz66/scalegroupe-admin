import React from 'react'

export default function Card({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div className={`bg-navy-light border border-navy-border rounded-2xl ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}
