'use client'

import { useEffect, useState } from 'react'
import { Shield, User, Users, Briefcase, Calendar, Building2 } from 'lucide-react'

type Minister = {
  id: string
  name: string
  ministry: string
  party: string
  appointed_date: string
  score: number
  attendance: number
  budget_utilization: number
  alerts: number
  press_releases: number
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

const MINISTRY_COLORS: Record<string, string> = {
  'Prime Minister':        '#6366f1',
  'Finance':               '#f59e0b',
  'Home':                  '#ef4444',
  'Foreign':               '#3b82f6',
  'Energy':                '#10b981',
  'Law':                   '#8b5cf6',
  'Federal':               '#06b6d4',
  'Communications':        '#ec4899',
  'Education':             '#f97316',
  'Culture':               '#a78bfa',
  'Physical':              '#64748b',
  'Industry':              '#0ea5e9',
  'Agriculture':           '#22c55e',
  'Health':                '#f43f5e',
  'Women':                 '#e879f9',
  'Labour':                '#94a3b8',
}

function getMinistryColor(ministry: string) {
  for (const [key, color] of Object.entries(MINISTRY_COLORS)) {
    if (ministry.includes(key)) return color
  }
  return '#6366f1'
}

function Avatar({ name, gender, color }: { name: string; gender: 'Male' | 'Female'; color: string }) {
  const initials = name.split(' ').filter(w => !w.startsWith('(')).slice(0, 2).map(w => w[0]).join('')
  return (
    <div style={{
      width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
      background: `${color}22`, border: `2px solid ${color}44`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '1rem', fontWeight: 800, color, letterSpacing: '-0.02em'
    }}>
      {initials}
    </div>
  )
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
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }} className="animate-fade-in">
        <h1 className="display-md" style={{ marginBottom: '0.25rem' }}>
          <span className="font-deva" style={{ marginRight: '0.5rem' }}>मन्त्रिपरिषद</span>
          <span style={{ fontWeight: 400, fontSize: '1.25rem', color: 'var(--on-surface-variant)' }}>/ Cabinet Ministers</span>
        </h1>
        <p className="body-lg">RSP Government Cabinet 2082 B.S. · Appointed 29 March 2025</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Cabinet Size',      value: ministers.length, icon: Users,     color: '#6366f1' },
          { label: 'Women Ministers',   value: female,           icon: User,      color: '#ec4899' },
          { label: 'Men Ministers',     value: male,             icon: User,      color: '#3b82f6' },
          { label: 'PR Seats',          value: prOnly,           icon: Building2, color: '#f59e0b' },
          { label: 'Ministries Held',   value: ministers.length, icon: Briefcase, color: '#10b981' },
        ].map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} className="card" style={{ padding: '0.875rem 1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                <Icon size={13} style={{ color: s.color }} />
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--on-surface-variant)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.label}</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
            </div>
          )
        })}
      </div>

      {/* Gender representation bar */}
      <div style={{ background: 'var(--surface-container)', borderRadius: '0.75rem', padding: '1rem 1.25rem', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
          <span style={{ color: '#ec4899', fontWeight: 700 }}>♀ {female} Women ({ministers.length ? Math.round(female / ministers.length * 100) : 0}%)</span>
          <span style={{ color: 'var(--on-surface-variant)', fontSize: '0.7rem', fontWeight: 600 }}>Gender Composition</span>
          <span style={{ color: '#3b82f6', fontWeight: 700 }}>{male} Men ♂</span>
        </div>
        <div style={{ height: '8px', borderRadius: '99px', overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${ministers.length ? (female / ministers.length) * 100 : 0}%`, background: 'linear-gradient(90deg, #ec4899, #f472b6)', transition: 'width 0.6s ease' }} />
          <div style={{ flex: 1, background: 'linear-gradient(90deg, #3b82f6, #60a5fa)' }} />
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1.5rem' }}>
        {['All', 'Female', 'Male'].map(g => (
          <button key={g} onClick={() => setGender(g)} style={{
            padding: '0.375rem 0.875rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
            cursor: 'pointer', border: genderFilter === g ? '1px solid var(--indigo)' : '1px solid var(--border)',
            background: genderFilter === g ? 'var(--indigo-soft)' : 'var(--surface-container)',
            color: genderFilter === g ? 'var(--indigo)' : 'var(--on-surface-variant)',
          }}>
            {g === 'All' ? `All (${ministers.length})` : g === 'Female' ? `♀ Women (${female})` : `♂ Men (${male})`}
          </button>
        ))}
      </div>

      {/* Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--on-surface-variant)' }}>
          Loading cabinet…
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1rem' }}>
          {filtered.map(m => {
            const meta  = META[m.id] ?? { gender: 'Male' }
            const color = getMinistryColor(m.ministry)
            return (
              <div key={m.id} className="card animate-fade-in" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <Avatar name={m.name} gender={meta.gender} color={color} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Name + gender chip */}
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--on-surface)' }}>{m.name}</span>
                      <span style={{
                        fontSize: '0.6rem', fontWeight: 700, padding: '0.15rem 0.4rem', borderRadius: '4px',
                        background: meta.gender === 'Female' ? '#fce7f3' : '#dbeafe',
                        color: meta.gender === 'Female' ? '#be185d' : '#1d4ed8',
                      }}>
                        {meta.gender === 'Female' ? '♀ FEMALE' : '♂ MALE'}
                      </span>
                      {meta.age && (
                        <span style={{ fontSize: '0.65rem', color: 'var(--on-surface-variant)' }}>Age {meta.age}</span>
                      )}
                    </div>

                    {/* Ministry */}
                    <div style={{
                      fontSize: '0.775rem', fontWeight: 600, color, lineHeight: 1.4, marginBottom: '0.375rem',
                      display: 'flex', alignItems: 'flex-start', gap: '0.35rem'
                    }}>
                      <Shield size={12} style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                      {m.ministry}
                    </div>

                    {/* Meta row */}
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.7rem', color: 'var(--on-surface-variant)' }}>
                      {meta.constituency && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Building2 size={10} /> {meta.constituency}
                        </span>
                      )}
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={10} /> Since {new Date(m.appointed_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Note */}
                {meta.note && (
                  <div style={{
                    marginTop: '0.875rem', fontSize: '0.725rem', color: 'var(--on-surface-variant)',
                    background: 'var(--surface-container-high)', borderRadius: '6px',
                    padding: '0.5rem 0.75rem', borderLeft: `3px solid ${color}`,
                    lineHeight: 1.5,
                  }}>
                    {meta.note}
                  </div>
                )}

                {/* Party badge */}
                <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{
                    fontSize: '0.62rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px',
                    background: `${color}18`, color, letterSpacing: '0.04em'
                  }}>RSP</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
