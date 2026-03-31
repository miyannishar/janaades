'use client'

import { MOCK_SCRAPING_JOBS, MOCK_STATS } from '@/lib/nepal-data'
import { Cpu, Server, Database, Globe, RefreshCcw, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'

export default function SystemPage() {
  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem' }} className="animate-fade-in">
        <h1 className="display-md" style={{ marginBottom: '0.25rem' }}>System Status & Services</h1>
        <p className="body-lg">Autonomous scraping, indexing, and processing services health.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }} className="stagger">
        {[
          { icon: <Cpu />, label: 'Scraping Jobs', value: MOCK_SCRAPING_JOBS.length, color: 'var(--tertiary)' },
          { icon: <Globe />, label: 'Success Rate', value: `${MOCK_STATS.scrapingSuccessRate}%`, color: 'var(--green)' },
          { icon: <Sever />, label: 'Serverless Execution', value: '382ms', color: 'var(--amber)' },
          { icon: <Database />, label: 'DB Latency', value: '24ms', color: 'var(--primary)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--surface-container-low)', color: s.color, borderRadius: '0.5rem' }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--on-surface)', lineHeight: 1.2 }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--outline)', fontWeight: 600 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="headline" style={{ marginBottom: '1rem' }}>Firecrawl Scraping Jobs</h2>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Target Name</th>
              <th>URL</th>
              <th>Last Run</th>
              <th>Next Sync</th>
              <th>Items Found</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_SCRAPING_JOBS.map((job, i) => (
              <tr key={i}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {job.status === 'operational' ? <CheckCircle2 size={16} style={{ color: 'var(--green)' }} /> : 
                     job.status === 'warning' ? <AlertTriangle size={16} style={{ color: 'var(--amber)' }} /> : 
                     <XCircle size={16} style={{ color: 'var(--primary-container)' }} />}
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--on-surface)' }}>
                      {job.status.toUpperCase()}
                    </span>
                  </div>
                </td>
                <td style={{ fontWeight: 600, color: 'var(--on-surface)' }}>{job.name}</td>
                <td style={{ fontSize: '0.8rem', color: 'var(--tertiary)', fontFamily: 'monospace' }}>{job.url}</td>
                <td style={{ fontSize: '0.8rem' }}>{formatDistanceToNow(new Date(job.lastRun), { addSuffix: true })}</td>
                <td style={{ fontSize: '0.8rem' }}>{format(new Date(job.nextRun), 'MMM d, h:mm a')}</td>
                <td>
                  <span className={`badge ${job.itemsFound > 0 ? 'badge-low' : 'badge-status'}`}>
                    {job.itemsFound}
                  </span>
                </td>
                <td>
                  <button className="btn-ghost" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                    <RefreshCcw size={14} style={{ marginRight: '0.25rem', display: 'inline' }} /> Sync Now
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const Sever = () => <Server />
