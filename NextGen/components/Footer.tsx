'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useTheme } from '@/hooks/useTheme'
import styles from './Footer.module.css'

export default function Footer() {
  const [currentYear, setCurrentYear] = useState('2025')
  const [isMounted, setIsMounted] = useState(false)
  const { isDarkMode } = useTheme()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const fetchCurrentYear = async () => {
      try {
        const response = await fetch('https://worldtimeapi.org/api/ip')
        if (response.ok) {
          const data = await response.json()
          const year = new Date(data.datetime).getFullYear()
          setCurrentYear(year.toString())
        } else {
          throw new Error('Failed to fetch')
        }
      } catch (error) {
        try {
          const response = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=UTC')
          if (response.ok) {
            const data = await response.json()
            setCurrentYear(data.year.toString())
          } else {
            throw new Error('Failed to fetch')
          }
        } catch (fallbackError) {
          setCurrentYear(new Date().getFullYear().toString())
        }
      }
    }

    fetchCurrentYear()
  }, [])

  // Use a default logo during SSR to prevent hydration mismatch
  // After mount, use the theme-based logo
  const logoSrc = isMounted
    ? (isDarkMode
        ? 'https://nodeda.com/logos/NodeDa.cloud.white.svg'
        : 'https://nodeda.com/logos/NodeDa.cloud.black.svg')
    : 'https://nodeda.com/logos/NodeDa.cloud.black.svg' // Default for SSR

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerContent}>
          <div className={styles.footerCopyright}>
            <p>&copy; <span id="current-year">{currentYear}</span> Anthony Silvia. All Rights Reserved</p>
          </div>
          
          <div className={styles.footerSocial}>
            <a href="https://linkedin.com/in/anthonyjsilvia" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="https://github.com/anthonyjsilvia" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
            </a>
          </div>
          
          <div className={styles.poweredBy}>
            <span>Hosted on</span>
            <a href="https://nodeda.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center' }}>
              <img 
                src={logoSrc} 
                alt="NodeDa" 
                className={styles.nodedaLogo} 
                style={{ height: '1.5em' }}
                suppressHydrationWarning
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

