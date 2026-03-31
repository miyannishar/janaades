'use client'

import { MOCK_MISCONDUCT } from '@/lib/nepal-data'
import { AlertOctagon, Scale, ShieldAlert, FileSearch } from 'lucide-react'
import { format } from 'date-fns'

export default function MisconductPage() {
  return (
    <div className="page-container">
       <div style={{ marginBottom: '2rem' }} className="animate-fade-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ padding: '0.75rem', background: 'var(--crimson-soft)', color: 'var(--primary-container)', borderRadius: '0.5rem' }}>
            <AlertOctagon size={28} />
          </div>
          <div>
            <h1 className="display-md" style={{ marginBottom: '0.25rem', color: 'var(--primary-fixed)' }}>Misconduct Database</h1>
            <p className="body-lg">Tracking allegations, investigations, and convictions of public officials.</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }} className="stagger">
         {[
          { label: 'Active Cases', value: MOCK_MISCONDUCT.filter(m => m.status === 'under_investigation' || m.status === 'alleged').length, color: 'var(--amber)' },
          { label: 'Convictions (2026)', value: MOCK_MISCONDUCT.filter(m => m.status === 'convicted').length, color: 'var(--primary)' },
          { label: 'Cleared', value: MOCK_MISCONDUCT.filter(m => m.status === 'cleared').length, color: 'var(--green)' },
          { label: 'High Severity', value: MOCK_MISCONDUCT.filter(m => m.severity === 'high').length, color: 'var(--primary-container)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: s.color, marginBottom: '0.25rem' }}>{s.value}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="animate-fade-in">
        {MOCK_MISCONDUCT.map((record) => (
          <div key={record.id} className={`card ${record.status === 'convicted' ? 'card-crimson' : record.status === 'cleared' ? 'card-green' : 'card-amber'}`} style={{ marginBottom: '1rem' }}>
             <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
               <div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span className={`badge ${
                      record.status === 'convicted' ? 'badge-high' : 
                      record.status === 'cleared' ? 'badge-low' : 'badge-medium'
                    }`}>
                      {record.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="badge badge-status">
                      Reported: {format(new Date(record.dateReported), 'MMM yyyy')}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--on-surface)', marginBottom: '0.25rem' }}>
                    {record.name}
                  </h3>
                  <div style={{ fontSize: '0.9rem', color: 'var(--on-surface-variant)', fontWeight: 600 }}>
                    Allegation: {record.allegation}
                  </div>
               </div>
               <div style={{ padding: '0.5rem', background: 'var(--surface-container-low)', borderRadius: '0.5rem', color: 'var(--outline)' }}>
                 {record.status === 'convicted' ? <Scale size={20} style={{ color: 'var(--primary-container)' }}/> : 
                  record.status === 'under_investigation' ? <FileSearch size={20} style={{ color: 'var(--amber)' }}/> :
                  <ShieldAlert size={20} />}
               </div>
             </div>
             
             <div style={{ padding: '1rem', background: 'var(--surface-container-low)', borderRadius: '0.5rem' }}>
               <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  Details & Context
               </div>
               <p style={{ fontSize: '0.875rem', color: 'var(--on-surface)', lineHeight: 1.6 }}>
                 {record.description}
               </p>
             </div>
             <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--outline)' }}>
               <strong>Investigating Authority:</strong> {record.source}
             </div>
          </div>
        ))}
      </div>
    </div>
  )
}
