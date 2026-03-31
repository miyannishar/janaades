'use client'

import { useState } from 'react'
import { MOCK_BILLS } from '@/lib/nepal-data'
import { FileText, Search, ChevronRight, Calendar, Tag, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'

const STAGES = ['First Reading', 'Committee Review', 'Second Reading', 'Third Reading', 'Royal Assent', 'Enacted']
const STAGE_SHORT = ['1st', 'Comm.', '2nd', '3rd', 'Assent', 'Law']

const STAGE_IDX: Record<string, number> = {
  'introduced':   0,
  'committee':    1,
  'floor_vote':   2,
  'passed':       4,
  'enacted':      5,
  'failed':       -1,
  'withdrawn':    -1,
}

function BillPipeline({ stage }: { stage: string }) {
  const current = STAGE_IDX[stage] ?? 0
  const failed  = stage === 'failed' || stage === 'withdrawn'
  return (
    <div style={{ display: 'flex', borderRadius: 6, overflow: 'hidden', gap: 1 }}>
      {STAGE_SHORT.map((s, i) => {
        const done    = !failed && i < current
        const active  = !failed && i === current
        const future  = !failed && i > current
        return (
          <div key={s} style={{
            flex: 1, padding: '3px 4px', textAlign: 'center',
            fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em',
            background: failed ? 'var(--crimson-soft)' : done ? 'var(--emerald-soft)' : active ? 'var(--indigo-glow)' : 'var(--surface-1)',
            color: failed ? 'var(--crimson)' : done ? 'var(--emerald)' : active ? 'var(--text-accent)' : 'var(--text-muted)',
          }}>
            {failed ? (i === 0 ? '✕ ' + s : s) : s}
          </div>
        )
      })}
    </div>
  )
}

const STATUS_MAP: Record<string, { cls: string; label: string }> = {
  introduced: { cls: 'chip-indigo',   label: 'INTRODUCED' },
  committee:  { cls: 'chip-warn',     label: 'COMMITTEE' },
  floor_vote: { cls: 'chip-info',     label: 'FLOOR VOTE' },
  passed:     { cls: 'chip-ok',       label: 'PASSED' },
  failed:     { cls: 'chip-critical', label: 'FAILED' },
  withdrawn:  { cls: 'chip-muted',    label: 'WITHDRAWN' },
}

export default function BillsPage() {
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('All')

  const statuses = ['All', 'Active', 'Passed', 'Failed']
  const filtered = MOCK_BILLS.filter(b => {
    const q = search.toLowerCase()
    const matchQ = !q || b.title.toLowerCase().includes(q)
    const matchF =
      filter === 'All'    ? true :
      filter === 'Active' ? !['passed','failed','withdrawn'].includes(b.status) :
      filter === 'Passed' ? b.status === 'passed' :
      filter === 'Failed' ? ['failed','withdrawn'].includes(b.status) : true
    return matchQ && matchF
  })

  const passed  = MOCK_BILLS.filter(b => ['passed','enacted'].includes(b.status)).length
  const active  = MOCK_BILLS.filter(b => !['passed','enacted','failed','withdrawn'].includes(b.status)).length
  const failed  = MOCK_BILLS.filter(b => ['failed','withdrawn'].includes(b.status)).length

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="heading-xl">
            <span className="font-deva" style={{ marginRight: '0.5rem' }}>विधेयक</span>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: '1.25rem' }}>/ Bills Tracker</span>
          </h1>
          <p className="text-secondary" style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
            Legislative pipeline tracking — Pratinidhi Sabha 2083 B.S.
          </p>
        </div>
      </div>

      <div className="page-container">
        {/* Quick stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem', marginBottom: '1rem' }}
          className="stagger">
          {[
            { label: 'Total Bills', value: MOCK_BILLS.length, color: 'var(--indigo)' },
            { label: 'Active',      value: active,            color: 'var(--amber)' },
            { label: 'Passed',      value: passed,            color: 'var(--emerald)' },
            { label: 'Failed',      value: failed,            color: 'var(--crimson)' },
          ].map(s => (
            <div key={s.label} className="card animate-fade-up" style={{ padding: '0.875rem 1rem' }}>
              <div className="section-label">{s.label}</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: s.color, marginTop: '0.25rem', fontVariantNumeric: 'tabular-nums' }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 200px' }}>
            <Search size={13} style={{ position: 'absolute', left: '0.625rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="input" placeholder="Search bills…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2rem' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.375rem' }}>
            {statuses.map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={filter === s ? 'btn-primary' : 'btn-ghost'}
                style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Bills list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {filtered.map(bill => {
            const { cls, label } = STATUS_MAP[bill.status] || { cls: 'chip-muted', label: bill.status.toUpperCase() }
            return (
              <div key={bill.id} className="card animate-fade-up" style={{ padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <FileText size={16} style={{ flexShrink: 0, marginTop: 2, color: 'var(--indigo)' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                      <span className={`chip ${cls}`}>{label}</span>
                      <span className="chip chip-muted">{bill.id}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                        <Calendar size={10} style={{ display: 'inline', marginRight: 3 }} />
                        {(() => { try { return format(new Date(bill.dateIntroduced), 'dd MMM yyyy') } catch { return bill.dateIntroduced ?? '—' } })()
}
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9375rem', lineHeight: 1.3, marginBottom: '0.25rem' }}>
                      {bill.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.625rem' }}>
                      {bill.summary}
                    </div>
                  </div>
                </div>
                {/* Pipeline */}
                <BillPipeline stage={bill.status} />
                {/* Footer */}
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.625rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    <Tag size={10} style={{ display: 'inline', marginRight: 3 }} />
                  By: <span style={{ color: 'var(--text-secondary)' }}>{bill.sponsor ?? bill.ministry}</span>
                  </span>
                  {bill.concerns?.map((tag: string) => (
                    <span key={tag} className="chip chip-muted" style={{ fontSize: '0.6rem' }}>{tag}</span>
                  ))}
                  <a href={`/bills/${bill.id}`} className="btn-ghost" style={{ padding: '0.15rem 0.5rem', fontSize: '0.7rem', marginLeft: 'auto' }}>
                    Full Details <ChevronRight size={11} />
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
