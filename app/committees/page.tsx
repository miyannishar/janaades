'use client'

import { MOCK_COMMITTEES } from '@/lib/nepal-data'
import type { Committee } from '@/lib/types'
import { Building2, Users, FileText, Calendar } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'

function CommitteeCard({ committee }: { committee: Committee }) {
  return (
    <div className="card card-blue" style={{ marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{ padding: '0.625rem', background: 'var(--blue-soft)', borderRadius: '0.5rem', color: 'var(--tertiary)', flexShrink: 0 }}>
          <Building2 size={18} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
            <span className="badge badge-status">{committee.chamber === 'HOR' ? 'House' : 'National Assembly'}</span>
            {committee.activeBills > 0 && (
              <span className="badge badge-medium">{committee.activeBills} Active Bills</span>
            )}
          </div>
          <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--on-surface)', marginBottom: '0.25rem' }}>
            {committee.name}
          </h3>
          {committee.nameNepali && (
            <div className="font-devanagari" style={{ fontSize: '0.8rem', color: 'var(--outline)', marginBottom: '0.5rem' }}>
              {committee.nameNepali}
            </div>
          )}
          <p style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
            {committee.description}
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.75rem', color: 'var(--outline)', flexWrap: 'wrap' }}>
            <span><Users size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />Chair: {committee.chair}</span>
            <span><Users size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />{committee.members.length} Members</span>
            <span><Calendar size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />Last met {formatDistanceToNow(new Date(committee.lastMeeting), { addSuffix: true })}</span>
            {committee.nextMeeting && (
              <span style={{ color: 'var(--tertiary)' }}><Calendar size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />Next: {format(new Date(committee.nextMeeting), 'dd MMM')}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CommitteesPage() {
  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem' }} className="animate-fade-in">
        <h1 className="display-md" style={{ marginBottom: '0.25rem' }}>Parliamentary Committees</h1>
        <p className="body-lg">Standing and special committees of Nepal's House of Representatives and National Assembly</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }} className="stagger">
        {[
          { label: 'Total Committees', value: 20, color: 'var(--tertiary)' },
          { label: 'Active Bills in Committee', value: MOCK_COMMITTEES.reduce((s, c) => s + c.activeBills, 0), color: 'var(--amber)' },
          { label: 'Meetings This Week', value: 5, color: 'var(--green)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: s.color, marginBottom: '0.25rem' }}>{s.value}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="animate-fade-in">
        {MOCK_COMMITTEES.map(c => <CommitteeCard key={c.id} committee={c} />)}
      </div>
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--outline)', fontSize: '0.8rem' }}>
        20 parliamentary committees tracked · Showing {MOCK_COMMITTEES.length} with latest data
      </div>
    </div>
  )
}
