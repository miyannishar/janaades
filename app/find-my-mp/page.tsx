'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { Search, MapPin, Users, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import type { ExcelMP } from '@/lib/excel-mps'

const MPMap = dynamic(() => import('@/components/map/MPMap'), { ssr: false })

const PROVINCES = [
  'All Provinces', 'Koshi', 'Madhesh', 'Bagmati', 'Gandaki',
  'Lumbini', 'Karnali', 'Sudurpashchim', 'National'
]
const PARTIES = ['All Parties', 'RSP', 'NC', 'UML', 'MAOIST', 'RPP', 'JSP', 'CPNUS', 'Other']
const TYPES   = ['All Types', 'FPTP', 'PR']

/* ── Compact MP row inside the district panel ─────────────── */
function DistrictMPRow({ mp }: { mp: ExcelMP }) {
  const genderIcon = mp.gender === 'Female' ? '♀' : mp.gender === 'Male' ? '♂' : '⚥'
  return (
    <div style={{
      display: 'flex', gap: '0.75rem', alignItems: 'center',
      padding: '0.625rem 1rem',
      borderBottom: '1px solid var(--border)',
      transition: 'background 150ms',
    }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-3)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {/* Party colour dot */}
      <div style={{
        width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
        background: mp.color,
        boxShadow: `0 0 6px ${mp.color}66`,
      }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontWeight: 700, fontSize: '0.8125rem',
          color: 'var(--text-primary)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {mp.name}
          {mp.gender === 'Female' && (
            <span style={{ color: 'var(--emerald)', marginLeft: 5, fontSize: '0.7rem' }}>♀</span>
          )}
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 1 }}>
          {mp.party}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0, alignItems: 'center' }}>
        <span style={{
          padding: '1px 6px', borderRadius: 4, fontSize: '0.6rem', fontWeight: 800,
          background: mp.color + '22', color: mp.color, letterSpacing: '0.05em',
        }}>{mp.partyShort}</span>
        <span style={{
          padding: '1px 5px', borderRadius: 4, fontSize: '0.6rem', fontWeight: 700,
          background: mp.electionType === 'FPTP' ? 'var(--emerald-soft)' : 'var(--amber-soft)',
          color: mp.electionType === 'FPTP' ? 'var(--emerald)' : 'var(--amber)',
        }}>{mp.electionType}</span>
      </div>
    </div>
  )
}

/* ── District panel shown when a pin is clicked ───────────── */
function DistrictPanel({
  district, mps, onClose,
}: {
  district: string; mps: ExcelMP[]; onClose: () => void
}) {
  // Party breakdown
  const partyGroups = useMemo(() => {
    const map = new Map<string, { color: string; count: number }>()
    mps.forEach(m => {
      const e = map.get(m.partyShort) ?? { color: m.color, count: 0 }
      map.set(m.partyShort, { ...e, count: e.count + 1 })
    })
    return [...map.entries()].sort((a, b) => b[1].count - a[1].count)
  }, [mps])

  const female = mps.filter(m => m.gender === 'Female').length

  return (
    <div className="card animate-fade-up" style={{
      padding: 0, overflow: 'hidden',
      border: '1px solid var(--border-accent)',
    }}>
      {/* Header */}
      <div style={{
        padding: '0.875rem 1rem',
        background: 'var(--surface-3)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
      }}>
        <MapPin size={14} style={{ color: 'var(--indigo)', marginTop: 2, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
            {district}
          </div>
          {/* Province */}
          {mps[0]?.province && (
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 1 }}>
              {mps[0].province} Province
            </div>
          )}
          {/* Party chips */}
          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            {partyGroups.map(([party, { color, count }]) => (
              <span key={party} style={{
                padding: '1px 7px', borderRadius: 99, fontSize: '0.62rem', fontWeight: 800,
                background: color + '20', color,
                border: `1px solid ${color}33`,
              }}>
                {party} {count > 1 ? `×${count}` : ''}
              </span>
            ))}
            {female > 0 && (
              <span style={{
                padding: '1px 7px', borderRadius: 99, fontSize: '0.62rem', fontWeight: 700,
                background: 'var(--emerald-soft)', color: 'var(--emerald)',
              }}>
                ♀ {female}
              </span>
            )}
          </div>
        </div>

        {/* MP count badge */}
        <div style={{
          fontSize: '1.5rem', fontWeight: 900, color: 'var(--indigo)',
          lineHeight: 1, flexShrink: 0,
        }}>
          {mps.length}
          <div style={{ fontSize: '0.55rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center' }}>
            MP{mps.length > 1 ? 's' : ''}
          </div>
        </div>

        <button onClick={onClose} aria-label="Close district"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px', flexShrink: 0 }}>
          <X size={15} />
        </button>
      </div>

      {/* MP list */}
      <div style={{ maxHeight: 320, overflowY: 'auto' }}>
        {mps.map(mp => <DistrictMPRow key={mp.id} mp={mp} />)}
      </div>
    </div>
  )
}

