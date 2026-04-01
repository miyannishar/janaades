'use client'

import { useState, useEffect, useCallback } from 'react'
import { Newspaper, ExternalLink, RefreshCw, Clock, AlertTriangle, Activity } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import { fetchRecentActivities, fetchNewsArticles } from '@/lib/supabase'
import type { Activity as ActivityType } from '@/lib/supabase'

/* ═══════════════════════════════════════════════════
   Type styling helpers
═══════════════════════════════════════════════════ */
const TYPE_META: Record<string, { label: string; color: string; chipClass: string }> = {
  news:              { label: 'NEWS',        color: 'var(--blue)',    chipClass: 'chip-info' },
  bill_introduced:   { label: 'BILL',        color: 'var(--indigo)', chipClass: 'chip-indigo' },
  bill_passed:       { label: 'PASSED',      color: 'var(--emerald)',chipClass: 'chip-ok' },
  bill_failed:       { label: 'FAILED',      color: 'var(--crimson)',chipClass: 'chip-critical' },
  vote_held:         { label: 'VOTE',        color: 'var(--amber)',  chipClass: 'chip-warn' },
  misconduct:        { label: 'MISCONDUCT',  color: 'var(--crimson)',chipClass: 'chip-critical' },
  minister_action:   { label: 'MINISTER',    color: 'var(--amber)',  chipClass: 'chip-warn' },
  gazette_notice:    { label: 'GAZETTE',     color: 'var(--blue)',   chipClass: 'chip-info' },
  committee_meeting: { label: 'COMMITTEE',   color: 'var(--indigo)', chipClass: 'chip-indigo' },
  statement:         { label: 'STATEMENT',   color: 'var(--text-accent)', chipClass: 'chip-indigo' },
}

function getTypeMeta(type: string) {
  return TYPE_META[type] ?? { label: type.toUpperCase(), color: 'var(--text-muted)', chipClass: 'chip-muted' }
}

