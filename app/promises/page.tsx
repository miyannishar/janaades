'use client'

import { useEffect, useState, useMemo } from 'react'
import { PageHeader } from '@/components/organisms/PageHeader'

type Promise = {
  id: string
  category: string
  title: string
  description: string
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed' | 'Cancelled'
}

export default function PromisesPage() {
  const [promises, setPromises] = useState<Promise[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [activeStatus, setActiveStatus] = useState<string>('All')

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/promises?select=*&order=id.asc`, {
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

  const stats = useMemo(() => {
    const total       = promises.length || 1
    const completed   = promises.filter(p => p.status === 'Completed').length
    const pct = Math.round((completed / total) * 100)
    return { total: promises.length, completed, pct }
  }, [promises])

  return (
    <div className="page-container animate-fade-up">
      <PageHeader 
        label="Government Accountability" 
        title="100-Point Manifesto" 
        subtitle="Performance Tracking" 
        meta={`${stats.pct}% Delivered`} 
      />

      <div className="promises-filter-row" style={{ display: 'flex', gap: '1rem', marginTop: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
         <input 
            type="text" 
            placeholder="Search promises..." 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '0.5rem', border: '1px solid var(--border)', fontSize: '0.875rem' }} 
         />
         <div style={{ display: 'flex', gap: '0.25rem' }}>
            {statuses.map(s => (
               <button key={s} onClick={() => setActiveStatus(s)} style={{
                  padding: '0.35rem 0.6rem', fontSize: '0.75rem',
                  background: activeStatus === s ? 'var(--text)' : 'transparent',
                  color: activeStatus === s ? 'var(--bg)' : 'var(--text)',
                  border: '1px solid var(--border)', cursor: 'pointer'
               }}>
                  {s}
               </button>
            ))}
         </div>
      </div>

      <div className="sidebar-grid">
        <div>
          <h3 className="heading-sm" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Categories</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {categories.map(cat => (
              <li key={cat}>
                <button
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left', padding: '0.4rem 0',
                    fontSize: '0.85rem', cursor: 'pointer', background: 'none', border: 'none',
                    color: activeCategory === cat ? 'var(--text)' : 'var(--text-muted)',
                    fontWeight: activeCategory === cat ? 600 : 400
                  }}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="ledger-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>ID</th>
                <th>Status</th>
                <th>Task Details</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={3} style={{ textAlign: 'center', padding: '2rem' }}>Loading ledger...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={3} style={{ textAlign: 'center', padding: '2rem' }}>No records match the current view.</td></tr>
              ) : (
                filtered.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>#{p.id}</td>
                    <td>
                      <span className={`chip ${p.status === 'Completed' ? 'chip-ok' : p.status === 'Delayed' ? 'chip-error' : p.status === 'In Progress' ? 'chip-warn' : ''}`}>
                        {p.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{p.title}</div>
                      <div className="text-muted" style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>{p.description}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
