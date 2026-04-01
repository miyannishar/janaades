'use client'

import { MOCK_ALERTS, MOCK_ACTIVITIES, MOCK_SCRAPING_JOBS, MOCK_STATS, REAL_MPs } from '@/lib/nepal-data'
import { TrendingUp, AlertTriangle, CheckCircle2, Zap, FileText, Users, ExternalLink } from 'lucide-react'
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

/* ─── Alert Card ─────────────────────────────────────── */
function AlertCard({ alert }: { alert: typeof MOCK_ALERTS[0] }) {
  const cls = alert.priority === 'critical' ? 'card-alert' : alert.priority === 'high' ? 'card-warn' : 'card-ok'
  const Icon = alert.priority === 'critical' ? Zap : alert.priority === 'high' ? AlertTriangle : CheckCircle2
  const accentColor = alert.priority === 'critical' ? 'var(--crimson)' : alert.priority === 'high' ? 'var(--amber)' : 'var(--emerald)'

  return (
    <div className={`card ${cls}`} style={{ marginBottom: '0.5rem', padding: '0.875rem 1rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
          background: `${accentColor}11`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={13} style={{ color: accentColor }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
            <span className={`chip ${alert.priority === 'critical' ? 'chip-critical' : alert.priority === 'high' ? 'chip-warn' : 'chip-ok'}`}>
              {alert.priority.toUpperCase()}
            </span>
            <span className="chip chip-muted">{alert.ministry}</span>
            <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginLeft: 'auto', fontVariantNumeric: 'tabular-nums' }}>
              {formatDistanceToNow(new Date(alert.date), { addSuffix: true })}
            </span>
          </div>
          <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem', lineHeight: 1.35 }}>
            {alert.title}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            {alert.description}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Intelligence Scraper Status ────────────────────── */
function ScraperStatus() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      {MOCK_SCRAPING_JOBS.map((job, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '0.6rem 0.75rem',
          borderRadius: 8,
          background: 'rgba(255, 255, 255, 0.015)',
          transition: 'all 150ms ease',
        }}>
          <span className={`dot dot-${job.status === 'operational' ? 'live' : job.status === 'warning' ? 'warn' : 'dead'}`} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {job.url}
            </div>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '1px' }}>
              synced {formatDistanceToNow(new Date(job.lastRun), { addSuffix: true })}
            </div>
          </div>
          <span className={`chip ${job.status === 'operational' ? 'chip-ok' : job.status === 'warning' ? 'chip-warn' : 'chip-critical'}`}
            style={{ flexShrink: 0 }}>
            {job.status === 'operational' ? 'LIVE' : job.status.toUpperCase()}
          </span>
          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
            {job.itemsFound}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ─── Legislative Pulse (Activity Feed) ──────────────── */
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      {MOCK_ACTIVITIES.slice(0, 8).map(a => {
        const color = typeColor[a.type] || 'var(--text-muted)'
        return (
          <div key={a.id} style={{
            display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
            padding: '0.6rem 0.75rem',
            borderRadius: 8,
            background: 'rgba(255, 255, 255, 0.01)',
            transition: 'all 150ms ease',
          }}>
            {/* Color accent dot */}
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: color,
              boxShadow: `0 0 8px ${color}44`,
              flexShrink: 0, marginTop: '0.4rem',
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.35, marginBottom: '0.15rem' }}>{a.title}</div>
              <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                <span>{format(new Date(a.date), 'dd MMM · h:mm a')}</span>
                {a.ministry && <><span style={{ opacity: 0.4 }}>·</span><span style={{ color: 'var(--text-accent)' }}>{a.ministry}</span></>}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ─── Dashboard Page ─────────────────────────────────── */
export default function DashboardPage() {
  const rspMPs = REAL_MPs.filter(m => m.partyShort === 'RSP').length
  const totalAlerts = MOCK_ALERTS.length
  const criticalAlerts = MOCK_ALERTS.filter(a => a.priority === 'critical').length
  const liveScrapers = MOCK_SCRAPING_JOBS.filter(j => j.status === 'operational').length

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="heading-xl">
            <span style={{ opacity: 0.4, marginRight: '0.5rem' }}>◆</span>
            Intelligence Dashboard
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
        {/* Hero Stats — Glass Stat Cards */}
        <div className="dashboard-hero-grid stagger"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.75rem' }}>
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

          {/* Center: Priority Queue */}
          <div className="card animate-fade-up" style={{ animationDelay: '70ms' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <div className="section-label">Priority Queue</div>
                <div className="heading-sm" style={{ marginTop: '0.3rem' }}>System Alerts</div>
              </div>
              <span className={`chip ${criticalAlerts > 0 ? 'chip-critical' : 'chip-ok'}`} style={{ gap: '0.4rem' }}>
                {criticalAlerts > 0 && <span className="dot dot-dead" />}
                {totalAlerts} ACTIVE
              </span>
            </div>
            <div style={{ maxHeight: 300, overflowY: 'auto' }}>
              {MOCK_ALERTS.map((a, i) => <AlertCard key={i} alert={a} />)}
            </div>
          </div>

          {/* Right: Data Sources */}
          <div className="card dashboard-right-col animate-fade-up" style={{ animationDelay: '140ms' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <div className="section-label">Inbound Telemetry</div>
                <div className="heading-sm" style={{ marginTop: '0.3rem' }}>Data Sources</div>
              </div>
              <span className="chip chip-ok" style={{ gap: '0.4rem' }}>
                <span className="dot dot-live" />
                {liveScrapers} LIVE
              </span>
            </div>
            <ScraperStatus />
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
              <a href="/activities" className="btn-ghost" style={{ fontSize: '0.72rem', padding: '0.3rem 0.625rem' }}>
                View all <ExternalLink size={11} />
              </a>
            </div>
            <ActivityFeed />
          </div>

          {/* Quick stats panel */}
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
