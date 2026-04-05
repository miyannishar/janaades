'use client'

import { useState, useEffect } from 'react'
import { REAL_MPs } from '@/lib/nepal-data'
import { fetchRecentActivities } from '@/lib/supabase'
import type { Activity as ActivityType } from '@/lib/supabase'
import { format, formatDistanceToNow } from 'date-fns'
import { PageHeader } from '@/components/organisms/PageHeader'

function SeatHeatmap() {
  const seats = [
    ...Array(182).fill('rsp'),
    ...Array(46).fill('nc'),
    ...Array(29).fill('uml'),
    ...Array(18).fill('other'),
  ]

  const parties = [
    { label: 'RSP', count: 182, color: 'var(--rsp)' },
    { label: 'NC', count: 46, color: 'var(--nc)' },
    { label: 'UML', count: 29, color: 'var(--uml)' },
    { label: 'Other', count: 18, color: 'var(--surface-4)' },
  ]

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div className="heatmap-grid" style={{ marginBottom: '1rem' }}>
        {seats.map((party, i) => (
          <div key={i} className={`heatmap-cell heatmap-${party}`} title={`Seat ${i + 1} — ${party.toUpperCase()}`} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {parties.map(p => (
           <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}>
              <div style={{ width: 8, height: 8, background: p.color }} />
              <span style={{ fontWeight: 600 }}>{p.label}</span>
              <span className="text-muted">{p.count}</span>
           </div>
        ))}
      </div>
    </div>
  )
}

function LedgerFeed() {
  const [items, setItems] = useState<ActivityType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentActivities(25).then(data => {
      setItems(data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Loading records...</div>
  }

  return (
    <div className="ledger-container">
      <div className="ledger-header">
        <h3 className="heading-md">Chronological Activity Log</h3>
        <span className="text-muted" style={{ fontSize: '0.75rem' }}>Showing last 25 entries</span>
      </div>
      <div>
        {items.map(a => {
          let badgeLabel = 'UPDATE'
          let badgeClass = 'chip'
          if (a.type === 'news') { badgeLabel = 'NEWS'; }
          else if (a.type.includes('bill')) { badgeLabel = 'BILL'; badgeClass = 'chip chip-ok'; }
          else if (a.type === 'vote_held') { badgeLabel = 'VOTE'; badgeClass = 'chip chip-warn'; }
          else if (a.priority === 'high') { badgeLabel = 'ALERT'; badgeClass = 'chip chip-warn'; }

          return (
            <div key={a.id} className="feed-row" onClick={() => a.source_url && window.open(a.source_url, '_blank')} style={{ cursor: a.source_url ? 'pointer' : 'default' }}>
              <div className="feed-time">
                 {format(new Date(a.date), 'MMM d')}<br/>
                 <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>{format(new Date(a.date), 'h:mm a')}</span>
              </div>
              <div style={{ width: '60px', flexShrink: 0 }}>
                 <span className={badgeClass}>{badgeLabel}</span>
              </div>
              <div className="feed-content">
                <div className="feed-title">{a.title}</div>
                <div className="feed-meta">
                  {a.ministry && <span>{a.ministry} • </span>}
                  {formatDistanceToNow(new Date(a.date), { addSuffix: true })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}


export default function DashboardPage() {
  const female = REAL_MPs.filter(m => m.gender === 'Female').length
  const total = 275

  return (
    <div className="page-container animate-fade-up">
      <PageHeader
        label="The National Ledger"
        title="Parliamentary Intelligence"
        subtitle="Pratinidhi Sabha"
        meta={format(new Date(), 'EEEE, MMMM do, yyyy')}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '3rem' }}>
        {/* Left Column: Ledger Feed */}
        <div>
           <LedgerFeed />
        </div>

        {/* Right Column: Demographics and Stats */}
        <div>
           <h3 className="heading-md" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Chamber Composition</h3>
           <SeatHeatmap />

           <div style={{ marginTop: '2rem' }}>
             <h3 className="heading-md" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Demographics & Metrics</h3>
             <table className="data-table">
               <tbody>
                 <tr>
                   <td style={{ padding: '0.5rem 0', fontWeight: 600 }}>Total Seats</td>
                   <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>{total}</td>
                 </tr>
                 <tr>
                   <td style={{ padding: '0.5rem 0', fontWeight: 600 }}>Supermajority</td>
                   <td style={{ padding: '0.5rem 0', textAlign: 'right', color: 'var(--rsp)' }}>66.2% (RSP)</td>
                 </tr>
                 <tr>
                   <td style={{ padding: '0.5rem 0', fontWeight: 600 }}>Women MPs</td>
                   <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>{female} ({(female / total * 100).toFixed(1)}%)</td>
                 </tr>
                 <tr>
                   <td style={{ padding: '0.5rem 0', fontWeight: 600 }}>Cabinet Size</td>
                   <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>17 Ministers</td>
                 </tr>
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  )
}