/* ── Main page ────────────────────────────────────────────── */
export default function FindMyMPPage() {
  const [mps, setMps]     = useState<ExcelMP[]>([])
  const [loading, setLoading] = useState(true)

  // Pin-click state: shows the district panel
  const [pinnedDistrict, setPinnedDistrict] = useState<{ name: string; mps: ExcelMP[] } | null>(null)
  // List-click state: highlights a single MP on the map
  const [highlighted, setHighlighted] = useState<ExcelMP | null>(null)

  const [search, setSearch]   = useState('')
  const [province, setProvince] = useState('All Provinces')
  const [party, setParty]     = useState('All Parties')
  const [type, setType]       = useState('All Types')

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

  const female  = filtered.filter(m => m.gender === 'Female').length
  const fptp    = filtered.filter(m => m.electionType === 'FPTP').length
  const parties = [...new Set(filtered.map(m => m.partyShort))].length

  // When pin is clicked: show district panel — does NOT touch search/filters
  const handleSelectDistrict = (dMps: ExcelMP[], districtName: string) => {
    setPinnedDistrict({ name: districtName, mps: dMps })
    setHighlighted(dMps[0])
  }

  // When list row is clicked: highlight that MP on the map
  const handleListClick = (mp: ExcelMP) => {
    setHighlighted(mp)
  }

  const clearPin = () => {
    setPinnedDistrict(null)
    setHighlighted(null)
  }

  // Map always sees the full filtered set (all pins stay visible)
  // List shows only the pinned district's MPs when a pin is active
  const listMps = pinnedDistrict
    ? filtered.filter(mp => mp.district === pinnedDistrict.name)
    : filtered

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="heading-xl">
            <span className="font-deva" style={{ marginRight: '0.5rem' }}>मेरो सांसद</span>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: '1.25rem' }}>/ Find My MP</span>
          </h1>
          <p className="text-secondary" style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
            275 elected members · Click any map pin to see all MPs of that district
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
            {pinnedDistrict && (
              <button onClick={clearPin} style={{
                display: 'flex', alignItems: 'center', gap: '0.3rem',
                padding: '2px 8px', borderRadius: 99, fontSize: '0.7rem', fontWeight: 700,
                background: 'var(--indigo-soft)', border: '1px solid var(--border-accent)',
                color: 'var(--text-accent)', cursor: 'pointer',
              }}>
                <X size={10} /> {pinnedDistrict.name}
              </button>
            )}
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {filtered.length} MPs · {listMps.length} in list
            </span>
          </div>
        </div>

        {/* Summary stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
          {[
            { label: 'Matched',    val: filtered.length, color: 'var(--indigo)' },
            { label: 'Female',     val: female,           color: 'var(--emerald)' },
            { label: 'FPTP Seats', val: fptp,             color: 'var(--amber)' },
            { label: 'Parties',    val: parties,          color: 'var(--text-accent)' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: '0.75rem 1rem' }}>
              <div className="section-label">{s.label}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: s.color, fontVariantNumeric: 'tabular-nums' }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Map + right panel */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1rem', alignItems: 'start' }}>

          {/* Map */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', height: 520, position: 'sticky', top: 'calc(var(--ticker-h) + 1rem)' }}>
            {loading ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                Loading map…
              </div>
            ) : (
              <MPMap
                mps={filtered}
                selectedMP={highlighted}
                onSelectDistrict={handleSelectDistrict}
              />
            )}
          </div>

          {/* Right panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 520, overflowY: 'auto' }}>

            {/* District panel — shown when pin is clicked */}
            {pinnedDistrict && (
              <DistrictPanel
                district={pinnedDistrict.name}
                mps={pinnedDistrict.mps}
                onClose={clearPin}
              />
            )}

            {/* Hint when nothing pinned */}
            {!pinnedDistrict && !loading && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.625rem 0.875rem',
                background: 'var(--indigo-soft)',
                border: '1px solid var(--border-accent)',
                borderRadius: 8, fontSize: '0.75rem', color: 'var(--text-accent)',
              }}>
                <MapPin size={12} style={{ flexShrink: 0 }} />
                Click any map pin to see all MPs of that district
              </div>
            )}

            {/* Divider */}
            {pinnedDistrict && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.125rem 0.25rem',
              }}>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {pinnedDistrict.name} MPs
                </span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>
            )}

            {/* Full MP list — filtered to district when pin is active */}
            {!loading && listMps.slice(0, 60).map(mp => (
              <div key={mp.id}
                onClick={() => handleListClick(mp)}
                style={{
                  padding: '0.625rem 0.875rem', cursor: 'pointer',
                  background: highlighted?.id === mp.id ? 'var(--surface-3)' : 'var(--surface-2)',
                  border: `1px solid ${highlighted?.id === mp.id ? mp.color : 'var(--border)'}`,
                  borderRadius: 8, transition: 'all 150ms',
                  display: 'flex', gap: '0.625rem', alignItems: 'center',
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: mp.color }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {mp.name}
                    {mp.gender === 'Female' && <span style={{ color: 'var(--emerald)', marginLeft: 4 }}>♀</span>}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {mp.district} · {mp.partyShort} · {mp.electionType}
                  </div>
                </div>
              </div>
            ))}

            {!loading && listMps.length > 60 && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0.5rem' }}>
                + {listMps.length - 60} more · refine filters to narrow results
              </div>
            )}

            {!loading && listMps.length === 0 && (
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
