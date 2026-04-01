'use client'

import { useEffect, useRef, useCallback } from 'react'
import type { ExcelMP } from '@/lib/excel-mps'

interface MPMapProps {
  mps: ExcelMP[]
  selectedMP: ExcelMP | null
  onSelectDistrict: (mps: ExcelMP[], district: string) => void
}

const PROVINCE_CENTERS: Record<string, [number, number, string]> = {
  Koshi:          [27.33, 87.30, 'Koshi'],
  Madhesh:        [26.75, 85.60, 'Madhesh'],
  Bagmati:        [27.70, 85.32, 'Bagmati'],
  Gandaki:        [28.20, 84.00, 'Gandaki'],
  Lumbini:        [27.60, 83.00, 'Lumbini'],
  Karnali:        [29.00, 82.40, 'Karnali'],
  Sudurpashchim:  [29.30, 81.00, 'Sudurpashchim'],
}

export default function MPMap({ mps, selectedMP, onSelectDistrict }: MPMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<any>(null)
  const markersRef   = useRef<any[]>([])
  const initDone     = useRef(false)

  // Keep a stable ref to onSelectDistrict so markers don't re-bind on every render
  const onSelectRef = useRef(onSelectDistrict)
  useEffect(() => { onSelectRef.current = onSelectDistrict }, [onSelectDistrict])

  // ── Draw / update markers (runs after map is ready) ───────────────────────
  const drawMarkers = useCallback((L: any, map: any) => {
    // Clear old markers
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    // Group MPs by district
    const districtMap = new Map<string, ExcelMP[]>()
    mps.forEach(mp => {
      if (mp.lat == null || mp.lng == null) return
      if (!districtMap.has(mp.district)) districtMap.set(mp.district, [])
      districtMap.get(mp.district)!.push(mp)
    })

    districtMap.forEach((dMps, district) => {
      const lat        = dMps[0].lat!
      const lng        = dMps[0].lng!
      const isSelected = dMps.some(m => m.id === selectedMP?.id)

      // Dominant party colour
      const partyCounts = new Map<string, number>()
      dMps.forEach(m => partyCounts.set(m.color, (partyCounts.get(m.color) ?? 0) + 1))
      const domColor = [...partyCounts.entries()].sort((a, b) => b[1] - a[1])[0][0]

      const size = isSelected ? 20 : Math.min(8 + dMps.length * 2, 16)
      const glow = isSelected
        ? `0 0 0 3px rgba(255,255,255,0.3), 0 0 12px ${domColor}, 0 0 24px ${domColor}66`
        : `0 0 4px ${domColor}88`

      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width:${size}px;height:${size}px;border-radius:50%;
          background:${domColor};
          border:${isSelected ? 3 : 2}px solid rgba(255,255,255,${isSelected ? .95 : .40});
          box-shadow:${glow};
          cursor:pointer;
          transition:all 200ms;
          display:flex;align-items:center;justify-content:center;
          font:800 ${size > 12 ? 9 : 0}px Inter;color:#fff;
        ">${dMps.length > 1 ? dMps.length : ''}</div>`,
        iconAnchor: [size / 2, size / 2],
      })

      // Popup HTML (always dark — matches the map tile)
      const partyList = [...new Map(dMps.map(m => [m.partyShort, m.color])).entries()]
        .map(([p, c]) => `<span style="font-weight:800;color:${c}">${p}</span>`)
        .join(' · ')

      const mpListHtml = dMps.slice(0, 6).map(m =>
        `<div style="padding:3px 0;border-bottom:1px solid #1e2a45;font-size:11px;cursor:pointer"
              class="mp-popup-row" data-id="${m.id}">
          <span style="font-weight:700;color:#e2e8f0">${m.name}</span>
          <span style="color:${m.color};margin-left:6px">${m.partyShort}</span>
          <span style="color:#64748b;margin-left:6px">${m.electionType}</span>
          ${m.gender === 'Female' ? '<span style="color:#10b981;margin-left:4px">♀</span>' : ''}
        </div>`
      ).join('')

      const popup = `
        <div style="font-family:Inter,sans-serif;background:#0e1322;border-radius:6px;min-width:180px;max-width:250px;">
          <div style="padding:8px 10px;border-bottom:1px solid #1e2a45">
            <div style="font-weight:800;font-size:13px;color:#e2e8f0">${district}</div>
            <div style="font-size:11px;margin-top:2px">${partyList}</div>
            <div style="font-size:10px;color:#64748b;margin-top:1px">${dMps.length} MP${dMps.length > 1 ? 's' : ''} — click a name to select</div>
          </div>
          <div style="padding:6px 10px" id="mp-list-${district.replace(/\s/g,'_')}">${mpListHtml}</div>
          ${dMps.length > 6 ? `<div style="padding:4px 10px 8px;font-size:10px;color:#64748b">+${dMps.length - 6} more</div>` : ''}
        </div>`

      const marker = L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup(popup, { maxWidth: 270, className: 'mp-popup' })

      // When marker is clicked: show all MPs of this district + open popup
      marker.on('click', () => {
        onSelectRef.current(dMps, district)
      })

      // When popup opens: wire up row clicks for multi-MP districts
      marker.on('popupopen', () => {
        const container = marker.getPopup()?.getElement()
        if (!container) return
        ;(container as Element).querySelectorAll<HTMLElement>('.mp-popup-row').forEach(row => {
          row.style.cursor = 'pointer'
          row.addEventListener('click', () => {
            onSelectRef.current(dMps, district)
          })
        })
      })

      markersRef.current.push(marker)
    })
  }, [mps, selectedMP])

  // ── Main effect: init map on first run, then always redraw markers ─────────
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return

    import('leaflet').then(L => {
      if (!containerRef.current) return

      // Initialise map only once
      if (!mapRef.current) {
        const map = L.map(containerRef.current, {
          center: [28.2, 84.0],
          zoom: 6,
          zoomControl: true,
          attributionControl: false,
        })
        mapRef.current = map

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          subdomains: 'abcd', maxZoom: 19,
        }).addTo(map)

        // Province labels
        Object.values(PROVINCE_CENTERS).forEach(([lat, lng, label]) => {
          L.marker([lat, lng], {
            icon: L.divIcon({
              className: '',
              html: `<div style="font:700 9px/1 Inter,sans-serif;color:#6366f133;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;">${label}</div>`,
              iconAnchor: [28, 6],
            })
          }).addTo(map)
        })
      }

      // Always redraw markers (handles first load + selection changes)
      drawMarkers(L, mapRef.current)
    })
  }, [drawMarkers]) // drawMarkers already captures mps + selectedMP via useCallback

  // ── Fly to selected MP on the map ─────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !selectedMP?.lat || !selectedMP?.lng) return
    mapRef.current.flyTo([selectedMP.lat, selectedMP.lng], 9, { duration: 0.8 })
  }, [selectedMP])

  // ── Cleanup on unmount ─────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
      markersRef.current = []
    }
  }, [])

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>{`
        .leaflet-popup-content-wrapper {
          background: #0e1322 !important;
          border: 1px solid #1e2a45 !important;
          border-radius: 8px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.6) !important;
          padding: 0 !important;
          overflow: hidden;
        }
        .leaflet-popup-content { margin: 0 !important; }
        .leaflet-popup-tip { background: #0e1322 !important; }
        .leaflet-popup-close-button { color: #64748b !important; top: 6px !important; right: 8px !important; }
        .mp-popup-row:hover { background: rgba(99,102,241,0.12) !important; border-radius: 3px; }
      `}</style>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </>
  )
}
