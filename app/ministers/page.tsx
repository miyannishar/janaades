'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/organisms/PageHeader'
type Minister = {
  id: string
  name: string
  ministry: string
  party: string
  appointed_date: string
}

// CSV metadata for enrichment (gender, notes, constituency)
const META: Record<string, { gender: 'Male' | 'Female'; constituency?: string; note?: string; age?: number }> = {
  'm1':  { gender: 'Male',   age: 36, constituency: 'Jhapa-5',      note: 'Former Kathmandu Mayor' },
  'm2':  { gender: 'Male',   age: 51, constituency: 'Tanahun-1',    note: 'RSP Vice-Chair; Economic affairs expert' },
  'm3':  { gender: 'Male',   age: 38, constituency: 'Gorkha-2',     note: 'Rose to prominence during Gen Z movement' },
  'm4':  { gender: 'Male',             constituency: 'Kathmandu-6',  note: 'Heads RSP foreign affairs department' },
  'm5':  { gender: 'Male',             constituency: 'Kathmandu-8',  note: 'Former RSP parliamentary party leader' },
  'm6':  { gender: 'Female', age: 30, constituency: 'Chitwan-3' },
  'm7':  { gender: 'Female', age: 32,                                note: 'Proportional representation; RSP co-spokesperson' },
  'm8':  { gender: 'Male',             constituency: 'Nuwakot-1' },
  'm9':  { gender: 'Male',   age: 29, constituency: 'Kathmandu-5',  note: 'Youngest minister in cabinet' },
  'm10': { gender: 'Male',             constituency: 'Kaski-1' },
  'm11': { gender: 'Male',   age: 35, constituency: 'Rupandehi-1' },
  'm12': { gender: 'Male',             constituency: 'Sarlahi-4' },
  'm13': { gender: 'Female', age: 38, constituency: 'Kanchanpur-3', note: 'Proportional representation' },
  'm14': { gender: 'Female', age: 38, constituency: 'Sunsari-1',    note: 'Proportional representation' },
  'm15': { gender: 'Female',           constituency: 'Surkhet-2',    note: 'Proportional representation' },
  'm16': { gender: 'Male',             constituency: 'Mahottari-2' },
}

export default function MinistersPage() {
  const [ministers, setMinisters] = useState<Minister[]>([])
  const [loading, setLoading]     = useState(true)
  const [genderFilter, setGender] = useState<string>('All')

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/ministers?select=*&order=id.asc`, {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
      },
    })
      .then(r => r.json())
      .then(data => { setMinisters(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const female = ministers.filter(m => META[m.id]?.gender === 'Female').length
  const male   = ministers.filter(m => META[m.id]?.gender === 'Male').length
  const prOnly = ministers.filter(m => !META[m.id]?.constituency).length

  const filtered = genderFilter === 'All'
    ? ministers
    : ministers.filter(m => META[m.id]?.gender === genderFilter)

  return (
    <div className="page-container animate-fade-up">
      <PageHeader 
        label="The Executive" 
        title="Cabinet Ministers" 
        subtitle="RSP Government" 
        meta="Appointed 29 March 2025" 
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem', marginTop: '2rem' }}>
        <div className="ledger-container">
          <div className="ledger-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="heading-md">Current Cabinet Registry</h3>
            <div style={{ display: 'flex', gap: '5px' }}>
              {['All', 'Female', 'Male'].map(g => (
                 <button key={g} onClick={() => setGender(g)} style={{
                   padding: '0.2rem 0.5rem', fontSize: '0.75rem', 
                   background: genderFilter === g ? 'var(--text)' : 'transparent',
                   color: genderFilter === g ? 'var(--bg)' : 'var(--text-muted)',
                   border: '1px solid var(--border)', cursor: 'pointer'
                 }}>
                   {g}
                 </button>
              ))}
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Minister</th>
                <th>Portfolio</th>
                <th>Constituency</th>
                <th style={{ textAlign: 'right' }}>Age/Gender</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Loading registry...</td></tr>
              ) : (
                filtered.map(m => {
                  const meta = META[m.id] ?? { gender: 'Male' }
                  return (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 600 }}>{m.name}</td>
                      <td>{m.ministry}</td>
                      <td>{meta.constituency ? meta.constituency : <span className="text-muted">PR System</span>}</td>
                      <td style={{ textAlign: 'right' }}>
                        {meta.age || '--'} / {meta.gender.charAt(0)}
                      </td>
                      <td className="text-muted" style={{ fontSize: '0.75rem', maxWidth: '200px' }}>
                        {meta.note || ''}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        
        <div style={{ maxWidth: '400px' }}>
             <h3 className="heading-md" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Cabinet Breakdown</h3>
             <table className="data-table">
               <tbody>
                 <tr>
                   <td style={{ padding: '0.5rem 0', fontWeight: 600 }}>Total Ministers</td>
                   <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>{ministers.length}</td>
                 </tr>
                 <tr>
                   <td style={{ padding: '0.5rem 0', fontWeight: 600 }}>Women</td>
                   <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>{female} ({(female / (ministers.length || 1) * 100).toFixed(1)}%)</td>
                 </tr>
                 <tr>
                   <td style={{ padding: '0.5rem 0', fontWeight: 600 }}>Men</td>
                   <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>{male} ({(male / (ministers.length || 1) * 100).toFixed(1)}%)</td>
                 </tr>
                 <tr>
                   <td style={{ padding: '0.5rem 0', fontWeight: 600 }}>PR Appointees</td>
                   <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>{prOnly}</td>
                 </tr>
               </tbody>
             </table>
        </div>
      </div>
    </div>
  )
}
