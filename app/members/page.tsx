'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, ExternalLink, Users, ArrowUpDown } from 'lucide-react'
import type { ExcelMP } from '@/lib/excel-mps'

// ─── Party config ────────────────────────────────────────────────────────────
const PARTY_COLORS: Record<string, string> = {
  RSP: '#6366f1', NC: '#3b82f6', UML: '#ef4444',
  MAOIST: '#dc2626', RPP: '#f97316', JSP: '#10b981',
  CPNUS: '#f59e0b', NMKP: '#8b5cf6',
}
function partyColor(short: string) { return PARTY_COLORS[short] ?? '#6b7280' }

// ─── Composed party seat counts from Excel ───────────────────────────────────
const PARTY_SEATS_COMPUTED: Record<string, number> = {}  // filled client-side

// ─── Province seat counts (official) ────────────────────────────────────────
const PROVINCE_SEATS: Record<string, number> = {
  Koshi: 28, Madhesh: 32, Bagmati: 44, Gandaki: 25,
  Lumbini: 38, Karnali: 16, Sudurpashchim: 22, 'PR (Nationwide)': 70,
}

const PROVINCES = [
  'All Provinces', 'Koshi', 'Madhesh', 'Bagmati', 'Gandaki',
  'Lumbini', 'Karnali', 'Sudurpashchim', 'National',
]
const TYPES = ['All Types', 'FPTP', 'PR']

type SortKey = 'id' | 'name' | 'district' | 'party' | 'province'

