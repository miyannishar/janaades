'use client'

import { useState, useEffect } from 'react'
import type { Bill, BillStatus } from '@/lib/types'
import {
  FileText, Search, ChevronRight, Calendar, Tag,
  ExternalLink, Loader2, AlertCircle, Download, Building, Users
} from 'lucide-react'

// ─── Parliament pipeline stages (in order) ───────────────────────────────────

const PIPELINE: { key: BillStatus; short: string; label: string }[] = [
  { key: 'introduced',              short: 'Intro',    label: 'Introduced' },
  { key: 'general_discussion',      short: 'G.Disc',   label: 'General Discussion' },
  { key: 'in_committee',            short: 'Comm.',    label: 'In Committee' },
  { key: 'committee_reported',      short: 'Report',   label: 'Committee Report' },
  { key: 'passed',                  short: 'HoR✓',     label: 'Passed by House' },
  { key: 'passed_national_assembly',short: 'NA✓',      label: 'National Assembly' },
  { key: 'repassed',                short: 'Repas.',   label: 'Repassed' },
  { key: 'authenticated',           short: 'Auth.',    label: 'Authenticated' },
]

const STAGE_IDX: Partial<Record<BillStatus, number>> = Object.fromEntries(
  PIPELINE.map(({ key }, i) => [key, i])
)

function BillPipeline({ status }: { status: BillStatus }) {
  const failed  = status === 'failed' || status === 'withdrawn'
  const current = STAGE_IDX[status] ?? 0

  return (
    <div style={{ display: 'flex', borderRadius: 6, overflow: 'hidden', gap: 1 }}>
      {PIPELINE.map(({ key, short }, i) => {
        const done   = !failed && i < current
        const active = !failed && i === current
        return (
          <div key={key} title={PIPELINE[i].label} style={{
            flex: 1, padding: '3px 2px', textAlign: 'center',
            fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.03em',
            background: failed
              ? (i === 0 ? 'var(--crimson-soft)' : 'var(--surface-1)')
              : done   ? 'var(--emerald-soft)'
              : active ? 'var(--indigo-glow)'
              :          'var(--surface-1)',
            color: failed
              ? (i === 0 ? 'var(--crimson)' : 'var(--text-muted)')
              : done   ? 'var(--emerald)'
              : active ? 'var(--text-accent)'
              :          'var(--text-muted)',
          }}>
            {failed && i === 0 ? '✕' : done ? '✓' : short}
          </div>
        )
      })}
    </div>
  )
}

// ─── Status chip config ───────────────────────────────────────────────────────

const STATUS_META: Partial<Record<BillStatus, { cls: string; label: string }>> = {
  introduced:               { cls: 'chip-indigo',   label: 'INTRODUCED' },
  general_discussion:       { cls: 'chip-info',     label: 'GENERAL DISC.' },
  in_committee:             { cls: 'chip-warn',     label: 'IN COMMITTEE' },
  committee_reported:       { cls: 'chip-warn',     label: 'COMM. REPORT' },
  passed:                   { cls: 'chip-ok',       label: 'PASSED HoR' },
  passed_national_assembly: { cls: 'chip-ok',       label: 'PASSED NA' },
  repassed:                 { cls: 'chip-ok',       label: 'REPASSED' },
  authenticated:            { cls: 'chip-ok',       label: 'ENACTED ✓' },
  failed:                   { cls: 'chip-critical', label: 'FAILED' },
  withdrawn:                { cls: 'chip-muted',    label: 'WITHDRAWN' },
}

// ─── Filter tabs ──────────────────────────────────────────────────────────────

