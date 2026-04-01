'use client'

import { Share2, AlertCircle } from 'lucide-react'

export default function SocialPage() {
  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem' }} className="animate-fade-in">
        <h1 className="display-md" style={{ marginBottom: '0.25rem' }}>Social Media Publishing</h1>
        <p className="body-lg">Automated cross-posting of parliamentary events to Reddit and X.</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div className="card" style={{ flex: 1, minWidth: 0, borderLeft: '2px solid #FF4500' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FF4500', marginBottom: '0.5rem' }}>Reddit Bot</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--amber)', fontSize: '0.8rem', fontWeight: 600 }}>
            <span className="dot dot-warn" /> DRY RUN MODE
          </div>
        </div>
        <div className="card" style={{ flex: 1, minWidth: 0, borderLeft: '2px solid #1DA1F2' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1DA1F2', marginBottom: '0.5rem' }}>X (Twitter) Bot</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--amber)', fontSize: '0.8rem', fontWeight: 600 }}>
            <span className="dot dot-warn" /> DRY RUN MODE
          </div>
        </div>
      </div>

      <div className="card animate-fade-in">
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '3rem 1rem', gap: '1rem', textAlign: 'center',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, background: 'var(--surface-3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Share2 size={24} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
              No posts published yet
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 360 }}>
              The social publishing bot is running in dry-run mode. Posts will appear here once the bots are cleared for live publishing.
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 0.875rem', borderRadius: 8,
            background: 'var(--amber-soft)', border: '1px solid rgba(245,158,11,0.15)',
            fontSize: '0.72rem', color: 'var(--amber)', fontWeight: 600,
          }}>
            <AlertCircle size={13} /> Bots are active — awaiting operator approval for live mode
          </div>
        </div>
      </div>
    </div>
  )
}
