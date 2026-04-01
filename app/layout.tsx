import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'
import LiveTicker from '@/components/layout/LiveTicker'
import { ThemeProvider } from '@/components/layout/ThemeProvider'

export const metadata: Metadata = {
  title: 'जनादेश Monitor — Nepal Parliamentary Intelligence',
  description: 'Real-time AI-powered monitoring of Nepal\'s Parliament, cabinet, legislation and government accountability. 2083 B.S. RSP Parliament.',
  keywords: ['Nepal parliament', 'opposition monitor', 'Balendra Shah', 'RSP', 'legislation tracking'],
}

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
              <LiveTicker />
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
