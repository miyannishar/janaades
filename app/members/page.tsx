'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, ExternalLink, Users, ArrowUpDown } from 'lucide-react'
import { PageHeader } from '@/components/organisms/PageHeader'
import type { ExcelMP } from '@/lib/excel-mps'

// ─── Party config ────────────────────────────────────────────────────────────
const PARTY_COLORS: Record<string, string> = {
  RSP: '#6366f1', NC: '#3b82f6', UML: '#ef4444',
  MAOIST: '#dc2626', RPP: '#f97316', JSP: '#10b981',
  CPNUS: '#f59e0b', NMKP: '#8b5cf6',
}
function partyColor(short: string) { return PARTY_COLORS[short] ?? '#6b7280' }

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
    <div className="page-container animate-fade-up">
      <PageHeader
        label="House of Representatives"
        title="सांसद सूची"
        subtitle="275 Elected Members"
        meta="Source: Nepal House of Representatives 2082"
      />

      <div className="sidebar-grid">
        
        {/* Left Column: Stats & Filters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Quick Stats */}
          <div>
            <h3 className="heading-sm" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Composition</h3>
            <table className="data-table">
              <tbody>
                <tr>
                   <td style={{ fontWeight: 600 }}>Total</td>
                   <td style={{ textAlign: 'right' }}>275</td>
                </tr>
                <tr>
                   <td style={{ fontWeight: 600 }}>Women</td>
                   <td style={{ textAlign: 'right' }}>{femaleCount} ({Math.round(femaleCount / 275 * 100)}%)</td>
                </tr>
                <tr>
                   <td style={{ fontWeight: 600 }}>PR Appointees</td>
                   <td style={{ textAlign: 'right' }}>{prCount}</td>
                </tr>
                <tr>
                   <td style={{ fontWeight: 600 }}>FPTP Elected</td>
                   <td style={{ textAlign: 'right' }}>{fptpCount}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Filters */}
          <div>
            <h3 className="heading-sm" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Filter Registry</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input
                  type="text"
                  className="input"
                  placeholder="Search name or district..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border)', fontSize: '0.85rem' }}
              />
              {[
                  { val: province, set: setProvince, opts: PROVINCES },
                  { val: partyF,   set: setPartyF,   opts: partyOptions },
                  { val: typeF,    set: setTypeF,    opts: TYPES },
                  { val: genderF,  set: setGenderF,  opts: ['All Genders', 'Male', 'Female'] },
                ].map((f, i) => (
                  <select key={i} value={f.val} onChange={e => f.set(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border)', fontSize: '0.85rem', background: 'transparent' }}>
                    {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
              ))}
            </div>
          </div>
          
          {/* Party Composition Bar */}
          <div>
             <h3 className="heading-sm" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Party Distribution</h3>
             <div style={{ height: '8px', display: 'flex', marginBottom: '1rem' }}>
                {partyCounts.map(([short, count]) => (
                  <div key={short} style={{ width: `${(count / 275) * 100}%`, background: partyColor(short) }} title={`${short}: ${count}`} />
                ))}
             </div>
             <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {partyCounts.map(([short, count]) => (
                   <div key={short} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                         <div style={{ width: 8, height: 8, background: partyColor(short) }} />
                         <span>{short}</span>
                      </div>
                      <span className="text-muted">{count}</span>
                   </div>
                ))}
             </div>
          </div>

        </div>

        {/* Right Column: Ledger (Data Table) */}
        <div className="ledger-container">
          <div className="ledger-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="heading-md">Registry Output</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{filtered.length} matching</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <Th col="id" label="ID" />
                  <Th col="name" label="Representative" />
                  <Th col="district" label="District" />
                  <Th col="party" label="Party" />
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem' }}>Loading registry...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No records match criteria.</td></tr>
                ) : (
                  filtered.map(mp => {
                    const color = partyColor(mp.partyShort)
                    return (
                      <tr key={mp.id}>
                        <td style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-muted)' }}>#{mp.id}</td>
                        <td style={{ fontWeight: 600 }}>{mp.name}</td>
                        <td>{mp.district}</td>
                        <td>
                           <span style={{ color }}>{mp.partyShort}</span>
                        </td>
                        <td>
                           <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                              {mp.electionType} · {mp.gender.charAt(0)} · {mp.province}
                           </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
