'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, FileText, Users, Building2,
  Shield, Radio, Share2, Cpu, MapPin, Activity,
  Zap, ChevronRight, CheckSquare
} from 'lucide-react'

const nav = [
  {
    group: 'Core',
    items: [
      { href: '/',           icon: LayoutDashboard, label: 'Dashboard',         labelNe: 'ड्यासबोर्ड' },
      { href: '/activities', icon: Activity,        label: 'Activity Feed',      labelNe: 'गतिविधि' },
      { href: '/find-my-mp', icon: MapPin,          label: 'Find My MP',         labelNe: 'मेरो सांसद' },
    ]
  },
  {
    group: 'Legislature',
    items: [
      { href: '/bills',      icon: FileText,  label: 'Bills Tracker',    labelNe: 'विधेयक' },
      { href: '/committees', icon: Building2, label: 'Committees',        labelNe: 'समितिहरू' },
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
        <div className="logo-sub">Nepal Parliamentary Monitor</div>
      </div>

      {/* Live badge */}
      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--emerald-soft)', padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(16,185,129,0.15)' }}>
          <span className="dot dot-live" />
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--emerald)', letterSpacing: '0.06em' }}>
            LIVE MONITORING
          </span>
          <Radio size={11} style={{ color: 'var(--emerald)', marginLeft: 'auto' }} />
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
                  <Icon size={15} style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 500, lineHeight: 1.2 }}>{label}</div>
                    <div className="font-deva" style={{ fontSize: '0.65rem', color: active ? 'var(--text-accent)' : 'var(--text-muted)', lineHeight: 1 }}>{labelNe}</div>
                  </div>
                  {active && <ChevronRight size={12} style={{ flexShrink: 0, color: 'var(--indigo)' }} />}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          <div style={{ fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>जनादेश v2.0</div>
          <div>RSP Parliament 2083 B.S.</div>
          <div>Data: parliament.gov.np</div>
        </div>
      </div>
    </aside>
  )
}
