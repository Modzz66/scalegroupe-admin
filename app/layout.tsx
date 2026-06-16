import type { Metadata } from 'next'
import './globals.css'
import SessionProviderWrapper from '@/components/SessionProviderWrapper'

export const metadata: Metadata = {
  title: 'ScaleGroupe Admin',
  description: 'ScaleGroupe Admin Dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  )
}
