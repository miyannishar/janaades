'use client'

import { Building2 } from 'lucide-react'

export default function CommitteesPage() {
  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem' }} className="animate-fade-in">
        <h1 className="display-md" style={{ marginBottom: '0.25rem' }}>Parliamentary Committees</h1>
        <p className="body-lg">Standing and special committees of Nepal's House of Representatives and National Assembly.</p>
      </div>

      <div className="card animate-fade-in">
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '4rem 1rem', gap: '1rem', textAlign: 'center',
        }}>
          <div style={{
            width: 60, height: 60, borderRadius: 16,
            background: 'var(--indigo-soft)', border: '1px solid var(--border-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Building2 size={26} style={{ color: 'var(--indigo)', opacity: 0.7 }} />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
              Committee data coming soon
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: 400 }}>
              Live committee tracking is being integrated from parliament.gov.np. Data will populate here once the committee scraper is active.
            </div>
          </div>
          <div style={{
            fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            20 committees · 275 seats · Monsoon 2083 B.S.
          </div>
        </div>
      </div>
    </div>
  )
}
