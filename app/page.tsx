'use client'

import { MOCK_ALERTS, MOCK_ACTIVITIES, MOCK_SCRAPING_JOBS, MOCK_STATS, REAL_MPs } from '@/lib/nepal-data'
import { TrendingUp, AlertTriangle, CheckCircle2, XCircle, Zap, Activity, FileText, Users, Clock, ExternalLink } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'

/* ─── Party Seat Heatmap ──────────────────────────────── */
function SeatHeatmap() {
  // 275 seats: RSP=182, NC=46, UML=29, Others=18
  const seats = [
    ...Array(182).fill('rsp'),
    ...Array(46).fill('nc'),
    ...Array(29).fill('uml'),
    ...Array(18).fill('other'),
  ]

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {[
          { label: 'RSP · राष्ट्रिय स्वतन्त्र पार्टी', seats: 182, cls: 'heatmap-rsp', pct: '66.2%' },
          { label: 'NC · नेपाली कांग्रेस', seats: 46, cls: 'heatmap-nc', pct: '16.7%' },
          { label: 'UML · एमाले', seats: 29, cls: 'heatmap-uml', pct: '10.5%' },
          { label: 'Others', seats: 18, cls: 'heatmap-other', pct: '6.5%' },
        ].map(p => (
          <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem' }}>
            <div className={`heatmap-cell ${p.cls}`} style={{ width: 10, height: 10, flexShrink: 0 }} />
            <span style={{ color: 'var(--text-secondary)' }}>{p.label}</span>
            <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{p.seats}</span>
            <span style={{ color: 'var(--text-muted)' }}>({p.pct})</span>
          </div>
        ))}
      </div>
      <div className="heatmap-grid">
        {seats.map((party, i) => (
          <div key={i} className={`heatmap-cell heatmap-${party}`}
            title={`Seat ${i + 1} — ${party.toUpperCase()}`} />
        ))}
      </div>
      <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ flex: 1, height: 6, borderRadius: 3, display: 'flex', overflow: 'hidden', gap: 1 }}>
          <div style={{ width: '66.2%', background: 'var(--rsp)' }} />
          <div style={{ width: '16.7%', background: 'var(--nc)' }} />
          <div style={{ width: '10.5%', background: 'var(--uml)' }} />
          <div style={{ width: '6.6%', background: 'var(--surface-5)' }} />
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>275 seats</span>
      </div>
    </div>
  )
}

