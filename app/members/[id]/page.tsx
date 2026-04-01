'use client'

import { useState, useEffect } from 'react'
import type { ExcelMP } from '@/lib/excel-mps'
import { notFound } from 'next/navigation'
import { ChevronLeft, MapPin } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

const PARTY_COLORS: Record<string, string> = {
  RSP: '#6366f1', NC: '#3b82f6', UML: '#ef4444',
  MAOIST: '#dc2626', RPP: '#f97316', JSP: '#10b981',
  CPNUS: '#f59e0b', NMKP: '#8b5cf6',
}
function partyColor(short: string) { return PARTY_COLORS[short] ?? '#6b7280' }

function ProfilePageInternal({ id }: { id: string }) {
  const [mp, setMp] = useState<ExcelMP | null | undefined>(undefined) // undefined = loading

  useEffect(() => {
    import('@/lib/mps-excel.json').then(m => {
      const found = (m.default as ExcelMP[]).find(x => x.id === id)
      setMp(found ?? null)
    })
  }, [id])

  if (mp === undefined) {
    // Loading skeleton
    return (
      <div className="page-container">
        <div style={{ height: 280, borderRadius: 12, background: 'var(--surface-3)', animation: 'pulse-skeleton 1.5s ease-in-out infinite' }} />
        <style>{`@keyframes pulse-skeleton { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      </div>
    )
  }

  if (mp === null) return notFound()

  const color = partyColor(mp.partyShort)

  return (
    <div className="page-container">
      <Link href="/members" className="btn-ghost" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
        <ChevronLeft size={16} /> Back to Members
      </Link>

      {/* Hero card */}
      <div className="card-elevated animate-fade-in" style={{ marginBottom: '1.5rem', borderTop: `3px solid ${color}` }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Avatar initial */}
          <div style={{
            width: 80, height: 80, borderRadius: '50%', flexShrink: 0,
            background: `${color}18`, border: `2px solid ${color}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 900, color,
          }}>
            {mp.name.charAt(0)}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Seat #{mp.id}
            </div>
            <h1 className="heading-xl" style={{ marginBottom: '0.75rem' }}>{mp.name}</h1>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <span style={{
                padding: '0.25rem 0.6rem', borderRadius: 6, fontSize: '0.72rem', fontWeight: 800,
                background: `${color}22`, color, letterSpacing: '0.04em',
              }}>
                {mp.party} ({mp.partyShort})
              </span>
              <span className="chip chip-muted">
                <MapPin size={10} style={{ display: 'inline' }} /> {mp.district}
              </span>
              <span className="chip chip-indigo">{mp.electionType}</span>
              <span className="chip chip-muted">{mp.province}</span>
              {mp.inclusiveGroup && (
                <span className="chip chip-muted">{mp.inclusiveGroup}</span>
              )}
            </div>

            {/* Stats row — only show real data */}
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: mp.gender === 'Female' ? 'var(--text-accent)' : 'var(--text-secondary)' }}>
                  {mp.gender === 'Female' ? '♀ Female' : '♂ Male'}
                </div>
                <div className="section-label" style={{ marginTop: '0.2rem' }}>Gender</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        <div className="card animate-fade-up">
          <div className="section-label" style={{ marginBottom: '0.875rem' }}>Constituency Details</div>
          {[
            { label: 'Province',         value: mp.province },
            { label: 'District',         value: mp.district },
            { label: 'Election Type',    value: mp.electionType },
            { label: 'Inclusive Group',  value: mp.inclusiveGroup ?? '—' },
          ].map(r => (
            <div key={r.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '0.5rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.78rem', gap: '0.5rem',
            }}>
              <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>{r.label}</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)', textAlign: 'right' }}>{r.value}</span>
            </div>
          ))}
        </div>

        <div className="card animate-fade-up">
          <div className="section-label" style={{ marginBottom: '0.875rem' }}>Performance Tracking</div>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '1.5rem 0', color: 'var(--text-muted)', textAlign: 'center', gap: '0.5rem',
          }}>
            <div style={{ fontSize: '0.8rem' }}>Voting &amp; attendance records coming soon</div>
            <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>Parliament.gov.np integration in progress</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  return <ProfilePageInternal id={id} />
}
