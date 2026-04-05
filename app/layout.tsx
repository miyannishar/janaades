import type { Metadata } from 'next'
import './globals.css'
import TopNav from '@/components/organisms/TopNav'
import LiveTicker from '@/components/organisms/LiveTicker'

export const metadata: Metadata = {
  title: 'जनादेश Monitor — Civic Data Portal',
  description: 'Authoritative data portal for Nepal\'s Parliament, cabinet, legislation and government accountability.',
  keywords: ['Nepal parliament', 'civic portal', 'legislation tracking'],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ne" suppressHydrationWarning>
      <body>
        <div className="app-shell">
          <TopNav />
          <LiveTicker />
          <div className="main-content">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
