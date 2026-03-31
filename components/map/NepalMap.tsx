'use client'

import { useEffect, useRef } from 'react'
import type { MP } from '@/lib/types'

interface NepalMapProps {
  mps: MP[]
  selectedMP: MP | null
  onSelectMP: (mp: MP) => void
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

export default function NepalMap({ mps, selectedMP, onSelectMP }: NepalMapProps) {
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

      // MP markers
      mps.forEach(mp => {
        if (!mp.constituency.lat || mp.constituency.id === 0) return

        const isSelected = selectedMP?.id === mp.id
        const color = isSelected ? '#DC2626' : mp.partyShort === 'RSP' ? '#ff6b6b' : '#90cdff'

        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width:12px;height:12px;border-radius:50%;
            background:${color};
            border:2px solid rgba(255,255,255,0.4);
            box-shadow:0 0 6px ${color}88;
            cursor:pointer;
          "></div>`,
          iconAnchor: [6, 6],
        })

        const marker = L.marker([mp.constituency.lat, mp.constituency.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:Inter,sans-serif;padding:2px;">
              <div style="font-weight:700;font-size:13px;margin-bottom:2px;">${mp.name}</div>
              <div style="font-size:11px;color:#666;">${mp.constituency.name}</div>
              <div style="font-size:11px;color:#dc2626;font-weight:600;">${mp.party}</div>
            </div>
          `, { maxWidth: 200 })
          .on('click', () => onSelectMP(mp))

        markersRef.current.push(marker)
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
  }, []) // only run once

  // Update marker styles when selection changes
  useEffect(() => {
    if (!mapRef.current) return
    // Re-render markers (simplified — on real app would update individual markers)
  }, [selectedMP])

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
    </>
  )
}
