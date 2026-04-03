'use client'

import { useEffect, useRef } from 'react'
import type { ExcelMP } from '@/lib/excel-mps'

interface NepalMapProps {
  mps: ExcelMP[]
  selectedMP: ExcelMP | null
  activePin: { lat: number; lng: number } | null
  onSelectPin: (pin: { lat: number; lng: number } | null) => void
}

// Province bounding boxes (simplified for display)
const PROVINCE_CENTERS: Record<string, { lat: number; lng: number; label: string }> = {
  Koshi:         { lat: 27.33, lng: 87.30, label: 'Koshi' },
  Madhesh:       { lat: 26.75, lng: 85.60, label: 'Madhesh' },
  Bagmati:       { lat: 27.70, lng: 85.32, label: 'Bagmati' },
  Gandaki:       { lat: 28.20, lng: 84.00, label: 'Gandaki' },
  Lumbini:       { lat: 27.60, lng: 83.00, label: 'Lumbini' },
  Karnali:       { lat: 29.00, lng: 82.40, label: 'Karnali' },
  Sudurpashchim: { lat: 29.30, lng: 81.00, label: 'Sudurpashchim' },
}

export default function NepalMap({ mps, selectedMP, activePin, onSelectPin }: NepalMapProps) {
  const mapRef = useRef<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return
    if (mapRef.current) return // prevent double init

    let map: any = null

    // Dynamic import to avoid SSR issues
    import('leaflet').then(L => {
      if (!mapContainerRef.current || mapRef.current) return // guard against race

      // Fix default marker icons
      const DefaultIcon = L.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
      })
      L.Marker.prototype.options.icon = DefaultIcon

      map = L.map(mapContainerRef.current!, {
        center: [28.394857, 84.124008],
        zoom: 7,
        zoomControl: true,
        attributionControl: true,
      })
      mapRef.current = map

      // Dark tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map)

      // Province labels
      Object.entries(PROVINCE_CENTERS).forEach(([province, { lat, lng, label }]) => {
        L.marker([lat, lng], {
          icon: L.divIcon({
            className: '',
            html: `<div style="font-family:Inter,sans-serif;font-size:10px;font-weight:700;color:#90cdff;letter-spacing:0.08em;text-transform:uppercase;white-space:nowrap;text-shadow:0 1px 4px #0b1326;">${label}</div>`,
            iconAnchor: [30, 8],
          })
        }).addTo(map)
      })

      // MP markers (Grouped by location)
      const groupedMps = new Map<string, ExcelMP[]>()
      mps.forEach(mp => {
        if (mp.lat === null || mp.lng === null) return
        const key = `${mp.lat},${mp.lng}`
        if (!groupedMps.has(key)) groupedMps.set(key, [])
        groupedMps.get(key)!.push(mp)
      })

      groupedMps.forEach((group) => {
        const mp = group[0]
        const isSelected = activePin ? (activePin.lat === mp.lat && activePin.lng === mp.lng) : (selectedMP && group.some(m => m.id === selectedMP.id))
        
        const partyCounts = new Map<string, number>()
        group.forEach(m => partyCounts.set(m.color, (partyCounts.get(m.color) ?? 0) + 1))
        const domColor = [...partyCounts.entries()].sort((a, b) => b[1] - a[1])[0][0]
        const color = isSelected ? '#DC2626' : domColor

        const size = isSelected ? 20 : Math.min(10 + group.length * 2, 24)

        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width:${size}px;height:${size}px;border-radius:50%;
            background:${color};
            border:2px solid rgba(255,255,255,0.4);
            box-shadow:0 0 6px ${color}88;
            cursor:pointer;
            display:flex;align-items:center;justify-content:center;
            font-family:Inter,sans-serif;font-size:10px;font-weight:bold;color:white;
            transition: all 150ms ease;
            ${isSelected ? 'transform: scale(1.3); z-index: 1000; border-color: white;' : 'transform: scale(1.0);'}
          ">${group.length > 1 ? group.length : ''}</div>`,
          iconAnchor: [size/2, size/2],
        })

        const marker = L.marker([mp.lat!, mp.lng!], { icon })
          .addTo(map)

        marker.on('click', () => {
          onSelectPin({ lat: mp.lat!, lng: mp.lng! })
        })

        markersRef.current.push({ marker, group })
      })
    })

    // Cleanup runs when component unmounts — outside .then() so it always fires
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
      markersRef.current = []
    }
  }, [mps]) // run again if mps list changes

  // Update marker styles when selection changes
  useEffect(() => {
    if (!mapRef.current || markersRef.current.length === 0) return
    import('leaflet').then(L => {
      markersRef.current.forEach(({ marker, group }) => {
        const mp = group[0]
        const isSelected = activePin ? (activePin.lat === mp.lat && activePin.lng === mp.lng) : (selectedMP && group.some((m: ExcelMP) => m.id === selectedMP.id))
        
        const partyCounts = new Map<string, number>()
        group.forEach((m: ExcelMP) => partyCounts.set(m.color, (partyCounts.get(m.color) ?? 0) + 1))
        const domColor = [...partyCounts.entries()].sort((a, b) => b[1] - a[1])[0][0]
        const color = isSelected ? '#DC2626' : domColor

        const size = isSelected ? 20 : Math.min(10 + group.length * 2, 24)

        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width:${size}px;height:${size}px;border-radius:50%;
            background:${color};
            border:2px solid rgba(255,255,255,0.4);
            box-shadow:0 0 6px ${color}88;
            cursor:pointer;
            display:flex;align-items:center;justify-content:center;
            font-family:Inter,sans-serif;font-size:10px;font-weight:bold;color:white;
            transition: all 150ms ease;
            ${isSelected ? 'transform: scale(1.3); z-index: 1000; border-color: white;' : 'transform: scale(1.0);'}
          ">${group.length > 1 ? group.length : ''}</div>`,
          iconAnchor: [size/2, size/2],
        })
        marker.setIcon(icon)

        if (isSelected) {
          marker.setZIndexOffset(1000)
        } else {
          marker.setZIndexOffset(0)
        }
      })
    })
  }, [selectedMP, activePin])

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>{`
        .mp-popup-row:hover { background: rgba(255,255,255,0.1); border-radius: 4px; }
      `}</style>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
    </>
  )
}
