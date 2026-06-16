import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export default function Button({ variant='primary', size='md', children, className='', ...props }: ButtonProps) {
  const base = 'inline-flex items-center gap-2 font-semibold rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed'
  const sizes = { sm:'px-3 py-1.5 text-xs', md:'px-4 py-2 text-sm', lg:'px-6 py-3 text-base' }
  const variants = {
    primary: 'text-white',
    secondary: 'bg-navy-light text-white hover:bg-navy-border',
    ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-navy-light',
    danger: 'bg-red-500/20 text-red-400 hover:bg-red-500/30',
  }
  const style = variant === 'primary' ? { background:'linear-gradient(135deg,#5B21B6,#9B59F5)' } : {}
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </button>
  )
}
