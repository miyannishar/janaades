'use client'

import { useTheme } from './ThemeProvider'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.4rem 0.7rem',
        borderRadius: '8px',
        border: '1px solid var(--border-glass)',
        background: 'rgba(255,255,255,0.03)',
        cursor: 'pointer',
        color: 'var(--text-secondary)',
        fontSize: '0.7rem',
        fontWeight: 600,
        letterSpacing: '0.04em',
        transition: 'all 180ms ease',
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.background = 'var(--indigo-soft)'
        el.style.borderColor = 'var(--border-accent)'
        el.style.color = 'var(--text-accent)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.background = 'rgba(255,255,255,0.03)'
        el.style.borderColor = 'var(--border-glass)'
        el.style.color = 'var(--text-secondary)'
      }}
    >
      {/* Track */}
      <div style={{
        width: 32,
        height: 17,
        borderRadius: 99,
        background: isDark
          ? 'linear-gradient(135deg, var(--indigo), #8083ff)'
          : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
        position: 'relative',
        transition: 'background 300ms ease',
        flexShrink: 0,
      }}>
        {/* Thumb */}
        <div style={{
          position: 'absolute',
          top: 2,
          left: isDark ? 17 : 2,
          width: 13,
          height: 13,
          borderRadius: '50%',
          background: '#fff',
          transition: 'left 280ms cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
        }}>
          {isDark
            ? <Moon size={7} style={{ color: '#4f46e5', strokeWidth: 2.5 }} />
            : <Sun size={7} style={{ color: '#d97706', strokeWidth: 2.5 }} />
          }
        </div>
      </div>
      <span style={{ userSelect: 'none', color: 'var(--text-muted)', fontSize: '0.62rem' }}>
        {isDark ? 'DARK' : 'LIGHT'}
      </span>
    </button>
  )
}
