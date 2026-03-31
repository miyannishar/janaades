'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, MapPin, Users, Filter } from 'lucide-react'
import dynamic from 'next/dynamic'
import type { ExcelMP } from '@/lib/excel-mps'

// Dynamic import so Leaflet only loads client-side
const MPMap = dynamic(() => import('@/components/map/MPMap'), { ssr: false })

const PROVINCES = [
  'All Provinces', 'Koshi', 'Madhesh', 'Bagmati', 'Gandaki',
  'Lumbini', 'Karnali', 'Sudurpashchim', 'National'
]

const PARTIES = ['All Parties', 'RSP', 'NC', 'UML', 'MAOIST', 'RPP', 'JSP', 'CPNUS', 'Other']
const TYPES   = ['All Types', 'FPTP', 'PR']

function MPCard({ mp, onClose }: { mp: ExcelMP; onClose: () => void }) {
  const genderIcon = mp.gender === 'Female' ? '♀' : mp.gender === 'Male' ? '♂' : '⚥'
  return (
    <div className="card animate-fade-up" style={{
      borderTop: `3px solid ${mp.color}`,
      padding: '1.25rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          {/* Party badge */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.625rem', flexWrap: 'wrap' }}>
            <span style={{
              padding: '0.2rem 0.5rem', borderRadius: 4, fontSize: '0.68rem', fontWeight: 800,
              background: mp.color + '22', color: mp.color, letterSpacing: '0.06em',
            }}>{mp.partyShort}</span>
            <span className={`chip ${mp.electionType === 'FPTP' ? 'chip-ok' : 'chip-warn'}`}>
              {mp.electionType}
            </span>
            <span className="chip chip-muted">{genderIcon} {mp.gender}</span>
          </div>

          {/* Name */}
          <div style={{ fontWeight: 800, fontSize: '1.0625rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            {mp.name}
          </div>

          {/* Party full */}
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            {mp.party}
          </div>

          {/* Location */}
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span><MapPin size={11} style={{ display: 'inline', marginRight: 3 }} />{mp.district}</span>
            <span>Province: <strong style={{ color: 'var(--text-secondary)' }}>{mp.province}</strong></span>
          </div>

          {mp.inclusiveGroup && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Inclusive quota: <span style={{ color: 'var(--amber)' }}>{mp.inclusiveGroup}</span>
            </div>
          )}
        </div>

        <button onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.2rem', lineHeight: 1, padding: '0.25rem' }}
          aria-label="Close">×</button>
      </div>
    </div>
  )
}

export default function FindMyMPPage() {
  const [mps, setMps] = useState<ExcelMP[]>([])
  const [selected, setSelected] = useState<ExcelMP | null>(null)
  const [search, setSearch] = useState('')
  const [province, setProvince] = useState('All Provinces')
  const [party, setParty] = useState('All Parties')
  const [type, setType] = useState('All Types')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    import('@/lib/mps-excel.json').then(m => {
      setMps(m.default as ExcelMP[])
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return mps.filter(mp => {
      if (province !== 'All Provinces' && mp.province !== province) return false
      if (party   !== 'All Parties'   && mp.partyShort !== party)   return false
      if (type    !== 'All Types'     && mp.electionType !== type)  return false
      if (q && !mp.name.toLowerCase().includes(q) && !mp.district.toLowerCase().includes(q)) return false
      return true
    })
  }, [mps, search, province, party, type])

  // Stats
  const female  = filtered.filter(m => m.gender === 'Female').length
  const fptp    = filtered.filter(m => m.electionType === 'FPTP').length
  const parties = [...new Set(filtered.map(m => m.partyShort))].length

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="heading-xl">
            <span className="font-deva" style={{ marginRight: '0.5rem' }}>मेरो सांसद</span>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: '1.25rem' }}>/ Find My MP</span>
          </h1>
          <p className="text-secondary" style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
            275 elected members · Source: Nepal_House_of_Representatives_2082_Members.xlsx
          </p>
        </div>
      </div>

      <div className="page-container">
        {/* Filters */}
        <div className="card" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 220px' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or district…"
              style={{
                width: '100%', paddingLeft: 32, paddingRight: 12, height: 36,
                background: 'var(--surface-3)', border: '1px solid var(--border)',
                borderRadius: 6, color: 'var(--text-primary)', fontSize: '0.85rem',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {[
            { label: 'Province', value: province, opts: PROVINCES, set: setProvince },
            { label: 'Party',    value: party,    opts: PARTIES,   set: setParty },
            { label: 'Type',     value: type,     opts: TYPES,     set: setType },
          ].map(f => (
            <select key={f.label} value={f.value} onChange={e => f.set(e.target.value)}
              style={{
                height: 36, padding: '0 10px', background: 'var(--surface-3)',
                border: '1px solid var(--border)', borderRadius: 6,
                color: 'var(--text-primary)', fontSize: '0.8rem', cursor: 'pointer',
              }}>
              {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ))}

          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            {filtered.length} MPs shown
          </span>
        </div>

        {/* Summary stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
          {[
            { label: 'Matched',   val: filtered.length,  color: 'var(--indigo)' },
            { label: 'Female',    val: female,            color: 'var(--emerald)' },
            { label: 'FPTP Seats',val: fptp,              color: 'var(--amber)' },
            { label: 'Parties',   val: parties,           color: 'var(--text-accent)' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: '0.75rem 1rem' }}>
              <div className="section-label">{s.label}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: s.color, fontVariantNumeric: 'tabular-nums' }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Map + List two-column */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1rem', alignItems: 'start' }}>

          {/* Map */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', height: 480, position: 'sticky', top: 'calc(var(--ticker-h) + 1rem)' }}>
            {loading ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                Loading map…
              </div>
            ) : (
              <MPMap mps={filtered} selectedMP={selected} onSelectMP={setSelected} />
            )}
          </div>

          {/* List panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 480, overflowY: 'auto' }}>
            {selected && (
              <MPCard mp={selected} onClose={() => setSelected(null)} />
            )}

            {!loading && filtered.slice(0, 60).map(mp => (
              <div key={mp.id}
                onClick={() => setSelected(mp)}
                style={{
                  padding: '0.625rem 0.875rem', cursor: 'pointer',
                  background: selected?.id === mp.id ? 'var(--surface-3)' : 'var(--surface-2)',
                  border: `1px solid ${selected?.id === mp.id ? mp.color : 'var(--border)'}`,
                  borderRadius: 8, transition: 'all 150ms',
                  display: 'flex', gap: '0.625rem', alignItems: 'center',
                }}
              >
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: mp.color,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {mp.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {mp.district} · {mp.partyShort} · {mp.electionType}
                    {mp.gender === 'Female' && <span style={{ color: 'var(--emerald)', marginLeft: 4 }}>♀</span>}
                  </div>
                </div>
              </div>
            ))}

            {!loading && filtered.length > 60 && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0.5rem' }}>
                + {filtered.length - 60} more · refine filters to narrow results
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Users size={24} style={{ margin: '0 auto 0.5rem' }} />
                <div>No MPs match your filters</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
