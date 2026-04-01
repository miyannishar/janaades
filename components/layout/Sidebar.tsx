'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, FileText, Users,
  Shield, Radio, Share2, Cpu, MapPin, Activity,
  Zap, ChevronRight, CheckSquare, Sparkles
} from 'lucide-react'
import ThemeToggle from './ThemeToggle'

const nav = [
  {
    group: 'Core',
    items: [
      { href: '/',           icon: LayoutDashboard, label: 'Dashboard',         labelNe: 'ड्यासबोर्ड' },
      { href: '/activity',  icon: Activity,        label: 'Activity Feed',      labelNe: 'गतिविधि' },
      { href: '/find-my-mp', icon: MapPin,          label: 'Find My MP',         labelNe: 'मेरो सांसद' },
    ]
  },
  {
    group: 'Legislature',
    items: [
      { href: '/bills',      icon: FileText,  label: 'Bills Tracker',    labelNe: 'विधेयक' },
    ]
  },
  {
    group: 'Members',
    items: [
      { href: '/members',    icon: Users,  label: 'All MPs',          labelNe: 'सांसद सूची' },
      { href: '/ministers',  icon: Shield, label: 'Cabinet Ministers', labelNe: 'मन्त्रिपरिषद' },
    ]
  },
  {
    group: 'Accountability',
    items: [
      { href: '/misconduct', icon: Zap,          label: 'Misconduct DB',   labelNe: 'दुर्व्यवहार' },
      { href: '/promises',   icon: CheckSquare,  label: 'Promises',        labelNe: '१०० बुँदे वाचा' },
    ]
  },
  {
    group: 'Automation',
    items: [
      { href: '/social', icon: Share2, label: 'Social Posts',    labelNe: 'सामाजिक' },
      { href: '/system', icon: Cpu,    label: 'System Status',   labelNe: 'प्रणाली' },
    ]
  },
]

export default function Sidebar() {
  const path = usePathname()

  return (
    <aside className="sidebar animate-slide">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-mark">जनादेश</div>
        <div className="logo-sub">Parliamentary Monitor</div>
      </div>

      {/* Live Session Badge */}
      <div style={{ padding: '0.75rem 1.25rem' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          background: 'rgba(16, 185, 129, 0.06)',
          padding: '0.5rem 0.875rem',
          borderRadius: '8px',
          border: '1px solid rgba(16, 185, 129, 0.10)',
          transition: 'all 200ms ease',
        }}>
          <span className="dot dot-live" />
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--emerald)', letterSpacing: '0.08em' }}>
              LIVE SESSION
            </span>
            <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)', marginTop: '1px' }}>
              Monsoon 2083 B.S.
            </div>
          </div>
          <Radio size={11} style={{ color: 'var(--emerald)', opacity: 0.7 }} />
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {nav.map(({ group, items }) => (
          <div key={group}>
            <div className="nav-group-label">{group}</div>
            {items.map(({ href, icon: Icon, label, labelNe }) => {
              const active = path === href
              return (
                <Link key={href} href={href} className={`nav-item ${active ? 'active' : ''}`}>
                  <Icon size={15} style={{
                    flexShrink: 0,
                    opacity: active ? 1 : 0.6,
                    transition: 'opacity 200ms ease',
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: active ? 600 : 500, lineHeight: 1.2 }}>{label}</div>
                    <div className="font-deva" style={{
                      fontSize: '0.6rem',
                      color: active ? 'var(--text-accent)' : 'var(--text-muted)',
                      lineHeight: 1,
                      marginTop: '1px',
                      opacity: active ? 0.8 : 0.5,
                    }}>{labelNe}</div>
                  </div>
                  {active && <ChevronRight size={12} style={{ flexShrink: 0, color: 'var(--indigo)', opacity: 0.7 }} />}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        {/* Theme toggle */}
        <div style={{ marginBottom: '0.875rem' }}>
          <ThemeToggle />
        </div>
        <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
          <div style={{
            fontWeight: 700,
            color: 'var(--text-secondary)',
            marginBottom: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}>
            <Sparkles size={10} style={{ color: 'var(--indigo)', opacity: 0.6 }} />
            जनादेश v3.0
          </div>
          <div style={{ opacity: 0.7 }}>RSP Parliament 2083 B.S.</div>
          <div style={{ opacity: 0.5 }}>Data: parliament.gov.np</div>
        </div>
      </div>
    </aside>
  )
}
