'use client'

import { useState, useEffect } from 'react'
import { MOCK_ACTIVITIES, REAL_MPs } from '@/lib/nepal-data'
import { fetchRecentActivities } from '@/lib/supabase'
import type { Activity as ActivityType } from '@/lib/supabase'
import { TrendingUp, AlertTriangle, FileText, Users, ExternalLink, Zap, Newspaper } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'

/* ─── Chamber Composition Heatmap ──────────────────── */
function SeatHeatmap() {
  const seats = [
    ...Array(182).fill('rsp'),
    ...Array(46).fill('nc'),
    ...Array(29).fill('uml'),
    ...Array(18).fill('other'),
  ]

  const parties = [
    { label: 'RSP · राष्ट्रिय स्वतन्त्र पार्टी', seats: 182, cls: 'heatmap-rsp', pct: '66.2%', color: 'var(--rsp)' },
    { label: 'NC · नेपाली कांग्रेस', seats: 46, cls: 'heatmap-nc', pct: '16.7%', color: 'var(--nc)' },
    { label: 'UML · एमाले', seats: 29, cls: 'heatmap-uml', pct: '10.5%', color: 'var(--uml)' },
    { label: 'Others', seats: 18, cls: 'heatmap-other', pct: '6.5%', color: 'var(--surface-5)' },
  ]

  return (
    <div>
      {/* Party legend */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {parties.map(p => (
          <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.68rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: 3, background: p.color, boxShadow: `0 0 6px ${p.color}44`, flexShrink: 0 }} />
            <span style={{ color: 'var(--text-secondary)' }}>{p.label}</span>
            <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{p.seats}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.62rem' }}>({p.pct})</span>
          </div>
        ))}
      </div>

      {/* Heatmap grid */}
      <div className="heatmap-grid">
        {seats.map((party, i) => (
          <div key={i} className={`heatmap-cell heatmap-${party}`}
            title={`Seat ${i + 1} — ${party.toUpperCase()}`} />
        ))}
      </div>

      {/* Proportional bar */}
      <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{ flex: 1, height: 6, borderRadius: 99, display: 'flex', overflow: 'hidden', gap: 1 }}>
          {parties.map(p => (
            <div key={p.label} style={{
              width: p.pct,
              background: `linear-gradient(90deg, ${p.color}, ${p.color}cc)`,
              transition: 'width 600ms cubic-bezier(0.4, 0, 0.2, 1)',
            }} />
          ))}
        </div>
        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>275 seats</span>
      </div>
    </div>
  )
}

