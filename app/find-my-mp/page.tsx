'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, MapPin, Users, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import type { ExcelMP } from '@/lib/excel-mps'
import { PageHeader } from '@/components/organisms/PageHeader'
import { Chip } from '@/components/atoms/Chip'

const NepalMap = dynamic(() => import('@/components/map/NepalMap'), { ssr: false })

const PROVINCES = [
  'All Provinces', 'Koshi', 'Madhesh', 'Bagmati', 'Gandaki',
  'Lumbini', 'Karnali', 'Sudurpashchim', 'National'
]
const PARTIES = ['All Parties', 'RSP', 'NC', 'UML', 'MAOIST', 'RPP', 'JSP', 'CPNUS', 'Other']
const TYPES   = ['All Types', 'FPTP', 'PR']

function MPCard({ mp, onClose }: { mp: ExcelMP; onClose: () => void }) {
  const genderIcon = mp.gender === 'Female' ? '♀' : mp.gender === 'Male' ? '♂' : '⚥'
  return (
    <div className="ledger-container animate-fade-up" style={{
      borderTop: `3px solid ${mp.color}`,
      padding: '1.25rem',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          {/* Party badge */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.625rem', flexWrap: 'wrap' }}>
            <span style={{
              padding: '0.2rem 0.5rem', borderRadius: 4, fontSize: '0.68rem', fontWeight: 800,
              background: mp.color + '22', color: mp.color, letterSpacing: '0.06em',
            }}>{mp.partyShort}</span>
            <Chip variant={mp.electionType === 'FPTP' ? 'ok' : 'warn'}>
              {mp.electionType}
            </Chip>
            <Chip variant="muted">{genderIcon} {mp.gender}</Chip>
          </div>

          {/* Name */}
          <div style={{ fontWeight: 800, fontSize: '1.0625rem', color: 'var(--text)', marginBottom: '0.25rem' }}>
            {mp.name}
          </div>

          {/* Party full */}
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            {mp.party}
          </div>

          {/* Location */}
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span><MapPin size={11} style={{ display: 'inline', marginRight: 3 }} />{mp.district}</span>
            <span>Province: <strong style={{ color: 'var(--text)', fontWeight: 600 }}>{mp.province}</strong></span>
          </div>

          {mp.inclusiveGroup && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Inclusive quota: <span style={{ color: 'var(--text-accent)' }}>{mp.inclusiveGroup}</span>
            </div>
          )}
        </div>

        <button onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
          aria-label="Close">
          <X size={18} />
        </button>
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
  const [activePin, setActivePin] = useState<{lat: number, lng: number} | null>(null)

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

  const listFiltered = useMemo(() => {
    if (!activePin) return filtered
    return filtered.filter(mp => mp.lat === activePin.lat && mp.lng === activePin.lng)
  }, [filtered, activePin])

  const togglePin = (pin: {lat: number, lng: number} | null) => {
    setActivePin(prev => {
      if (prev && pin && prev.lat === pin.lat && prev.lng === pin.lng) {
        return null
      }
      return pin
    })
  }

  // Stats
  const female  = filtered.filter(m => m.gender === 'Female').length
  const fptp    = filtered.filter(m => m.electionType === 'FPTP').length
  const parties = [...new Set(filtered.map(m => m.partyShort))].length

  return (
    <div className="page-container animate-fade-up">
      <PageHeader 
        label="Electoral Map" 
        title="Find My MP" 
        subtitle="Explore the 275 elected members of the House of Representatives geographically." 
        meta="Source: Nepal_House_of_Representatives_2082_Members.xlsx" 
      />

      {/* Filters & Stats section */}
      <div style={{ marginTop: '2rem' }}>
        <div className="ledger-container" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 220px' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or district…"
              style={{
                width: '100%', paddingLeft: 32, paddingRight: 12, height: 36,
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 4, color: 'var(--text)', fontSize: '0.85rem',
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
                height: 36, padding: '0 10px', background: 'var(--bg)',
                border: '1px solid var(--border)', borderRadius: 4,
                color: 'var(--text)', fontSize: '0.8rem', cursor: 'pointer',
              }}>
              {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ))}

          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            {filtered.length} MPs shown
          </span>
        </div>

        {/* Summary stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Matched',   val: filtered.length },
            { label: 'Female',    val: female },
            { label: 'FPTP Seats',val: fptp },
            { label: 'Parties',   val: parties },
          ].map(s => (
            <div key={s.label} className="ledger-container" style={{ padding: '1rem', background: 'var(--bg-accent)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text)', marginTop: '0.25rem' }}>{s.val}</div>
            </div>
          ))}
        </div>
        
        {/* Map + List two-column */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 350px) 1fr', gap: '1.5rem', alignItems: 'start' }}>
          
          {/* List panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: 600 }}>
            {selected && (
              <div style={{ flexShrink: 0 }}>
                <MPCard mp={selected} onClose={() => setSelected(null)} />
              </div>
            )}

            {activePin && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--bg-accent)', borderRadius: 4, fontSize: '0.8rem', color: 'var(--text-accent)' }}>
                <span>Showing only MPs from selected location on map</span>
                <button onClick={() => setActivePin(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', textDecoration: 'underline' }}>Clear Map Filter</button>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
              {!loading && listFiltered.slice(0, 60).map(mp => (
              <div key={mp.id}
                onClick={() => setSelected(mp)}
                className="ledger-container"
                style={{
                  padding: '0.75rem 1rem', cursor: 'pointer',
                  background: selected?.id === mp.id ? 'var(--bg-accent)' : 'var(--bg)',
                  borderColor: selected?.id === mp.id ? mp.color : 'var(--border)',
                  transition: 'all 150ms',
                  display: 'flex', gap: '0.75rem', alignItems: 'center',
                }}
              >
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: mp.color,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {mp.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                    {mp.district} · {mp.partyShort} · {mp.electionType}
                    {mp.gender === 'Female' && <span style={{ color: 'var(--text-muted)', marginLeft: 4 }}>♀</span>}
                  </div>
                </div>
              </div>
            ))}

            {!loading && listFiltered.length > 60 && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
                + {listFiltered.length - 60} more · refine filters to narrow results
              </div>
            )}

            {!loading && listFiltered.length === 0 && (
              <div className="ledger-container" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Users size={24} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                <div>No MPs match your filters</div>
              </div>
            )}
            </div>
          </div>

          {/* Map */}
          <div className="ledger-container" style={{ padding: 0, overflow: 'hidden', height: 600, position: 'sticky', top: '2rem' }}>
            {loading ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                Loading map…
              </div>
            ) : (
              <NepalMap mps={filtered} selectedMP={selected} activePin={activePin} onSelectPin={togglePin} />
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

