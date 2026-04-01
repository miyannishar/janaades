'use client'

import { useState, useEffect } from 'react'
import { Cpu, Server, Database, Globe, RefreshCcw, CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

type JobStatus = 'operational' | 'warning' | 'error'

type ScrapingJob = {
  name: string
  url: string
  status: JobStatus
  lastRun: string
  nextRun: string
  itemsFound: number
}

type HealthData = {
  status: string
  services: {
    database: string
    scraper: string
    facebook: string
  }
  last_scrape?: string
  activity_count?: number
  jobs?: ScrapingJob[]
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

export default function SystemPage() {
  const [health, setHealth] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date>(new Date())

  const fetchHealth = async () => {
    try {
      setLoading(true)
      setError(false)
      const res = await fetch(`${BACKEND_URL}/health`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Health check failed')
      const data = await res.json()
      setHealth(data)
      setLastChecked(new Date())
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHealth()
    const interval = setInterval(fetchHealth, 30_000)
    return () => clearInterval(interval)
  }, [])

  const serviceStatus = (svc: string | undefined): JobStatus => {
    if (!svc) return 'error'
    if (svc === 'healthy' || svc === 'connected' || svc === 'ok') return 'operational'
    if (svc === 'degraded' || svc === 'slow') return 'warning'
    return 'error'
  }

  const statusIcon = (s: JobStatus) => {
    if (s === 'operational') return <CheckCircle2 size={16} style={{ color: 'var(--emerald)' }} />
    if (s === 'warning')     return <AlertTriangle size={16} style={{ color: 'var(--amber)' }} />
    return <XCircle size={16} style={{ color: 'var(--crimson)' }} />
  }

  const statusChip = (s: JobStatus) => {
    const map: Record<JobStatus, string> = {
      operational: 'chip chip-ok',
      warning:     'chip chip-warn',
      error:       'chip chip-critical',
    }
    return map[s]
  }

  const overallStatus: JobStatus = error ? 'error'
    : !health ? 'warning'
    : (health.services?.database === 'connected' && health.status === 'ok') ? 'operational'
    : 'warning'

  const services = health ? [
    { name: 'Database (Supabase)', key: serviceStatus(health.services?.database), icon: <Database size={18} /> },
    { name: 'News Scraper',        key: serviceStatus(health.services?.scraper),  icon: <Globe size={18} /> },
    { name: 'Facebook Monitor',    key: serviceStatus(health.services?.facebook), icon: <Server size={18} /> },
  ] : []

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem' }} className="animate-fade-in">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h1 className="display-md" style={{ marginBottom: '0.25rem' }}>System Status</h1>
            <p className="body-lg">Live health of scraping, indexing, and backend services.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              Checked {formatDistanceToNow(lastChecked, { addSuffix: true })}
            </span>
            <button
              className="btn-ghost"
              onClick={fetchHealth}
              disabled={loading}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
            >
              <RefreshCcw size={13} style={{ marginRight: '0.35rem', display: 'inline', opacity: loading ? 0.5 : 1 }} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Overall status banner */}
      <div className={`card ${overallStatus === 'operational' ? 'card-ok' : overallStatus === 'warning' ? 'card-warn' : 'card-alert'}`}
        style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        {statusIcon(overallStatus)}
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
            {overallStatus === 'operational' ? 'All Systems Operational'
              : overallStatus === 'warning' ? 'Partial Degradation Detected'
              : 'Service Unreachable'}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
            {error ? `Cannot reach backend at ${BACKEND_URL}` : 'जनादेश Monitor backend · live monitoring active'}
          </div>
        </div>
      </div>

      {/* Service grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card" style={{ height: 80, animation: 'pulse-skeleton 1.5s ease-in-out infinite', animationDelay: `${i * 0.1}s` }} />
          ))}
          <style>{`@keyframes pulse-skeleton { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {services.map(s => (
            <div key={s.name} className="card" style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <div style={{ color: 'var(--text-muted)', flexShrink: 0 }}>{s.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {s.name}
                </div>
                <span className={statusChip(s.key)} style={{ fontSize: '0.6rem' }}>
                  {s.key.toUpperCase()}
                </span>
              </div>
              {statusIcon(s.key)}
            </div>
          ))}
          {health?.activity_count !== undefined && (
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <Cpu size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>
                  {health.activity_count.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.15rem' }}>
                  Activities Indexed
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Scraping jobs table */}
      {health?.jobs && health.jobs.length > 0 ? (
        <>
          <div className="section-label" style={{ marginBottom: '0.75rem' }}>Scraping Jobs</div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Job Name</th>
                  <th>URL</th>
                  <th>Last Run</th>
                  <th>Items Found</th>
                </tr>
              </thead>
              <tbody>
                {health.jobs.map((job, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {statusIcon(job.status)}
                        <span className={statusChip(job.status)} style={{ fontSize: '0.58rem' }}>
                          {job.status.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{job.name}</td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--indigo)', fontFamily: 'monospace' }}>{job.url}</td>
                    <td style={{ fontSize: '0.78rem' }}>{formatDistanceToNow(new Date(job.lastRun), { addSuffix: true })}</td>
                    <td>
                      <span className={job.itemsFound > 0 ? 'chip chip-ok' : 'chip chip-muted'} style={{ fontSize: '0.62rem' }}>
                        {job.itemsFound}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : !loading && (
        <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
          <Clock size={20} style={{ margin: '0 auto 0.5rem', display: 'block', opacity: 0.4 }} />
          <div style={{ fontSize: '0.8rem' }}>
            {error ? 'Could not load job status — backend unreachable' : 'No scraping job data returned by backend'}
          </div>
        </div>
      )}
    </div>
  )
}
