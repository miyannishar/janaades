'use client'

import { useState, useEffect } from 'react'
import { fetchRecentActivities } from '@/lib/supabase'
import type { Activity } from '@/lib/supabase'
import { FileText, AlertTriangle, Users, Share2, CheckCircle2, XCircle, ExternalLink, BarChart3, Newspaper } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentActivities(50).then(data => {
      setActivities(data)
      setLoading(false)
    })
  }, [])

  const typeIcon: Record<string, React.ReactNode> = {
    bill_introduced:   <FileText size={16} />,
    bill_passed:       <CheckCircle2 size={16} />,
    bill_failed:       <XCircle size={16} />,
    vote_held:         <BarChart3 size={16} />,
    minister_action:   <AlertTriangle size={16} />,
    gazette_notice:    <ExternalLink size={16} />,
    committee_meeting: <Users size={16} />,
    statement:         <Share2 size={16} />,
    misconduct:        <AlertTriangle size={16} />,
    news:              <Newspaper size={16} />,
  }

  const typeColor: Record<string, string> = {
    news:              'var(--blue)',
    bill_introduced:   'var(--indigo)',
    bill_passed:       'var(--emerald)',
    bill_failed:       'var(--crimson)',
    vote_held:         'var(--amber)',
    misconduct:        'var(--crimson)',
    minister_action:   'var(--amber)',
    gazette_notice:    'var(--blue)',
  }

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem' }} className="animate-fade-in">
        <h1 className="display-md" style={{ marginBottom: '0.25rem' }}>Activity Feed</h1>
        <p className="body-lg">Chronological timeline of all monitored parliamentary and governmental events.</p>
      </div>

      <div className="card animate-fade-in">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem 0' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{
                display: 'flex', gap: '1rem',
                animation: 'pulse-skeleton 1.5s ease-in-out infinite',
                animationDelay: `${i * 0.1}s`,
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--surface-3)', flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ height: 14, borderRadius: 4, background: 'var(--surface-3)', width: '60%' }} />
                  <div style={{ height: 12, borderRadius: 4, background: 'var(--surface-3)', width: '40%' }} />
                </div>
              </div>
            ))}
            <style>{`@keyframes pulse-skeleton { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
          </div>
        ) : activities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            <Newspaper size={28} style={{ margin: '0 auto 0.75rem', opacity: 0.4, display: 'block' }} />
            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>No activity yet</div>
            <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.7 }}>Check back soon — live monitoring is active</div>
          </div>
        ) : (
          <div className="timeline" style={{ paddingTop: '1rem' }}>
            {activities.map(a => {
              const dotFilled = ['bill_passed', 'bill_failed', 'vote_held', 'gazette_notice'].includes(a.type)
              const color = typeColor[a.type] || 'var(--text-muted)'
              return (
                <div
                  key={a.id}
                  className="timeline-item"
                  style={{ paddingBottom: '2.5rem', cursor: a.source_url ? 'pointer' : 'default' }}
                  onClick={() => a.source_url && window.open(a.source_url, '_blank')}
                >
                  <div className={`timeline-dot ${dotFilled ? 'filled' : ''}`} style={{ top: '0.375rem' }} />

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{
                      padding: '0.625rem', borderRadius: '0.5rem', flexShrink: 0,
                      background: a.priority === 'high' ? 'var(--crimson-soft)' : a.priority === 'medium' ? 'var(--amber-soft)' : 'var(--surface-3)',
                      color: a.priority === 'high' ? 'var(--crimson)' : a.priority === 'medium' ? 'var(--amber)' : 'var(--text-muted)',
                    }}>
                      {typeIcon[a.type] ?? <FileText size={16} />}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.8rem', color, fontWeight: 600 }}>
                          {format(new Date(a.date), 'dd MMM yyyy, h:mm a')}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          ({formatDistanceToNow(new Date(a.date), { addSuffix: true })})
                        </span>
                        {a.priority === 'high' && (
                          <span className="chip chip-critical" style={{ marginLeft: 'auto', fontSize: '0.58rem' }}>HIGH</span>
                        )}
                        {a.ministry && (
                          <span className="chip chip-muted" style={{ fontSize: '0.58rem' }}>{a.ministry}</span>
                        )}
                      </div>

                      <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.375rem', lineHeight: 1.4 }}>
                        {a.title}
                      </h3>

                      {a.description && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                          {a.description}
                        </p>
                      )}

                      {a.source_url && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--indigo)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <ExternalLink size={10} /> View source
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
