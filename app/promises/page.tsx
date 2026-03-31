'use client'

import { useEffect, useState, useMemo } from 'react'
import { CheckSquare, Circle, Clock, XCircle, CheckCircle2, AlertCircle, Filter, Search } from 'lucide-react'

type Promise = {
  id: string
  category: string
  title: string
  description: string
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed' | 'Cancelled'
}

const STATUS_CONFIG = {
  'Not Started': { color: 'var(--on-surface-variant)', bg: 'var(--surface-container-high)', icon: Circle },
  'In Progress': { color: 'var(--amber)',              bg: 'var(--amber-soft)',              icon: Clock },
  'Completed':   { color: 'var(--emerald)',            bg: 'var(--emerald-soft)',            icon: CheckCircle2 },
  'Delayed':     { color: 'var(--primary)',            bg: 'var(--crimson-soft)',            icon: AlertCircle },
  'Cancelled':   { color: 'var(--outline)',            bg: 'var(--surface-container)',       icon: XCircle },
} as const

const CATEGORY_COLORS: Record<string, string> = {
  'National Unity & Governance':    '#6366f1',
  'Public Administration Reform':   '#8b5cf6',
  'Citizen Services':               '#06b6d4',
  'Digital Governance':             '#3b82f6',
  'Anti-Corruption & Good Governance': '#ef4444',
  'Economy & Investment':           '#f59e0b',
  'Infrastructure & Energy':        '#10b981',
  'Education & Health':             '#ec4899',
  'Agriculture & Environment':      '#22c55e',
  'Land Reform & Public Assets':    '#f97316',
  'Security & Strategic Affairs':   '#64748b',
}

