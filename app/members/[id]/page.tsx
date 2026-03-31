'use client'

import { MOCK_MPs as _MOCK_MPs } from '@/lib/nepal-data'
import { notFound } from 'next/navigation'
import { Mail, Phone, ChevronLeft, FileText, History } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'
import type { MP } from '@/lib/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MOCK_MPs = _MOCK_MPs as any[] as MP[]



// Add unwrap for Next.js 16
function ProfilePageInternal({ id }: { id: string }) {
  const mp = MOCK_MPs.find(m => m.id === id)

  if (!mp) {
    return notFound()
  }

  const attendanceType = mp.attendance >= 85 ? 'green' : mp.attendance >= 70 ? 'amber' : 'crimson'

  return (
    <div className="page-container">
      <Link href="/members" className="btn-ghost" style={{ marginBottom: '1.5rem', padding: 0 }}>
        <ChevronLeft size={16} /> Back to Members
      </Link>

      <div className="card-elevated animate-fade-in" style={{ marginBottom: '2rem', borderTop: `4px solid ${mp.partyShort === 'RSP' ? 'var(--primary-container)' : 'var(--tertiary)'}` }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          {/* Avatar */}
          <div style={{
            width: 120, height: 120, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--surface-container-high), var(--surface-container-lowest))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '3rem', border: '4px solid var(--outline-variant)', flexShrink: 0, color: 'var(--on-surface-variant)'
          }}>
            {mp.name.charAt(0)}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 className="display-md" style={{ marginBottom: '0.25rem' }}>{mp.name}</h1>
                <div className="font-devanagari" style={{ fontSize: '1.25rem', color: 'var(--outline)', marginBottom: '1rem' }}>
                  {mp.nameNepali}
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <span className={`badge ${mp.partyShort === 'RSP' ? 'badge-party-rsp' : 'badge-party'}`}>{mp.party} ({mp.partyShort})</span>
                  <span className="badge badge-status">📍 {mp.constituency.name}</span>
                  <span className="badge badge-status">{mp.chamber} — {mp.electionType}</span>
                </div>
              </div>
              {mp.isMinister && (
                <div style={{ padding: '0.75rem 1rem', background: 'var(--amber-soft)', border: '1px solid var(--amber)', borderRadius: '0.5rem', color: 'var(--amber)', fontWeight: 700, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Role</div>
                  <div>{mp.ministryPortfolio}</div>
                </div>
              )}
            </div>

            <p style={{ fontSize: '1rem', color: 'var(--on-surface-variant)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {mp.bio}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', borderTop: '1px solid var(--outline-variant)', paddingTop: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: `var(--${attendanceType})` }}>{mp.attendance}%</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--outline)', textTransform: 'uppercase', fontWeight: 600 }}>Attendance</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--tertiary)' }}>{mp.billsSponsored}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--outline)', textTransform: 'uppercase', fontWeight: 600 }}>Bills Sponsored</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--amber)' }}>{mp.questionsAsked}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--outline)', textTransform: 'uppercase', fontWeight: 600 }}>Questions Asked</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--green)' }}>{mp.votesParticipated}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--outline)', textTransform: 'uppercase', fontWeight: 600 }}>Votes Participated</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Left Col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
           <div className="card">
             <h2 className="headline" style={{ marginBottom: '1rem' }}>
               <FileText size={18} style={{ display: 'inline', marginRight: '0.5rem' }}/> 
               Sponsored Bills
             </h2>
             {mp.billsSponsored > 0 ? (
               <div style={{ color: 'var(--outline)' }}>
                 Bills tracking to be integrated from full DB schema. Currently {mp.billsSponsored} bills recorded.
               </div>
             ) : (
               <div style={{ color: 'var(--outline)' }}>No bills sponsored in current session.</div>
             )}
           </div>

           <div className="card">
             <h2 className="headline" style={{ marginBottom: '1rem' }}>
               <History size={18} style={{ display: 'inline', marginRight: '0.5rem' }}/> 
               Recent Voting Record
             </h2>
             {mp.votingRecord && mp.votingRecord.length > 0 ? (
               <div>...</div>
             ) : (
               <div style={{ color: 'var(--outline)' }}>Voting records currently being synchronized.</div>
             )}
           </div>
        </div>

        {/* Right Col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <h2 className="headline" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Contact Information</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--outline)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Official Email</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                  <Mail size={16} /> <a href={`mailto:${mp.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{mp.email}</a>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--outline)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Phone/Office</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--on-surface-variant)' }}>
                  <Phone size={16} /> {mp.phone}
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="headline" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Committees</h2>
            <ul style={{ paddingLeft: '1.25rem', color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>
              {mp.committees.map(c => (
                <li key={c} style={{ marginBottom: '0.5rem' }}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  return <ProfilePageInternal id={id} />
}