/* ─── High-priority live activity feed ───────────────── */
function PriorityFeed() {
  const [items, setItems] = useState<ActivityType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    import('@/lib/supabase').then(({ supabase }) => {
      supabase
        .from('activities')
        .select('*')
        .eq('priority', 'high')
        .order('date', { ascending: false })
        .limit(6)
        .then(({ data }) => {
          setItems((data ?? []) as ActivityType[])
          setLoading(false)
        })
    })
  }, [])

  const typeColor: Record<string, string> = {
    news:            'var(--blue)',
    bill_introduced: 'var(--indigo)',
    bill_passed:     'var(--emerald)',
    bill_failed:     'var(--crimson)',
    vote_held:       'var(--amber)',
    misconduct:      'var(--crimson)',
    minister_action: 'var(--amber)',
    social:          'var(--indigo)',
    gazette_notice:  'var(--blue)',
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{
            height: 52, borderRadius: 8,
            background: 'var(--surface-3)',
            animation: 'pulse-skeleton 1.5s ease-in-out infinite',
            animationDelay: `${i * 0.1}s`,
          }} />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
        <Newspaper size={20} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
        No high-priority events yet
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
      {items.map(a => {
        const color = typeColor[a.type] || 'var(--text-muted)'
        return (
          <div
            key={a.id}
            onClick={() => a.source_url && window.open(a.source_url, '_blank')}
            style={{
              display: 'flex', gap: '0.6rem', alignItems: 'flex-start',
              padding: '0.6rem 0.75rem', borderRadius: 8,
              borderLeft: `2px solid ${color}`,
              background: 'rgba(255,255,255,0.015)',
              cursor: a.source_url ? 'pointer' : 'default',
              transition: 'background 150ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-3)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.015)')}
          >
            <Zap size={11} style={{ color, flexShrink: 0, marginTop: 3 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)',
                lineHeight: 1.35, marginBottom: '0.15rem',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{a.title}</div>
              <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>
                {formatDistanceToNow(new Date(a.date), { addSuffix: true })}
                {a.ministry && <span style={{ color: 'var(--text-accent)', marginLeft: '0.35rem' }}>· {a.ministry}</span>}
              </div>
            </div>
          </div>
        )
      })}
      <style>{`@keyframes pulse-skeleton { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  )
}

/* ─── Party Breakdown Panel ───────────────────────────── */
function PartyBreakdown() {
  const partyData = [
    { short: 'RSP',    full: 'Rastriya Swatantra Party',   seats: 182, color: 'var(--rsp)' },
    { short: 'NC',     full: 'Nepali Congress',             seats: 46,  color: 'var(--nc)' },
    { short: 'UML',    full: 'CPN-UML',                     seats: 29,  color: 'var(--uml)' },
    { short: 'MAOIST', full: 'CPN (Maoist Centre)',         seats: 11,  color: '#e05c5c' },
    { short: 'RPP',    full: 'Rastriya Prajatantra Party',  seats: 7,   color: '#c084fc' },
  ]
  const total = 275
  const female = REAL_MPs.filter(m => m.gender === 'Female').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {partyData.map(p => (
        <div key={p.short} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
            background: p.color, boxShadow: `0 0 5px ${p.color}55`,
          }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)' }}>{p.short}</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: p.color, fontVariantNumeric: 'tabular-nums' }}>{p.seats}</span>
            </div>
            <div style={{ height: 4, borderRadius: 99, background: 'var(--surface-4)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 99,
                width: `${(p.seats / total) * 100}%`,
                background: `linear-gradient(90deg, ${p.color}, ${p.color}aa)`,
                transition: 'width 600ms ease',
              }} />
            </div>
          </div>
          <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', width: 36, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
            {((p.seats / total) * 100).toFixed(1)}%
          </span>
        </div>
      ))}

      <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <div className="section-label">Women MPs</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--emerald)', fontVariantNumeric: 'tabular-nums' }}>
            {female}
            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: 4 }}>
              ({((female / total) * 100).toFixed(1)}%)
            </span>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div className="section-label">Supermajority</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--rsp)', fontVariantNumeric: 'tabular-nums' }}>
            66.2%
            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: 4 }}>RSP</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Legislative Pulse (Activity Feed) ──────────────── */
function ActivityFeed() {
  const [items, setItems] = useState<ActivityType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentActivities(8).then(data => {
      setItems(data)
      setLoading(false)
    })
  }, [])

  const typeColor: Record<string, string> = {
    news:            'var(--blue)',
    bill_introduced: 'var(--indigo)',
    bill_passed:     'var(--emerald)',
    bill_failed:     'var(--crimson)',
    vote_held:       'var(--amber)',
    misconduct:      'var(--crimson)',
    minister_action: 'var(--amber)',
    gazette_notice:  'var(--blue)',
  }

  const displayItems = (loading || items.length === 0)
    ? MOCK_ACTIVITIES.slice(0, 8) as unknown as ActivityType[]
    : items

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      {displayItems.map(a => {
        const color = typeColor[a.type] || 'var(--text-muted)'
        return (
          <div key={a.id}
            style={{
              display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
              padding: '0.6rem 0.75rem',
              borderRadius: 8,
              background: a.type === 'news' ? 'var(--surface-2)' : 'rgba(255,255,255,0.01)',
              transition: 'all 150ms ease',
              cursor: a.source_url ? 'pointer' : 'default',
            }}
            onClick={() => a.source_url && window.open(a.source_url, '_blank')}
          >
            {/* Thumbnail for news */}
            {a.type === 'news' && (a as any).image_url ? (
              <img
                src={(a as any).image_url}
                alt=""
                style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            ) : (
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: color,
                boxShadow: `0 0 8px ${color}44`,
                flexShrink: 0, marginTop: '0.4rem',
              }} />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '0.78rem', fontWeight: 600,
                color: 'var(--text-primary)', lineHeight: 1.35, marginBottom: '0.15rem',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{a.title}</div>
              <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                <span>{format(new Date(a.date), 'dd MMM · h:mm a')}</span>
                {a.ministry && <><span style={{ opacity: 0.4 }}>·</span><span style={{ color: 'var(--text-accent)' }}>{a.ministry}</span></>}
                {a.type === 'news' && <span style={{ color, marginLeft: 'auto' }}>NEWS</span>}
              </div>
            </div>
          </div>
        )
      })}
      {loading && items.length === 0 && (
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0.5rem' }}>
          Loading live activity…
        </div>
      )}
    </div>
  )
}

/* ─── Dashboard Page ─────────────────────────────────── */
export default function DashboardPage() {
  const [newsToday, setNewsToday] = useState(0)

  useEffect(() => {
    import('@/lib/supabase').then(({ supabase }) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      supabase
        .from('activities')
        .select('id', { count: 'exact', head: true })
        .eq('type', 'news')
        .gte('date', today.toISOString())
        .then(({ count }) => setNewsToday(count ?? 0))
    })
  }, [])

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="heading-xl">
            <span style={{ opacity: 0.4, marginRight: '0.5rem' }}>◆</span>
            जनादेश Dashboard
          </h1>
          <p className="text-secondary" style={{ fontSize: '0.78rem', marginTop: '0.3rem' }}>
            Nepal Pratinidhi Sabha · 2083 B.S. Session · RSP Supermajority Parliament
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <span className="chip chip-ok" style={{ gap: '0.4rem' }}>
            <span className="dot dot-live" />
            LIVE
          </span>
          <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
            Updated {format(new Date(), 'HH:mm')}
          </span>
        </div>
      </div>

      <div className="page-container">
        {/* Hero Stats */}
        <div className="dashboard-hero-grid stagger"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.75rem' }}>
          {[
            {
              number: '275', label: 'Total Seats', delta: 'Pratinidhi Sabha', type: 'info',
              accentColor: 'var(--indigo)', icon: <Users size={16} />,
            },
            {
              number: '182', label: 'RSP Seats', delta: '↑ Supermajority · 66.2%', type: 'up',
              accentColor: 'var(--rsp)', icon: <TrendingUp size={16} />,
            },
            {
              number: String(newsToday || '—'), label: 'News Today', delta: 'live from OnlineKhabar', type: 'info',
              accentColor: 'var(--blue)', icon: <FileText size={16} />,
            },
            {
              number: '47', label: 'Bills Tracked', delta: '8 passed this session', type: 'up',
              accentColor: 'var(--amber)', icon: <FileText size={16} />,
            },
          ].map(s => (
            <div key={s.label} className="stat-card animate-fade-up" style={{ '--accent-color': s.accentColor } as React.CSSProperties}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div className="section-label">{s.label}</div>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: `${s.accentColor}0a`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: s.accentColor, opacity: 0.6,
                }}>
                  {s.icon}
                </div>
              </div>
              <div className="stat-number" style={{ color: s.accentColor }}>{s.number}</div>
              <div className={`stat-delta ${s.type}`}>{s.delta}</div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="dashboard-main-grid"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 360px', gap: '1rem', marginBottom: '1.25rem' }}>

          {/* Left: Chamber Composition */}
          <div className="card animate-fade-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <div className="section-label">Chamber Composition</div>
                <div className="heading-sm" style={{ marginTop: '0.3rem' }}>Pratinidhi Sabha Heatmap</div>
              </div>
              <span className="chip chip-indigo">2083 B.S.</span>
            </div>
            <SeatHeatmap />
          </div>

          {/* Center: High-priority live events */}
          <div className="card animate-fade-up" style={{ animationDelay: '70ms' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <div className="section-label">Priority Events</div>
                <div className="heading-sm" style={{ marginTop: '0.3rem' }}>High-Priority Activity</div>
              </div>
              <span className="chip chip-warn" style={{ gap: '0.4rem' }}>
                <span className="dot dot-warn" />
                HIGH
              </span>
            </div>
            <PriorityFeed />
          </div>

          {/* Right: Party Breakdown */}
          <div className="card dashboard-right-col animate-fade-up" style={{ animationDelay: '140ms' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <div className="section-label">Parliament Makeup</div>
                <div className="heading-sm" style={{ marginTop: '0.3rem' }}>Party Breakdown</div>
              </div>
              <span className="chip chip-ok">
                {REAL_MPs.length} MPs
              </span>
            </div>
            <PartyBreakdown />
          </div>
        </div>

        {/* Bottom row */}
        <div className="dashboard-bottom-grid"
          style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1rem' }}>

          {/* Legislative Pulse */}
          <div className="card animate-fade-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <div className="section-label">Legislative Pulse</div>
                <div className="heading-sm" style={{ marginTop: '0.3rem' }}>Recent Activity</div>
              </div>
              <a href="/activity" className="btn-ghost" style={{ fontSize: '0.72rem', padding: '0.3rem 0.625rem' }}>
                View all <ExternalLink size={11} />
              </a>
            </div>
            <ActivityFeed />
          </div>

          {/* Quick stats + AI analysis */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="card animate-fade-up">
              <div className="section-label" style={{ marginBottom: '0.875rem' }}>Parliament Stats</div>
              {[
                { label: 'Speaker', value: 'Indira Rana', color: 'var(--text-primary)' },
                { label: 'Cabinet Ministers', value: '17', color: 'var(--amber)' },
                { label: 'Session', value: 'Monsoon 2083', color: 'var(--text-primary)' },
                { label: 'Bills This Session', value: '23', color: 'var(--emerald)' },
                { label: 'Avg Attendance', value: '81.2%', color: 'var(--indigo)' },
                { label: 'Women MPs', value: '91 (33.1%)', color: 'var(--text-accent)' },
              ].map(s => (
                <div key={s.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.55rem 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.02)',
                  fontSize: '0.78rem',
                }}>
                  <span style={{ color: 'var(--text-muted)' }}>{s.label}</span>
                  <span style={{ fontWeight: 700, color: s.color, fontVariantNumeric: 'tabular-nums' }}>{s.value}</span>
                </div>
              ))}
            </div>

            {/* AI Analysis Glass Card */}
            <div className="card card-indigo animate-fade-up" style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.04), rgba(139, 92, 246, 0.02))',
            }}>
              <div className="section-label" style={{ marginBottom: '0.625rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.8rem' }}>◇</span>
                AI Analysis
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                RSP's supermajority enables single-party legislation.
                Early indicators show focus on <strong style={{ color: 'var(--text-primary)' }}>anti-corruption</strong> and
                <strong style={{ color: 'var(--text-primary)' }}> digital governance</strong> reforms.
                Accountability monitoring at full capacity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