export default function PromisesPage() {
  const [promises, setPromises] = useState<Promise[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [activeStatus, setActiveStatus] = useState<string>('All')

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/promises?select=*&order=id.asc`
    fetch(url, {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
      },
    })
      .then(r => r.json())
      .then(data => { setPromises(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const categories = useMemo(() => ['All', ...Array.from(new Set(promises.map(p => p.category)))], [promises])
  const statuses = ['All', 'Not Started', 'In Progress', 'Completed', 'Delayed', 'Cancelled']

  const filtered = useMemo(() => promises.filter(p => {
    const matchCat    = activeCategory === 'All' || p.category === activeCategory
    const matchStatus = activeStatus === 'All'   || p.status   === activeStatus
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchStatus && matchSearch
  }), [promises, activeCategory, activeStatus, search])

  // Stats
  const stats = useMemo(() => {
    const total       = promises.length
    const completed   = promises.filter(p => p.status === 'Completed').length
    const inProgress  = promises.filter(p => p.status === 'In Progress').length
    const delayed     = promises.filter(p => p.status === 'Delayed').length
    const notStarted  = promises.filter(p => p.status === 'Not Started').length
    const pct = total ? Math.round((completed / total) * 100) : 0
    return { total, completed, inProgress, delayed, notStarted, pct }
  }, [promises])

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }} className="animate-fade-in">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <h1 className="display-md" style={{ marginBottom: '0.25rem' }}>
              १०० बुँदे वाचा — 100-Point Promises
            </h1>
            <p className="body-lg">
              Tracking the RSP government's 100-point governance roadmap. Updated manually as promises are completed.
            </p>
          </div>
          {/* Progress ring */}
          <div style={{
            background: 'var(--surface-container)', borderRadius: '1rem', padding: '1rem 1.5rem',
            border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--emerald)', lineHeight: 1 }}>
                {stats.pct}%
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--on-surface-variant)', fontWeight: 600, letterSpacing: '0.06em' }}>
                DELIVERED
              </div>
            </div>
            <div style={{ width: '1px', height: '2.5rem', background: 'var(--border)' }} />
            <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', lineHeight: 2 }}>
              <div><span style={{ color: 'var(--emerald)', fontWeight: 700 }}>{stats.completed}</span> Completed</div>
              <div><span style={{ color: 'var(--amber)', fontWeight: 700 }}>{stats.inProgress}</span> In Progress</div>
              <div><span style={{ color: 'var(--on-surface-variant)', fontWeight: 700 }}>{stats.notStarted}</span> Not Started</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: '1.5rem', background: 'var(--surface-container)', borderRadius: '0.5rem', padding: '1rem 1.25rem', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
          <span style={{ fontWeight: 600 }}>Overall Progress</span>
          <span>{stats.completed} of {stats.total} promises completed</span>
        </div>
        <div style={{ height: '8px', background: 'var(--surface-container-high)', borderRadius: '99px', overflow: 'hidden' }}>
          <div style={{ width: `${stats.pct}%`, height: '100%', background: 'linear-gradient(90deg, var(--emerald), #34d399)', borderRadius: '99px', transition: 'width 0.6s ease' }} />
        </div>
        {/* mini bars */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          {(['Completed','In Progress','Delayed','Not Started'] as const).map(s => {
            const count = promises.filter(p => p.status === s).length
            const cfg = STATUS_CONFIG[s]
            const Icon = cfg.icon
            return (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.7rem', color: cfg.color }}>
                <Icon size={11} />
                <span style={{ fontWeight: 600 }}>{count}</span>
                <span style={{ color: 'var(--on-surface-variant)' }}>{s}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
          <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--on-surface-variant)' }} />
          <input
            type="text"
            placeholder="Search promises..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', paddingLeft: '2.25rem', paddingRight: '0.75rem', paddingTop: '0.5rem', paddingBottom: '0.5rem',
              background: 'var(--surface-container)', border: '1px solid var(--border)', borderRadius: '0.5rem',
              color: 'var(--on-surface)', fontSize: '0.8125rem', outline: 'none',
            }}
          />
        </div>
        {/* Status filter */}
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          {statuses.map(s => {
            const active = activeStatus === s
            const cfg = s !== 'All' ? STATUS_CONFIG[s as keyof typeof STATUS_CONFIG] : null
            return (
              <button
                key={s}
                onClick={() => setActiveStatus(s)}
                style={{
                  padding: '0.375rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                  border: active ? '1px solid currentColor' : '1px solid var(--border)',
                  background: active ? (cfg ? cfg.bg : 'var(--indigo-soft)') : 'var(--surface-container)',
                  color: active ? (cfg ? cfg.color : 'var(--indigo)') : 'var(--on-surface-variant)',
                  transition: 'all 0.15s',
                }}
              >
                {s}
              </button>
            )
          })}
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {categories.map(cat => {
          const active = activeCategory === cat
          const color = CATEGORY_COLORS[cat] || 'var(--indigo)'
          const count = cat === 'All' ? promises.length : promises.filter(p => p.category === cat).length
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.375rem 0.875rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600,
                whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0,
                border: active ? `1px solid ${color}44` : '1px solid var(--border)',
                background: active ? `${color}18` : 'var(--surface-container)',
                color: active ? color : 'var(--on-surface-variant)',
                transition: 'all 0.15s',
              }}
            >
              {cat === 'All' ? 'All Categories' : cat} <span style={{ opacity: 0.7 }}>({count})</span>
            </button>
          )
        })}
      </div>

      {/* Result count */}
      <div style={{ marginBottom: '1rem', fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
        Showing <strong style={{ color: 'var(--on-surface)' }}>{filtered.length}</strong> of {promises.length} promises
      </div>

      {/* Cards grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--on-surface-variant)' }}>
          <div className="dot dot-live" style={{ margin: '0 auto 1rem' }} />
          Loading promises...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
          {filtered.map(p => {
            const cfg = STATUS_CONFIG[p.status]
            const StatusIcon = cfg.icon
            const catColor = CATEGORY_COLORS[p.category] || 'var(--indigo)'
            return (
              <div
                key={p.id}
                className="card animate-fade-in"
                style={{ padding: '1.125rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}
              >
                {/* Top row: ID + status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 800, color: catColor, background: `${catColor}18`,
                    padding: '0.2rem 0.5rem', borderRadius: '4px', letterSpacing: '0.04em'
                  }}>#{p.id}</span>

                  <span style={{
                    display: 'flex', alignItems: 'center', gap: '0.3rem',
                    fontSize: '0.7rem', fontWeight: 700, color: cfg.color,
                    background: cfg.bg, padding: '0.25rem 0.6rem', borderRadius: '4px',
                  }}>
                    <StatusIcon size={11} />
                    {p.status}
                  </span>
                </div>

                {/* Category tag */}
                <div style={{
                  fontSize: '0.65rem', fontWeight: 600, color: catColor,
                  display: 'flex', alignItems: 'center', gap: '0.25rem'
                }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: catColor, flexShrink: 0 }} />
                  {p.category}
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--on-surface)', lineHeight: 1.4, margin: 0 }}>
                  {p.title}
                </h3>

                {/* Description */}
                {p.description && p.description !== p.title && (
                  <p style={{ fontSize: '0.775rem', color: 'var(--on-surface-variant)', lineHeight: 1.5, margin: 0 }}>
                    {p.description}
                  </p>
                )}
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--on-surface-variant)' }}>
              <Filter size={32} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <div>No promises match your current filters.</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
