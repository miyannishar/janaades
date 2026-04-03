'use client'

import { useEffect, useState } from 'react'

interface TickerItem {
  label: string
  text: string
  type: 'news' | 'bill' | 'vote' | 'misc'
}

export default function LiveTicker() {
  const [items, setItems] = useState<TickerItem[]>([
    { label: 'LIVE', text: 'Nepal Pratinidhi Sabha — Monsoon Session 2083 B.S. in progress', type: 'misc' },
    { label: 'SESSION', text: 'RSP supermajority parliament · 275 elected members · 182 RSP seats', type: 'misc' },
  ])

  useEffect(() => {
    import('@/lib/supabase').then(({ supabase }) => {
      supabase
        .from('activities')
        .select('type, title, priority, date')
        .order('date', { ascending: false })
        .limit(8)
        .then(({ data }) => {
          if (!data || data.length === 0) return
          const mapped: TickerItem[] = data.map(a => ({
            label:
              a.type === 'news'            ? 'NEWS'    :
              a.type === 'bill_introduced' ? 'BILL'    :
              a.type === 'bill_passed'     ? 'PASSED'  :
              a.type === 'bill_failed'     ? 'FAILED'  :
              a.type === 'vote_held'       ? 'VOTE'    :
              a.type === 'social'          ? 'SOCIAL'  :
              a.priority === 'high'        ? 'ALERT'   : 'UPDATE',
            text: a.title,
            type:
              a.type.includes('bill') ? 'bill' :
              a.type === 'vote_held'  ? 'vote'  :
              a.priority === 'high'   ? 'misc'  : 'news',
          }))
          setItems(mapped)
        })
    })
  }, [])

  const doubled = [...items, ...items]

  const labelStyle = (item: TickerItem) => ({
    fontSize: '0.6rem' as const,
    fontWeight: 800 as const,
    letterSpacing: '0.08em' as const,
    padding: '1px 5px',
    borderRadius: '3px',
    background:
      item.label === 'ALERT' || item.label === 'FAILED' ? 'var(--crimson-soft)' :
      item.label === 'BILL'  || item.label === 'PASSED' ? 'var(--emerald-soft)' :
      item.label === 'VOTE'                             ? 'var(--amber-soft)'   :
      'var(--indigo-soft)',
    color:
      item.label === 'ALERT' || item.label === 'FAILED' ? 'var(--crimson)' :
      item.label === 'BILL'  || item.label === 'PASSED' ? 'var(--emerald)' :
      item.label === 'VOTE'                             ? 'var(--amber)'   :
      'var(--text-accent)',
  })

  return (
    <div className="ticker-bar">
      <div className="ticker-label">
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: 'var(--crimson)',
          display: 'inline-block',
          boxShadow: '0 0 6px var(--crimson)',
          animation: 'pulse-sovereign 2s ease-in-out infinite',
        }} />
        LIVE
      </div>
      <div style={{ overflow: 'hidden', flex: 1 }}>
        <div className="ticker-track">
          {doubled.map((item, i) => (
            <span key={i} className="ticker-item">
              <span style={labelStyle(item)}>{item.label}</span>
              <strong style={{ color: 'var(--text-primary)' }}>{item.text}</strong>
              <span style={{ color: 'var(--text-muted)', margin: '0 0.5rem' }}>·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
