import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'

export const metadata: Metadata = {
  title: 'जनादेश Monitor — Nepal Parliamentary Intelligence',
  description: 'Real-time AI-powered monitoring of Nepal\'s Parliament, cabinet, legislation and government accountability. 2083 B.S. RSP Parliament.',
  keywords: ['Nepal parliament', 'opposition monitor', 'Balendra Shah', 'RSP', 'legislation tracking'],
}

const TICKER_ITEMS = [
  { label: 'LIVE', text: 'RSP wins 182/275 seats — Balendra Shah confirmed Prime Minister' },
  { label: 'BILL', text: 'Digital Nepal Framework Act 2082 passed Third Reading — 201 Ayes' },
  { label: 'ALERT', text: 'Finance Minister budget submission 48hrs overdue — escalated' },
  { label: 'SESSION', text: 'House of Representatives in session — Monsoon Session 2083' },
  { label: 'VOTE', text: 'Budget 2083/84 approved — Rs. 1.79 trillion · 175 Ayes, 42 Nays' },
  { label: 'SCRAPER', text: '6 data sources active · parliament.gov.np last synced 4 min ago' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ne" data-scroll-behavior="smooth">
      <body>
        <div className="app-shell">
          <Sidebar />
          <div className="main-content">
            {/* Live ticker */}
            <div className="ticker-bar">
              <div className="ticker-label">
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--crimson)', animation: 'pulse-live 1.5s ease-in-out infinite', display: 'inline-block' }} />
                LIVE
              </div>
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <div className="ticker-track">
                  {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                    <span key={i} className="ticker-item">
                      <span style={{
                        fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.08em',
                        padding: '1px 5px', borderRadius: '3px',
                        background: item.label === 'ALERT' ? 'var(--crimson-soft)' : item.label === 'BILL' ? 'var(--emerald-soft)' : 'var(--indigo-soft)',
                        color: item.label === 'ALERT' ? 'var(--crimson)' : item.label === 'BILL' ? 'var(--emerald)' : 'var(--text-accent)',
                      }}>
                        {item.label}
                      </span>
                      <strong>{item.text}</strong>
                      <span style={{ color: 'var(--text-muted)', margin: '0 0.5rem' }}>·</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Page content */}
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
