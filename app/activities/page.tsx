'use client'

import { MOCK_ACTIVITIES } from '@/lib/nepal-data'
import { FileText, AlertTriangle, Users, Share2, CheckCircle2, XCircle, ExternalLink, BarChart3, Clock } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'

export default function ActivitiesPage() {
  const typeIcon: Record<string, React.ReactNode> = {
    bill_introduced: <FileText size={16} />,
    bill_passed:     <CheckCircle2 size={16} />,
    bill_failed:     <XCircle size={16} />,
    vote_held:       <BarChart3 size={16} />,
    minister_action: <AlertTriangle size={16} />,
    gazette_notice:  <ExternalLink size={16} />,
    committee_meeting: <Users size={16} />,
    statement:       <Share2 size={16} />,
    misconduct:      <AlertTriangle size={16} />,
  }

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem' }} className="animate-fade-in">
        <h1 className="display-md" style={{ marginBottom: '0.25rem' }}>Activity Feed</h1>
        <p className="body-lg">Chronological timeline of all monitored parliamentary and governmental events.</p>
      </div>

      <div className="card animate-fade-in">
        <div className="timeline" style={{ paddingTop: '1rem' }}>
          {MOCK_ACTIVITIES.map(a => {
            const dotFilled = ['bill_passed', 'bill_failed', 'vote_held', 'gazette_notice'].includes(a.type)
            return (
              <div key={a.id} className="timeline-item" style={{ paddingBottom: '2.5rem' }}>
                <div className={`timeline-dot ${dotFilled ? 'filled' : ''}`} style={{ top: '0.375rem' }} />
                
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ 
                    padding: '0.625rem', borderRadius: '0.5rem', 
                    background: a.priority === 'high' ? 'var(--crimson-soft)' : a.priority === 'medium' ? 'var(--amber-soft)' : 'var(--surface-container-high)',
                    color: a.priority === 'high' ? 'var(--primary)' : a.priority === 'medium' ? 'var(--amber)' : 'var(--on-surface-variant)',
                  }}>
                    {typeIcon[a.type]}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--tertiary)', fontWeight: 600 }}>
                        {format(new Date(a.date), 'dd MMM yyyy, h:mm a')}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--outline)' }}>
                        ({formatDistanceToNow(new Date(a.date), { addSuffix: true })})
                      </span>
                      {a.ministry && <span className="badge badge-status" style={{ marginLeft: 'auto' }}>{a.ministry}</span>}
                    </div>
                    
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--on-surface)', marginBottom: '0.5rem' }}>
                      {a.title}
                    </h3>
                    
                    <p style={{ fontSize: '0.9rem', color: 'var(--on-surface-variant)', lineHeight: 1.6, background: 'var(--surface-container-low)', padding: '0.75rem 1rem', borderRadius: '0.5rem' }}>
                      {a.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
