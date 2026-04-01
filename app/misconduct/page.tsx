'use client'

import { AlertOctagon, Construction, Database } from 'lucide-react'

export default function MisconductPage() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="heading-xl">
            <span style={{ opacity: 0.4, marginRight: '0.5rem' }}>⚖</span>
            Misconduct Database
          </h1>
          <p className="text-secondary" style={{ fontSize: '0.78rem', marginTop: '0.3rem' }}>
            Tracking allegations, investigations, and convictions of public officials
          </p>
        </div>
        <span className="chip chip-warn" style={{ gap: '0.4rem' }}>
          <Construction size={11} />
          In Development
        </span>
      </div>

      <div className="page-container">
        {/* Summary stats — zeroed out */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.75rem' }}>
          {[
            { label: 'Active Cases',       value: '—', color: 'var(--amber)' },
            { label: 'Convictions',        value: '—', color: 'var(--crimson)' },
            { label: 'Cleared',            value: '—', color: 'var(--emerald)' },
            { label: 'High Severity',      value: '—', color: 'var(--indigo)' },
          ].map(s => (
            <div key={s.label} className="card animate-fade-up" style={{ padding: '1rem' }}>
              <div className="section-label">{s.label}</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: s.color, marginTop: '0.5rem', fontVariantNumeric: 'tabular-nums' }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        <div className="card animate-fade-up" style={{
          padding: '5rem 2rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(239,68,68,0.02), rgba(99,102,241,0.02))',
          border: '1px dashed var(--border)',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: 'var(--surface-3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}>
            <AlertOctagon size={28} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
          </div>

          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            No records yet
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: 420, margin: '0 auto 2rem', lineHeight: 1.7 }}>
            The misconduct tracking system is being designed. Records will be sourced
            from CIAA, courts, parliamentary committees, and credible investigative outlets.
          </p>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.75rem', fontWeight: 600,
            background: 'var(--surface-3)', color: 'var(--text-muted)',
            border: '1px solid var(--border)',
          }}>
            <Database size={13} />
            Database schema pending
          </div>
        </div>
      </div>
    </div>
  )
}