/* ═══════════════════════════════════════════════════
   News Article Card (with thumbnail)
═══════════════════════════════════════════════════ */
function NewsCard({ item }: { item: ActivityType }) {
  const meta = getTypeMeta(item.type)
  return (
    <a
      href={item.source_url ?? '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="card"
      style={{
        display: 'flex', gap: '1rem', padding: '1rem',
        textDecoration: 'none', cursor: 'pointer',
        borderLeft: `3px solid ${meta.color}`,
        transition: 'all 180ms ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateX(2px)'
        e.currentTarget.style.borderLeftColor = meta.color
      }}
      onMouseLeave={e => { e.currentTarget.style.transform = '' }}
    >
      {/* Thumbnail */}
      {item.image_url && (
        <div style={{
          width: 80, height: 80, flexShrink: 0,
          borderRadius: 8, overflow: 'hidden',
          background: 'var(--surface-4)',
        }}>
          <img
            src={item.image_url}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.375rem', flexWrap: 'wrap' }}>
          <span className={`chip ${meta.chipClass}`}>{meta.label}</span>
          {item.priority === 'high' && <span className="chip chip-warn">HIGH</span>}
          <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginLeft: 'auto', whiteSpace: 'nowrap' }}>
            <Clock size={9} style={{ display: 'inline', marginRight: 3 }} />
            {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
          </span>
        </div>

        <div style={{
          fontWeight: 700, fontSize: '0.875rem',
          color: 'var(--text-primary)',
          lineHeight: 1.4, marginBottom: '0.3rem',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {item.title}
        </div>

        {item.description && (
          <div style={{
            fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.55,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {item.description}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.375rem' }}>
          {item.ministry && (
            <span style={{ fontSize: '0.62rem', color: 'var(--text-accent)' }}>{item.ministry}</span>
          )}
          {item.source_url && (
            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 3 }}>
              <ExternalLink size={9} /> onlinekhabar.com
            </span>
          )}
        </div>
      </div>
    </a>
  )
}

/* ═══════════════════════════════════════════════════
   Generic Activity Row (non-news)
═══════════════════════════════════════════════════ */
function ActivityRow({ item }: { item: ActivityType }) {
  const meta = getTypeMeta(item.type)
  return (
    <div className="card" style={{
      display: 'flex', gap: '0.875rem', padding: '0.875rem 1rem',
      alignItems: 'flex-start',
      borderLeft: `2px solid ${meta.color}44`,
    }}>
      <div style={{
        width: 8, height: 8, borderRadius: '50%',
        background: meta.color,
        boxShadow: `0 0 8px ${meta.color}55`,
        flexShrink: 0, marginTop: 5,
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span className={`chip ${meta.chipClass}`}>{meta.label}</span>
          {item.ministry && <span className="chip chip-muted">{item.ministry}</span>}
          <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            {format(new Date(item.date), 'dd MMM · h:mm a')}
          </span>
        </div>
        <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: 1.35, marginBottom: '0.2rem' }}>
          {item.title}
        </div>
        {item.description && (
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {item.description.slice(0, 200)}
          </div>
        )}
      </div>
      {item.source_url && (
        <a href={item.source_url} target="_blank" rel="noopener noreferrer"
          style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
          <ExternalLink size={12} />
        </a>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   Filter tabs
═══════════════════════════════════════════════════ */
const TABS = [
  { value: 'all',   label: 'All Activity' },
  { value: 'news',  label: 'Political News' },
  { value: 'bills', label: 'Bills & Votes' },
]

/* ═══════════════════════════════════════════════════
   Main Page
═══════════════════════════════════════════════════ */
export default function ActivityPage() {
  const [tab, setTab]         = useState('all')
  const [items, setItems]     = useState<ActivityType[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage]       = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const PAGE_SIZE = 20

  const load = useCallback(async (reset = false) => {
    const nextPage = reset ? 0 : page
    if (!reset) setRefreshing(true)
    else setLoading(true)

    let data: ActivityType[] = []
    if (tab === 'news') {
      data = await fetchNewsArticles(PAGE_SIZE, nextPage * PAGE_SIZE)
    } else if (tab === 'bills') {
      const { supabase } = await import('@/lib/supabase')
      const { data: rows } = await supabase
        .from('activities')
        .select('*')
        .in('type', ['bill_introduced', 'bill_passed', 'bill_failed', 'vote_held', 'statement'])
        .order('date', { ascending: false })
        .range(nextPage * PAGE_SIZE, (nextPage + 1) * PAGE_SIZE - 1)
      data = (rows ?? []) as ActivityType[]
    } else {
      data = await fetchRecentActivities(PAGE_SIZE)
    }

    setHasMore(data.length === PAGE_SIZE)
    setItems(prev => reset ? data : [...prev, ...data])
    setPage(nextPage + (reset ? 0 : 1))
    setLoading(false)
    setRefreshing(false)
  }, [tab, page])

  // Reset on tab change
  useEffect(() => {
    setPage(0)
    setItems([])
    setHasMore(true)
    load(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  const newsItems  = items.filter(i => i.type === 'news')
  const otherItems = tab === 'all' ? items.filter(i => i.type !== 'news') : items

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="heading-xl">
            <span style={{ opacity: 0.35, marginRight: '0.5rem' }}>◈</span>
            Recent Activity
          </h1>
          <p className="text-secondary" style={{ fontSize: '0.78rem', marginTop: '0.3rem' }}>
            Live political news from OnlineKhabar · Parliamentary events · Bill movements
          </p>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.5rem 0.875rem',
            background: 'var(--surface-3)', border: '1px solid var(--border)',
            borderRadius: 8, color: 'var(--text-secondary)', fontSize: '0.75rem',
            cursor: 'pointer', transition: 'all 180ms ease',
          }}
        >
          <RefreshCw size={13} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      <div className="page-container">
        {/* Tab bar */}
        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.25rem' }}>
          {TABS.map(t => (
            <button key={t.value} onClick={() => setTab(t.value)}
              style={{
                padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600,
                border: 'none', cursor: 'pointer', transition: 'all 150ms ease',
                background: tab === t.value ? 'var(--indigo)' : 'var(--surface-3)',
                color: tab === t.value ? '#fff' : 'var(--text-secondary)',
              }}>
              {t.label}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
            {items.length} items
          </span>
        </div>

        {loading && (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card" style={{
                height: 90, background: 'var(--surface-3)',
                animation: 'pulse-skeleton 1.5s ease-in-out infinite',
                animationDelay: `${i * 0.1}s`,
              }} />
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Activity size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>No activity yet</div>
            <div style={{ fontSize: '0.75rem' }}>
              {tab === 'news'
                ? 'The news scraper will populate this section within the hour.'
                : 'No events recorded yet.'}
            </div>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div style={{ display: 'grid', gap: '0.625rem' }}>

            {/* News section header (in "all" tab) */}
            {tab === 'all' && newsItems.length > 0 && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <Newspaper size={13} style={{ color: 'var(--blue)' }} />
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Political News
                  </span>
                  <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                </div>
                {newsItems.map(item => <NewsCard key={item.id} item={item} />)}
              </>
            )}

            {/* News-only tab */}
            {tab === 'news' && items.map(item => <NewsCard key={item.id} item={item} />)}

            {/* Non-news / bills section */}
            {tab !== 'news' && otherItems.length > 0 && (
              <>
                {tab === 'all' && newsItems.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <AlertTriangle size={13} style={{ color: 'var(--amber)' }} />
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                      Parliamentary Events
                    </span>
                    <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                  </div>
                )}
                {otherItems.map(item => <ActivityRow key={item.id} item={item} />)}
              </>
            )}

            {/* Load more */}
            {hasMore && (
              <button
                onClick={() => load(false)}
                disabled={refreshing}
                style={{
                  marginTop: '0.5rem', padding: '0.75rem',
                  background: 'var(--surface-3)', border: '1px solid var(--border)',
                  borderRadius: 8, color: 'var(--text-secondary)', fontSize: '0.8rem',
                  cursor: 'pointer', width: '100%', fontWeight: 600,
                  transition: 'all 150ms',
                }}>
                {refreshing ? 'Loading…' : 'Load more'}
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse-skeleton {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