const ACTIVE_STATUSES: BillStatus[] = [
  'introduced', 'general_discussion', 'in_committee', 'committee_reported'
]
const PASSED_STATUSES: BillStatus[] = [
  'passed', 'passed_national_assembly', 'repassed', 'authenticated'
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function BillsPage() {
  const [bills, setBills]     = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('All')
  const [chamber, setChamber] = useState<'Both' | 'HOR' | 'NA'>('Both')

  useEffect(() => {
    async function load() {
      try {
        const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/bills?select=*&order=created_at.desc`
        const res = await fetch(url, {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
          },
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: Bill[] = await res.json()
        setBills(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load bills')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = bills.filter(b => {
    const q = search.toLowerCase()
    const matchQ = !q
      || b.title.toLowerCase().includes(q)
      || (b.ministry ?? '').toLowerCase().includes(q)
      || (b.presenter ?? '').toLowerCase().includes(q)
    const matchF =
      filter === 'All'      ? true
      : filter === 'Active' ? ACTIVE_STATUSES.includes(b.status)
      : filter === 'Passed' ? PASSED_STATUSES.includes(b.status)
      : filter === 'Failed' ? (b.status === 'failed' || b.status === 'withdrawn')
      : true
    const matchC = chamber === 'Both' ? true : b.chamber === chamber
    return matchQ && matchF && matchC
  })

  const total   = bills.length
  const active  = bills.filter(b => ACTIVE_STATUSES.includes(b.status)).length
  const passed  = bills.filter(b => PASSED_STATUSES.includes(b.status)).length
  const enacted = bills.filter(b => b.status === 'authenticated').length
  const horCount = bills.filter(b => b.chamber === 'HOR').length
  const naCount  = bills.filter(b => b.chamber === 'NA').length

  const FILTERS = ['All', 'Active', 'Passed', 'Failed']

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="heading-xl">
            <span className="font-deva" style={{ marginRight: '0.5rem' }}>विधेयक</span>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: '1.25rem' }}>
              / Bills Tracker
            </span>
          </h1>
          <p className="text-secondary" style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
            Current state of bills — Pratinidhi Sabha, Nepal
          </p>
        </div>
      </div>

      <div className="page-container">
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem', marginBottom: '1rem' }}
          className="stagger">
          {[
            { label: 'Total Bills',  value: total,   color: 'var(--indigo)' },
            { label: 'In Progress',  value: active,  color: 'var(--amber)' },
            { label: 'Passed HoR',   value: passed,  color: 'var(--emerald)' },
            { label: 'Enacted',      value: enacted, color: 'var(--teal, var(--emerald))' },
          ].map(s => (
            <div key={s.label} className="card animate-fade-up" style={{ padding: '0.875rem 1rem' }}>
              <div className="section-label">{s.label}</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: s.color, marginTop: '0.25rem', fontVariantNumeric: 'tabular-nums' }}>
                {loading ? '—' : s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 200px' }}>
            <Search size={13} style={{ position: 'absolute', left: '0.625rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="input" placeholder="Search bills, ministry, presenter…"
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '2rem' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.375rem' }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={filter === f ? 'btn-primary' : 'btn-ghost'}
                style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Chamber filter */}
        <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '0.75rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginRight: '0.25rem' }}>Chamber:</span>
          {(['Both', 'HOR', 'NA'] as const).map(c => (
            <button key={c} onClick={() => setChamber(c)}
              className={chamber === c ? 'btn-primary' : 'btn-ghost'}
              style={{ padding: '0.25rem 0.625rem', fontSize: '0.7rem' }}>
              {c === 'Both'
                ? `Both (${loading ? '…' : total})`
                : c === 'HOR'
                ? `🏛 HoR (${loading ? '…' : horCount})`
                : `🏟 NA (${loading ? '…' : naCount})`}
            </button>
          ))}
        </div>

        {/* States */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', padding: '2rem', justifyContent: 'center' }}>
            <Loader2 size={18} className="animate-spin" />
            Loading bills from parliament…
          </div>
        )}
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--crimson)', padding: '1rem' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Bills list */}
        {!loading && !error && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                No bills match your search.
              </div>
            )}
            {filtered.map(bill => {
              const meta = STATUS_META[bill.status] ?? { cls: 'chip-muted', label: bill.status.toUpperCase() }
              return (
                <div key={bill.id} className="card animate-fade-up" style={{ padding: '1rem 1.25rem' }}>
                  {/* Header row */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <FileText size={16} style={{ flexShrink: 0, marginTop: 2, color: 'var(--indigo)' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Chips + date */}
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                        <span className={`chip ${meta.cls}`}>{meta.label}</span>
                        {/* Chamber badge */}
                        <span className="chip" style={{
                          background: bill.chamber === 'HOR' ? 'rgba(99,102,241,0.12)' : 'rgba(20,184,166,0.12)',
                          color: bill.chamber === 'HOR' ? 'var(--indigo)' : '#14b8a6',
                          fontWeight: 700, fontSize: '0.6rem',
                        }}>
                          {bill.chamber === 'HOR' ? '🏛 HoR' : '🏟 NA'}
                        </span>
                        {bill.registration_no && (
                          <span className="chip chip-muted">Reg #{bill.registration_no}</span>
                        )}
                        {bill.session && (
                          <span className="chip chip-muted">Session {bill.session}</span>
                        )}
                        {bill.governmental_type && (
                          <span className="chip chip-muted" style={{ fontSize: '0.6rem' }}>
                            {bill.governmental_type}
                          </span>
                        )}
                        {bill.original_amendment && (
                          <span className="chip chip-muted" style={{ fontSize: '0.6rem' }}>
                            {bill.original_amendment}
                          </span>
                        )}
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                          <Calendar size={10} style={{ display: 'inline', marginRight: 3 }} />
                          {bill.year_bs ?? bill.timeline_present ?? '—'}
                        </span>
                      </div>

                      {/* Title */}
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9375rem', lineHeight: 1.3, marginBottom: '0.1rem' }}>
                        {bill.title}
                      </div>
                      {bill.title_nepali && (
                        <div className="font-deva" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                          {bill.title_nepali}
                        </div>
                      )}

                      {/* Summary */}
                      {bill.summary && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.25rem' }}>
                          {bill.summary}
                        </div>
                      )}

                      {/* Key points */}
                      {bill.key_points && bill.key_points.length > 0 && (
                        <ul style={{ margin: '0.25rem 0 0.25rem 1rem', padding: 0, fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                          {bill.key_points.slice(0, 3).map((pt, i) => (
                            <li key={i}>{pt}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Pipeline */}
                  <BillPipeline status={bill.status} />

                  {/* Footer */}
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.625rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    {bill.presenter && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        <Tag size={10} style={{ display: 'inline', marginRight: 3 }} />
                        <span style={{ color: 'var(--text-secondary)' }}>{bill.presenter}</span>
                      </span>
                    )}
                    {(bill.ministry && !bill.presenter) && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        <Tag size={10} style={{ display: 'inline', marginRight: 3 }} />
                        <span style={{ color: 'var(--text-secondary)' }}>{bill.ministry}</span>
                      </span>
                    )}
                    {bill.pdf_url && (
                      <a href={bill.pdf_url} target="_blank" rel="noopener noreferrer"
                        className="btn-ghost"
                        style={{ padding: '0.15rem 0.5rem', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <Download size={10} /> PDF
                      </a>
                    )}
                    {bill.source_url && (
                      <a href={bill.source_url} target="_blank" rel="noopener noreferrer"
                        className="btn-ghost"
                        style={{ padding: '0.15rem 0.5rem', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <ExternalLink size={10} /> Parliament
                      </a>
                    )}
                    <a href={`/bills/${bill.id}`}
                      className="btn-ghost"
                      style={{ padding: '0.15rem 0.5rem', fontSize: '0.7rem', marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      Full Details <ChevronRight size={11} />
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
