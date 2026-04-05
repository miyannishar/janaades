import Link from 'next/link'
import { LayoutDashboard, FileText, Users, Shield, Zap, Activity } from 'lucide-react'

export default function TopNav() {
  // Hardcoding active for now, could use usePathname
  return (
    <header className="top-nav">
      <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', height: '100%' }}>
        {/* Brand */}
        <Link href="/" style={{ textDecoration: 'none' }}>
           <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span className="font-deva" style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>जनादेश</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Monitor</span>
           </div>
        </Link>

        {/* Navigation Links */}
        <nav className="nav-links">
          <Link href="/" className="nav-item">
             Ledger
          </Link>
          <Link href="/bills" className="nav-item">
             Legislation
          </Link>
          <Link href="/members" className="nav-item">
             Parliament
          </Link>
          <Link href="/misconduct" className="nav-item">
             Accountability
          </Link>
          <Link href="/promises" className="nav-item">
             Watchdog
          </Link>
          <Link href="/find-my-mp" className="nav-item">
             Find My MP
          </Link>
          <Link href="/ai-intelligence" className="nav-item" style={{ color: 'var(--rsp)' }}>
             Agent Insights
          </Link>
          <Link href="/ai-chat" className="nav-item" style={{ color: 'var(--rsp)' }}>
             AI Chat
          </Link>
        </nav>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
         <span className="chip chip-ok" style={{ background: 'transparent' }}>
             <span className="dot dot-live" /> 
             Live Session: Monsoon 2083
         </span>
      </div>
    </header>
  )
}