/* ─── Alert Card ─────────────────────────────────────── */
function AlertCard({ alert }: { alert: typeof MOCK_ALERTS[0] }) {
  const cls = alert.priority === 'critical' ? 'card-alert' : alert.priority === 'high' ? 'card-warn' : 'card-ok'
  const chipCls = alert.priority === 'critical' ? 'chip-critical' : alert.priority === 'high' ? 'chip-warn' : 'chip-ok'
  const Icon = alert.priority === 'critical' ? Zap : alert.priority === 'high' ? AlertTriangle : CheckCircle2

  return (
    <div className={`card ${cls}`} style={{ marginBottom: '0.625rem', padding: '0.875rem 1rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        <Icon size={15} style={{ flexShrink: 0, marginTop: 2, color: alert.priority === 'critical' ? 'var(--crimson)' : alert.priority === 'high' ? 'var(--amber)' : 'var(--emerald)' }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
            <span className={`chip ${chipCls}`}>{alert.priority.toUpperCase()}</span>
            <span className="chip chip-muted">{alert.ministry}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
              {formatDistanceToNow(new Date(alert.date), { addSuffix: true })}
            </span>
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem', lineHeight: 1.3 }}>
            {alert.title}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {alert.description}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Scraper Status ─────────────────────────────────── */
function ScraperStatus() {
  return (
    <div>
      {MOCK_SCRAPING_JOBS.map((job, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '0.625rem 0', borderBottom: '1px solid var(--border)',
        }}>
          <span className={`dot dot-${job.status === 'operational' ? 'live' : job.status === 'warning' ? 'warn' : 'dead'}`} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {job.url}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              synced {formatDistanceToNow(new Date(job.lastRun), { addSuffix: true })}
            </div>
          </div>
          <span className={`chip ${job.status === 'operational' ? 'chip-ok' : job.status === 'warning' ? 'chip-warn' : 'chip-critical'}`}
            style={{ flexShrink: 0 }}>
            {job.status === 'operational' ? 'LIVE' : job.status.toUpperCase()}
          </span>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
            {job.itemsFound}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ─── Activity Feed ──────────────────────────────────── */
function ActivityFeed() {
  const typeColor: Record<string, string> = {
    bill_introduced: 'var(--indigo)',
    bill_passed: 'var(--emerald)',
    bill_failed: 'var(--crimson)',
    vote_held: 'var(--amber)',
    misconduct: 'var(--crimson)',
    minister_action: 'var(--amber)',
    gazette_notice: 'var(--blue)',
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {MOCK_ACTIVITIES.slice(0, 8).map(a => (
        <div key={a.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: 3, background: typeColor[a.type] || 'var(--text-muted)', alignSelf: 'stretch', borderRadius: 2, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: '0.15rem' }}>{a.title}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              {format(new Date(a.date), 'dd MMM · h:mm a')}
              {a.ministry && <> · <span style={{ color: 'var(--text-accent)' }}>{a.ministry}</span></>}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Dashboard Page ─────────────────────────────────── */
export default function DashboardPage() {
  const rspMPs = REAL_MPs.filter(m => m.partyShort === 'RSP').length
  const totalAlerts = MOCK_ALERTS.length
  const criticalAlerts = MOCK_ALERTS.filter(a => a.priority === 'critical').length

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="heading-xl">Intelligence Dashboard</h1>
          <p className="text-secondary" style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
            Nepal Pratinidhi Sabha · 2083 B.S. Session · RSP Supermajority Parliament
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className="chip chip-ok" style={{ gap: '0.4rem' }}>
            <span className="dot dot-live" />
            LIVE
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Updated {format(new Date(), 'HH:mm')}
          </span>
        </div>
      </div>

      <div className="page-container">
        {/* Hero Stats */}
        <div className="dashboard-hero-grid stagger"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            {
              number: '275', label: 'Total Seats', delta: 'Pratinidhi Sabha', type: 'info',
              accentColor: 'var(--indigo)', icon: <Users size={16} />
            },
            {
              number: '182', label: 'RSP Seats', delta: '↑ Supermajority · 66.2%', type: 'up',
              accentColor: 'var(--rsp)', icon: <TrendingUp size={16} />
            },
            {
              number: String(totalAlerts), label: 'Active Alerts', delta: `${criticalAlerts} CRITICAL`, type: 'down',
              accentColor: 'var(--crimson)', icon: <AlertTriangle size={16} />
            },
            {
              number: '47', label: 'Bills Tracked', delta: '8 passed this session', type: 'up',
              accentColor: 'var(--amber)', icon: <FileText size={16} />
            },
          ].map(s => (
            <div key={s.label} className="stat-card animate-fade-up" style={{ '--accent-color': s.accentColor } as React.CSSProperties}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div className="section-label">{s.label}</div>
                <div style={{ color: s.accentColor, opacity: 0.7 }}>{s.icon}</div>
              </div>
              <div className="stat-number" style={{ color: s.accentColor }}>{s.number}</div>
              <div className={`stat-delta ${s.type}`}>{s.delta}</div>
            </div>
          ))}
        </div>

        {/* Main grid: 3 columns → 2 on tablet, 1 on mobile */}
        <div className="dashboard-main-grid"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 340px', gap: '1rem', marginBottom: '1rem' }}>

          {/* Left: Party Heatmap */}
          <div className="card animate-fade-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <div className="section-label">Seat Distribution</div>
                <div className="heading-sm" style={{ marginTop: '0.25rem' }}>Pratinidhi Sabha Heatmap</div>
              </div>
              <span className="chip chip-indigo">2083 B.S.</span>
            </div>
            <SeatHeatmap />
          </div>

          {/* Center: Alerts */}
          <div className="card animate-fade-up" style={{ animationDelay: '60ms' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <div className="section-label">Priority Queue</div>
                <div className="heading-sm" style={{ marginTop: '0.25rem' }}>System Alerts</div>
              </div>
              <span className={`chip ${criticalAlerts > 0 ? 'chip-critical' : 'chip-ok'}`} style={{ gap: '0.4rem' }}>
                {criticalAlerts > 0 && <span className="dot dot-dead" />}
                {totalAlerts} ACTIVE
              </span>
            </div>
            <div style={{ maxHeight: 280, overflowY: 'auto' }}>
              {MOCK_ALERTS.map((a, i) => <AlertCard key={i} alert={a} />)}
            </div>
          </div>

          {/* Right: Scraper status — full-width on narrow */}
          <div className="card dashboard-right-col animate-fade-up" style={{ animationDelay: '120ms' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
              <div>
                <div className="section-label">Inbound Telemetry</div>
                <div className="heading-sm" style={{ marginTop: '0.25rem' }}>Data Sources</div>
              </div>
              <span className="chip chip-ok" style={{ gap: '0.4rem' }}>
                <span className="dot dot-live" />
                {MOCK_SCRAPING_JOBS.filter(j => j.status === 'operational').length} LIVE
              </span>
            </div>
            <ScraperStatus />
          </div>
        </div>

        {/* Bottom row */}
        <div className="dashboard-bottom-grid"
          style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1rem' }}>

          {/* Activity feed */}
          <div className="card animate-fade-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
              <div>
                <div className="section-label">Legislative Timeline</div>
                <div className="heading-sm" style={{ marginTop: '0.25rem' }}>Recent Activity</div>
              </div>
              <a href="/activities" className="btn-ghost" style={{ fontSize: '0.75rem', padding: '0.25rem 0.625rem' }}>
                View all <ExternalLink size={11} />
              </a>
            </div>
            <ActivityFeed />
          </div>

          {/* Quick stats panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="card animate-fade-up">
              <div className="section-label" style={{ marginBottom: '0.75rem' }}>Parliament Stats</div>
              {[
                { label: 'Speaker', value: 'Indira Rana', color: 'var(--text-primary)' },
                { label: 'Cabinet Ministers', value: '17', color: 'var(--amber)' },
                { label: 'Session', value: 'Monsoon 2083', color: 'var(--text-primary)' },
                { label: 'Bills This Session', value: '23', color: 'var(--emerald)' },
                { label: 'Avg Attendance', value: '`81.2%`', color: 'var(--indigo)' },
                { label: 'Women MPs', value: '91 (33.1%)', color: 'var(--text-accent)' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{s.label}</span>
                  <span style={{ fontWeight: 700, color: s.color }}>{s.value.replace(/`/g, '')}</span>
                </div>
              ))}
            </div>

            <div className="card card-indigo animate-fade-up">
              <div className="section-label" style={{ marginBottom: '0.5rem' }}>AI Analysis</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
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
