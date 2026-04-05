'use client'

import { useState, useEffect } from 'react'
import type { Bill, BillStatus } from '@/lib/types'
import {
  FileText, Search, ChevronRight, Calendar, Tag,
  ExternalLink, Loader2, AlertCircle, Download
} from 'lucide-react'
import { PageHeader } from '@/components/organisms/PageHeader'

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
    <div style={{ display: 'flex', borderRadius: 0, border: '1px solid var(--border)', overflow: 'hidden', marginTop: '0.75rem' }}>
      {PIPELINE.map(({ key, short }, i) => {
        const done   = !failed && i < current
        const active = !failed && i === current
        return (
          <div key={key} title={PIPELINE[i].label} style={{
            flex: 1, padding: '4px 2px', textAlign: 'center',
            fontSize: '0.62rem', fontWeight: active || done ? 700 : 400,
            borderRight: i < PIPELINE.length - 1 ? '1px solid var(--border)' : 'none',
            background: failed
              ? (i === 0 ? 'var(--text)' : 'transparent')
              : done   ? 'var(--border)'
              : active ? 'var(--text)'
              :          'transparent',
            color: failed
              ? (i === 0 ? 'var(--bg)' : 'var(--text-muted)')
              : done   ? 'var(--text)'
              : active ? 'var(--bg)'
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
  introduced:               { cls: '',   label: 'INTRODUCED' },
  general_discussion:       { cls: '',     label: 'GENERAL DISC.' },
  in_committee:             { cls: 'chip-warn',     label: 'IN COMMITTEE' },
  committee_reported:       { cls: 'chip-warn',     label: 'COMM. REPORT' },
  passed:                   { cls: 'chip-ok',       label: 'PASSED HoR' },
  passed_national_assembly: { cls: 'chip-ok',       label: 'PASSED NA' },
  repassed:                 { cls: 'chip-ok',       label: 'REPASSED' },
  authenticated:            { cls: 'chip-ok',       label: 'ENACTED ✓' },
  failed:                   { cls: 'chip-error',    label: 'FAILED' },
  withdrawn:                { cls: 'chip-muted',    label: 'WITHDRAWN' },
}

// ─── Filter tabs ──────────────────────────────────────────────────────────────

const ACTIVE_STATUSES: BillStatus[] = [
  'introduced', 'general_discussion', 'in_committee', 'committee_reported'
]
const PASSED_STATUSES: BillStatus[] = [
  'passed', 'passed_national_assembly', 'repassed', 'authenticated'
]

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
        const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/bills?select=*&order=created_at.asc`
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
    <div className="page-container animate-fade-up">
      <PageHeader
        label="Legislation"
        title="विधेयक"
        subtitle={`${total} Bills tracked`}
        meta="Pratinidhi Sabha & Rashtriya Sabha"
      />

      <div className="sidebar-grid">
        
        {/* Left Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
           {/* Filters */}
           <div>
             <h3 className="heading-sm" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Registry Filter</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
               <input 
                  type="text"
                  placeholder="Search bills, ministry..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border)', fontSize: '0.85rem' }} 
               />
               
               <div style={{ fontSize: '0.75rem', fontWeight: 600, marginTop: '0.5rem' }}>Status Filter</div>
               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                 {FILTERS.map(f => (
                   <button key={f} onClick={() => setFilter(f)} style={{
                      padding: '0.25rem 0.6rem', fontSize: '0.75rem',
                      background: filter === f ? 'var(--text)' : 'transparent',
                      color: filter === f ? 'var(--bg)' : 'var(--text)',
                      border: '1px solid var(--border)', cursor: 'pointer'
                   }}>
                     {f}
                   </button>
                 ))}
               </div>

               <div style={{ fontSize: '0.75rem', fontWeight: 600, marginTop: '0.5rem' }}>Origin Chamber</div>
               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                 {(['Both', 'HOR', 'NA'] as const).map(c => (
                   <button key={c} onClick={() => setChamber(c)} style={{
                      padding: '0.25rem 0.6rem', fontSize: '0.75rem',
                      background: chamber === c ? 'var(--text)' : 'transparent',
                      color: chamber === c ? 'var(--bg)' : 'var(--text)',
                      border: '1px solid var(--border)', cursor: 'pointer'
                   }}>
                     {c === 'Both' ? 'Both' : c === 'HOR' ? '🏛 HoR' : '🏟 NA'}
                   </button>
                 ))}
               </div>
             </div>
           </div>

           {/* Stats */}
           <div>
             <h3 className="heading-sm" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Legislation Summary</h3>
             <table className="data-table">
               <tbody>
                 <tr>
                   <td style={{ fontWeight: 600 }}>Total Drafts</td>
                   <td style={{ textAlign: 'right' }}>{total}</td>
                 </tr>
                 <tr>
                   <td style={{ fontWeight: 600 }}>In Progress</td>
                   <td style={{ textAlign: 'right' }}>{active}</td>
                 </tr>
                 <tr>
                   <td style={{ fontWeight: 600 }}>Passed HoR</td>
                   <td style={{ textAlign: 'right' }}>{passed}</td>
                 </tr>
                 <tr>
                   <td style={{ fontWeight: 600 }}>Enacted</td>
                   <td style={{ textAlign: 'right' }}>{enacted}</td>
                 </tr>
               </tbody>
             </table>
           </div>

        </div>

        {/* Right Ledger */}
        <div className="ledger-container">
          <div className="ledger-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <h3 className="heading-md">Current Bills Timeline</h3>
             <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{filtered.length} matching</span>
          </div>

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', padding: '2rem', justifyContent: 'center' }}>
              <Loader2 size={18} className="animate-spin" />
              Fetching parliamentary records…
            </div>
          )}
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--error)', padding: '2rem' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {!loading && !error && (
             <div>
               {filtered.length === 0 && (
                 <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                   No bills match your current filters.
                 </div>
               )}
               {filtered.map(bill => {
                 const meta = STATUS_META[bill.status] ?? { cls: '', label: bill.status.toUpperCase() }
                 return (
                    <div key={bill.id} className="feed-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                       <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                          <div style={{ flex: '0 0 60px' }}>
                             <span className={`chip ${meta.cls}`}>{meta.label}</span>
                          </div>
                          
                          <div style={{ flex: 1 }}>
                             {/* Title */}
                             <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9375rem', lineHeight: 1.3, marginBottom: '0.2rem' }}>
                               {bill.title}
                             </div>
                             {bill.title_nepali && (
                               <div className="font-deva" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                 {bill.title_nepali}
                               </div>
                             )}

                             {/* Meta text */}
                             {bill.summary && (
                               <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.5rem', maxWidth: '600px' }}>
                                 {bill.summary}
                               </div>
                             )}
                          </div>
                       </div>
                       
                       <BillPipeline status={bill.status} />

                       {/* Action Row */}
                       <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text)' }}>
                             {bill.chamber === 'HOR' ? '🏛 HoR' : '🏟 NA'}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                             {bill.registration_no && `Reg #${bill.registration_no} · `}
                             {bill.session && `Session ${bill.session}`}
                          </span>
                          
                          {bill.presenter && (
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '1rem' }}>
                              <Tag size={10} style={{ display: 'inline', marginRight: 3 }} />
                              <span style={{ color: 'var(--text-secondary)' }}>{bill.presenter}</span>
                            </span>
                          )}
                          
                          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                            {bill.pdf_url && (
                              <a href={bill.pdf_url} target="_blank" rel="noopener noreferrer"
                                style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: 4, color: 'inherit', textDecoration: 'none' }}>
                                <Download size={10} /> PDF
                              </a>
                            )}
                            <a href={`/bills/${bill.id}`}
                              style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--text)', textDecoration: 'none', fontWeight: 600 }}>
                              Full Text <ChevronRight size={11} />
                            </a>
                          </div>
                       </div>
                    </div>
                 )
               })}
             </div>
          )}
        </div>
      </div>
    </div>
  )
}
