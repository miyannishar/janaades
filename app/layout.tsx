import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'
import { ThemeProvider } from '@/components/layout/ThemeProvider'

export const metadata: Metadata = {
  title: 'जनादेश Monitor — Nepal Parliamentary Intelligence',
  description: 'Real-time AI-powered monitoring of Nepal\'s Parliament, cabinet, legislation and government accountability. 2083 B.S. RSP Parliament.',
  keywords: ['Nepal parliament', 'opposition monitor', 'Balendra Shah', 'RSP', 'legislation tracking'],
}

const TICKER_ITEMS = [
  { label: 'LIVE',    text: 'RSP wins 182/275 seats — Balendra Shah confirmed Prime Minister' },
  { label: 'BILL',    text: 'Digital Nepal Framework Act 2082 passed Third Reading — 201 Ayes' },
  { label: 'ALERT',   text: 'Finance Minister budget submission 48hrs overdue — escalated' },
  { label: 'SESSION', text: 'House of Representatives in session — Monsoon Session 2083' },
  { label: 'VOTE',    text: 'Budget 2083/84 approved — Rs. 1.79 trillion · 175 Ayes, 42 Nays' },
  { label: 'SCRAPER', text: '6 data sources active · parliament.gov.np last synced 4 min ago' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ne" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme: set data-theme before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('janadesh-theme');
                  if (stored === 'light' || stored === 'dark') {
                    document.documentElement.setAttribute('data-theme', stored);
                  } else {
                    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
                  }
                } catch(e) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <div className="app-shell">
            <Sidebar />
            <div className="main-content">
              {/* Live intelligence ticker */}
              <div className="ticker-bar">
                <div className="ticker-label">
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: 'var(--crimson)',
                    display: 'inline-block',
                    boxShadow: '0 0 6px var(--crimson)',
                    animation: 'pulse-sovereign 2s ease-in-out infinite',
                  }} />
                  LIVE
                </div>
                <div style={{ overflow: 'hidden', flex: 1 }}>
                  <div className="ticker-track">
                    {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                      <span key={i} className="ticker-item">
                        <span style={{
                          fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.08em',
                          padding: '1px 5px', borderRadius: '3px',
                          background:
                            item.label === 'ALERT'   ? 'var(--crimson-soft)' :
                            item.label === 'BILL'    ? 'var(--emerald-soft)' :
                            item.label === 'VOTE'    ? 'var(--amber-soft)'   :
                            'var(--indigo-soft)',
                          color:
                            item.label === 'ALERT'   ? 'var(--crimson)' :
                            item.label === 'BILL'    ? 'var(--emerald)' :
                            item.label === 'VOTE'    ? 'var(--amber)'   :
                            'var(--text-accent)',
                        }}>
                          {item.label}
                        </span>
                        <strong style={{ color: 'var(--text-primary)' }}>{item.text}</strong>
                        <span style={{ color: 'var(--text-muted)', margin: '0 0.5rem' }}>·</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
