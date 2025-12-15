'use client'

import { useState, useEffect } from 'react'

// Helper function to get initial dark mode state synchronously
function getInitialDarkMode(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false
  
  try {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null
    
    if (savedTheme === 'dark') {
      return true
    } else if (savedTheme === 'light') {
      return false
    } else {
      // System preference - always check OS preference directly, not DOM state
      // The DOM state might be stale or incorrect
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
  } catch (e) {
    // Fallback to system preference if localStorage fails
    try {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    } catch {
      return false
    }
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    if (typeof window === 'undefined') return 'system'
    try {
      return (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system'
    } catch {
      return 'system'
    }
  })
  const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode)
  const [transparency, setTransparency] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [dyslexicFont, setDyslexicFont] = useState(false)

  useEffect(() => {
    // Load preferences from localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null
    const savedTransparency = localStorage.getItem('transparency') !== 'false'
    const savedReducedMotion = localStorage.getItem('reducedMotion') === 'true'
    const savedDyslexicFont = localStorage.getItem('dyslexicFont') === 'enabled'

    // Always default to 'system' if no theme is saved (OS aware)
    const initialTheme = savedTheme || 'system'
    setTheme(initialTheme)
    setTransparency(savedTransparency)
    setReducedMotion(savedReducedMotion)
    setDyslexicFont(savedDyslexicFont)

    // Apply initial theme immediately to prevent flash
    // Always check OS preference directly for 'system' theme
    if (initialTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDarkMode(prefersDark)
      applyTheme('system')
    } else if (initialTheme === 'dark') {
      setIsDarkMode(true)
      applyTheme('dark')
    } else {
      setIsDarkMode(false)
      applyTheme('light')
    }
    
    applyTransparency(savedTransparency)
    applyReducedMotion(savedReducedMotion)
    applyDyslexicFont(savedDyslexicFont)
  }, [])

  useEffect(() => {
    // Only listen to OS changes if theme is set to 'system'
    if (theme !== 'system') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    // Sync state with current OS preference
    const currentPrefersDark = mediaQuery.matches
    setIsDarkMode(currentPrefersDark)
    applyTheme('system')
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setIsDarkMode(e.matches)
        applyTheme('system')
      }
    }

    // Use addListener for better browser support
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [theme])

  const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement
    const body = document.body
    root.classList.remove('dark-theme', 'light-theme')
    body.classList.remove('dark-theme', 'light-theme')
    root.removeAttribute('data-prefers-dark')
    root.removeAttribute('data-theme')

    if (newTheme === 'dark') {
      root.classList.add('dark-theme')
      body.classList.add('dark-theme')
      root.setAttribute('data-theme', 'dark')
      setIsDarkMode(true)
      // Force black background when dark mode is enabled
      root.style.backgroundColor = '#000000'
      body.style.backgroundColor = '#000000'
    } else if (newTheme === 'light') {
      root.classList.add('light-theme')
      body.classList.add('light-theme')
      root.setAttribute('data-theme', 'light')
      setIsDarkMode(false)
      // Force white background when dark mode is disabled
      root.style.backgroundColor = '#ffffff'
      body.style.backgroundColor = '#ffffff'
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDarkMode(prefersDark)
      if (prefersDark) {
        root.setAttribute('data-prefers-dark', 'true')
        root.setAttribute('data-theme', 'dark')
        root.classList.add('dark-theme')
        body.classList.add('dark-theme')
        // Force black background when dark mode is enabled
        root.style.backgroundColor = '#000000'
        body.style.backgroundColor = '#000000'
      } else {
        root.setAttribute('data-theme', 'light')
        root.classList.add('light-theme')
        body.classList.add('light-theme')
        // Force white background when dark mode is disabled
        root.style.backgroundColor = '#ffffff'
        body.style.backgroundColor = '#ffffff'
      }
    }
  }

  const applyTransparency = (enabled: boolean) => {
    const root = document.documentElement
    if (enabled) {
      root.classList.remove('no-transparency')
    } else {
      root.classList.add('no-transparency')
    }
  }

  const applyReducedMotion = (enabled: boolean) => {
    const root = document.documentElement
    if (enabled) {
      root.classList.add('reduced-motion')
    } else {
      root.classList.remove('reduced-motion')
    }
  }

  const applyDyslexicFont = (enabled: boolean) => {
    const body = document.body
    if (enabled) {
      body.classList.add('dyslexic-font')
    } else {
      body.classList.remove('dyslexic-font')
    }
  }

  const updateTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme)
    if (newTheme === 'system') {
      localStorage.removeItem('theme')
    } else {
      localStorage.setItem('theme', newTheme)
    }
    applyTheme(newTheme)
  }

  const updateTransparency = (enabled: boolean) => {
    setTransparency(enabled)
    localStorage.setItem('transparency', enabled.toString())
    applyTransparency(enabled)
  }

  const updateReducedMotion = (enabled: boolean) => {
    setReducedMotion(enabled)
    localStorage.setItem('reducedMotion', enabled.toString())
    applyReducedMotion(enabled)
  }

  const updateDyslexicFont = (enabled: boolean) => {
    setDyslexicFont(enabled)
    localStorage.setItem('dyslexicFont', enabled ? 'enabled' : 'disabled')
    applyDyslexicFont(enabled)
  }

  return {
    theme,
    isDarkMode,
    transparency,
    reducedMotion,
    dyslexicFont,
    updateTheme,
    updateTransparency,
    updateReducedMotion,
    updateDyslexicFont,
  }
}

