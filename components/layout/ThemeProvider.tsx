'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

type Theme = 'dark' | 'light'

interface ThemeCtx {
  theme: Theme
  toggle: () => void
}

const Ctx = createContext<ThemeCtx>({ theme: 'dark', toggle: () => {} })

export function useTheme() {
  return useContext(Ctx)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')

  /* On mount: read from localStorage (or system preference) */
  useEffect(() => {
    const stored = localStorage.getItem('janadesh-theme') as Theme | null
    if (stored === 'light' || stored === 'dark') {
      apply(stored)
      setTheme(stored)
    } else {
      // Respect system dark-mode preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const initial: Theme = prefersDark ? 'dark' : 'light'
      apply(initial)
      setTheme(initial)
    }
  }, [])

  const apply = (t: Theme) => {
    document.documentElement.setAttribute('data-theme', t)
  }

  const toggle = useCallback(() => {
    setTheme(prev => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark'
      apply(next)
      localStorage.setItem('janadesh-theme', next)
      return next
    })
  }, [])

  return <Ctx.Provider value={{ theme, toggle }}>{children}</Ctx.Provider>
}
