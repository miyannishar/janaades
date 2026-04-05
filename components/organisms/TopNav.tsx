'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/',               label: 'Ledger',         ai: false },
  { href: '/bills',          label: 'Legislation',    ai: false },
  { href: '/members',        label: 'Parliament',     ai: false },
  { href: '/misconduct',     label: 'Accountability', ai: false },
  { href: '/promises',       label: 'Watchdog',       ai: false },
  { href: '/find-my-mp',     label: 'Find My MP',     ai: false },
  { href: '/ai-intelligence',label: 'Agent Insights', ai: true  },
  { href: '/ai-chat',        label: 'AI Chat',        ai: true  },
]

export default function TopNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <header className="top-nav">
        <div className="top-nav-brand-links">
          {/* Brand */}
          <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span className="font-deva" style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>जनादेश</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Monitor</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="nav-links nav-links-desktop">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-item${pathname === link.href ? ' active' : ''}`}
                style={link.ai ? { color: 'var(--rsp)' } : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: live status + hamburger */}
        <div className="top-nav-right">
          <span className="chip chip-ok nav-status-chip" style={{ background: 'transparent' }}>
            <span className="dot dot-live" />
            Live Session: Monsoon 2083
          </span>
          <button
            className="nav-hamburger"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {open && (
        <div className="mobile-nav-overlay" onClick={() => setOpen(false)}>
          <nav className="mobile-nav-drawer" onClick={e => e.stopPropagation()}>
            <div className="mobile-nav-header">
              <span className="font-deva" style={{ fontSize: '1.4rem', fontWeight: 700 }}>जनादेश</span>
              <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Monitor</span>
            </div>
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`mobile-nav-item${pathname === link.href ? ' active' : ''}`}
                style={link.ai ? { color: 'var(--rsp)' } : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mobile-nav-footer">
              <span className="chip chip-ok" style={{ background: 'transparent' }}>
                <span className="dot dot-live" /> Live Session: Monsoon 2083
              </span>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