export default function MembersPage() {
  const [mps, setMps]         = useState<ExcelMP[]>([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [province, setProvince] = useState('All Provinces')
  const [partyF,   setPartyF]   = useState('All Parties')
  const [typeF,    setTypeF]    = useState('All Types')
  const [genderF,  setGenderF]  = useState('All Genders')
  const [sortBy,   setSortBy]   = useState<SortKey>('id')
  const [sortDir,  setSortDir]  = useState<1 | -1>(1)

  useEffect(() => {
    import('@/lib/mps-excel.json').then(m => {
      setMps(m.default as ExcelMP[])
      setLoading(false)
    })
  }, [])

  // Derived party list for filter dropdown
  const partyOptions = useMemo(() => {
    const shorts = [...new Set(mps.map(m => m.partyShort))].sort()
    return ['All Parties', ...shorts]
  }, [mps])

  // Derived party counts for composition bar
  const partyCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    mps.forEach(m => { counts[m.partyShort] = (counts[m.partyShort] ?? 0) + 1 })
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [mps])

  function toggleSort(col: SortKey) {
    if (sortBy === col) setSortDir(d => d === 1 ? -1 : 1)
    else { setSortBy(col); setSortDir(1) }
  }
  function sortIcon(col: SortKey) {
    if (sortBy !== col) return <ArrowUpDown size={10} style={{ opacity: 0.3 }} />
    return <span style={{ fontSize: '0.65rem' }}>{sortDir === 1 ? '↑' : '↓'}</span>
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return mps
      .filter(mp => {
        if (province !== 'All Provinces' && mp.province !== province) return false
        if (partyF   !== 'All Parties'   && mp.partyShort !== partyF) return false
        if (typeF    !== 'All Types'     && mp.electionType !== typeF) return false
        if (genderF  !== 'All Genders'   && mp.gender !== genderF)    return false
        if (q && !mp.name.toLowerCase().includes(q) && !mp.district.toLowerCase().includes(q)
                && !mp.party.toLowerCase().includes(q)) return false
        return true
      })
      .sort((a, b) => {
        let av: string | number, bv: string | number
        switch (sortBy) {
          case 'name':     av = a.name;     bv = b.name;     break
          case 'district': av = a.district; bv = b.district; break
          case 'party':    av = a.partyShort; bv = b.partyShort; break
          case 'province': av = a.province; bv = b.province; break
          default:         av = parseInt(a.id); bv = parseInt(b.id)
        }
        if (typeof av === 'string') return av.localeCompare(bv as string) * sortDir
        return ((av as number) - (bv as number)) * sortDir
      })
  }, [mps, search, province, partyF, typeF, genderF, sortBy, sortDir])

  const femaleCount = useMemo(() => mps.filter(m => m.gender === 'Female').length, [mps])
  const prCount     = useMemo(() => mps.filter(m => m.electionType === 'PR').length, [mps])
  const fptpCount   = useMemo(() => mps.filter(m => m.electionType === 'FPTP').length, [mps])

  const Th = ({ col, label }: { col: SortKey; label: string }) => (
    <th onClick={() => toggleSort(col)} style={{ cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>{label} {sortIcon(col)}</span>
    </th>
  )

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="heading-xl">
            <span className="font-deva" style={{ marginRight: '0.5rem' }}>सांसद सूची</span>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: '1.25rem' }}>/ Members of Parliament</span>
          </h1>
          <p className="text-secondary" style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
            275 elected members · Pratinidhi Sabha 2082 B.S. · Source: Nepal_House_of_Representatives_2082_Members.xlsx
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <a href="https://hr.parliament.gov.np" target="_blank" rel="noopener" className="btn-ghost">
            Official Source <ExternalLink size={12} />
          </a>
        </div>
      </div>

      <div className="page-container">

        {/* Party Composition Bar */}
        <div className="card animate-fade-up" style={{ marginBottom: '1rem', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div className="section-label">Party Seat Distribution — 275 Seats Total</div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {partyCounts.map(([short, count]) => (
                <div key={short} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem' }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: partyColor(short) }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{short}</span>
                  <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{count}</span>
                  <span style={{ color: 'var(--text-muted)' }}>({Math.round(count / 275 * 100)}%)</span>
                </div>
              ))}
            </div>
          </div>
          {/* Stacked bar */}
          <div style={{ height: 10, borderRadius: 5, display: 'flex', overflow: 'hidden', gap: 1 }}>
            {partyCounts.map(([short, count]) => (
              <div key={short} style={{ width: `${(count / 275) * 100}%`, background: partyColor(short) }}
                title={`${short}: ${count}`} />
            ))}
          </div>
          {/* Province breakdown */}
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.875rem', flexWrap: 'wrap' }}>
            {Object.entries(PROVINCE_SEATS).map(([prov, seats]) => (
              <div key={prov} style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--text-muted)', marginRight: '0.25rem' }}>{prov}:</span>
                <strong style={{ color: 'var(--text-primary)' }}>{seats}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem', marginBottom: '1rem' }}
          className="stagger">
          {[
            { label: 'Total MPs',  value: 275,       color: 'var(--indigo)' },
            { label: 'Women MPs',  value: `${femaleCount} (${Math.round(femaleCount / 275 * 100)}%)`, color: 'var(--text-accent)' },
            { label: 'PR Seats',   value: prCount,   color: 'var(--amber)' },
            { label: 'FPTP Seats', value: fptpCount, color: 'var(--emerald)' },
          ].map(s => (
            <div key={s.label} className="card animate-fade-up" style={{ padding: '0.875rem 1rem' }}>
              <div className="section-label">{s.label}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: s.color, marginTop: '0.25rem', fontVariantNumeric: 'tabular-nums' }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="card animate-fade-up" style={{ padding: '0.75rem 1rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 160 }}>
              <Search size={13} style={{ position: 'absolute', left: '0.625rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                className="input"
                placeholder="Search by name, district, or party…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: '2rem' }}
              />
            </div>
            {[
              { val: province, set: setProvince, opts: PROVINCES },
              { val: partyF,   set: setPartyF,   opts: partyOptions },
              { val: typeF,    set: setTypeF,    opts: TYPES },
              { val: genderF,  set: setGenderF,  opts: ['All Genders', 'Male', 'Female'] },
            ].map((f, i) => (
              <select key={i} className="input select" value={f.val} onChange={e => f.set(e.target.value)}
                style={{ flex: '0 0 auto', width: 'auto', minWidth: 130 }}>
                {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ))}
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto', flexShrink: 0 }}>
              {filtered.length} of 275 shown
            </span>
          </div>
        </div>

        {/* Data Table */}
        <div className="card animate-fade-up" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Users size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
              <div>Loading MPs…</div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <Th col="id" label="#" />
                    <Th col="name" label="Name" />
                    <Th col="district" label="District" />
                    <Th col="party" label="Party" />
                    <th>Type</th>
                    <th>Gender</th>
                    <Th col="province" label="Province" />
                    <th>Inclusive Group</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(mp => {
                    const color = partyColor(mp.partyShort)
                    return (
                      <tr key={mp.id}>
                        <td>
                          <span style={{ fontWeight: 700, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums', fontSize: '0.75rem' }}>
                            {mp.id}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.8125rem' }}>
                            {mp.name}
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {mp.district}
                          </span>
                        </td>
                        <td>
                          <span style={{
                            padding: '0.2rem 0.45rem', borderRadius: 4, fontSize: '0.68rem', fontWeight: 800,
                            background: color + '22', color,
                            letterSpacing: '0.05em', display: 'inline-block', maxWidth: 80,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {mp.partyShort}
                          </span>
                        </td>
                        <td>
                          <span className={`chip ${mp.electionType === 'FPTP' ? 'chip-indigo' : 'chip-muted'}`}>
                            {mp.electionType}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.75rem', color: mp.gender === 'Female' ? 'var(--text-accent)' : 'var(--text-muted)' }}>
                            {mp.gender === 'Female' ? '♀ Female' : '♂ Male'}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{mp.province}</span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            {mp.inclusiveGroup ?? '—'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Users size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
                  <div>No MPs match your filters</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Source note */}
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
          Data source:{' '}
          <span style={{ color: 'var(--text-accent)' }}>Nepal_House_of_Representatives_2082_Members.xlsx</span>
          {' '}· Showing all 275 members from the official parliamentary register
        </p>
      </div>
    </div>
  )
}
