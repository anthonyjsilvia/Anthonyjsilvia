'use client'

import { useTheme } from '@/hooks/useTheme'
import { useEffect } from 'react'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, isDarkMode } = useTheme()

  useEffect(() => {
    // Apply theme to html and body elements
    const html = document.documentElement
    const body = document.body
    
    // Always apply theme based on hook state
    // The hook should be initialized correctly from DOM/localStorage
    if (isDarkMode) {
      html.classList.add('dark-theme')
      html.classList.remove('light-theme')
      html.setAttribute('data-theme', 'dark')
      body.classList.add('dark-theme')
      body.classList.remove('light-theme')
      // Force black background when dark mode is enabled
      html.style.backgroundColor = '#000000'
      body.style.backgroundColor = '#000000'
    } else {
      html.classList.add('light-theme')
      html.classList.remove('dark-theme')
      html.setAttribute('data-theme', 'light')
      body.classList.add('light-theme')
      body.classList.remove('dark-theme')
      // Force white background when dark mode is disabled
      html.style.backgroundColor = '#ffffff'
      body.style.backgroundColor = '#ffffff'
    }
  }, [theme, isDarkMode])

  return <>{children}</>
}

