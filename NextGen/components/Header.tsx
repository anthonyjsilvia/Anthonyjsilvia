'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import styles from './Header.module.css'

const navItems = [
  { label: 'About Me', icon: 'fas fa-home', href: '/' },
  { label: 'Resume', icon: 'fas fa-briefcase', href: '/resume' },
  { label: 'Portfolio', icon: 'fas fa-grip-vertical', href: '/portfolio' },
  { label: 'Contact Me', icon: 'fas fa-envelope', href: '/contact' }
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open')
    } else {
      document.body.classList.remove('menu-open')
    }
  }, [isMenuOpen])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header id="main-header" className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.logo}>
          <Link href="/">
            <div className={styles.logoContent}>
              <div className={styles.profileImageSmall}>
                <Image
                  src="/assets/images/me.jpg"
                  alt="Anthony Silvia"
                  width={40}
                  height={40}
                />
              </div>
              <h1>Anthony Silvia</h1>
            </div>
          </Link>
        </div>
        <nav className={`${styles.headerNav} ${isMenuOpen ? styles.active : ''}`} id="main-nav">
          <ul>
            {navItems.map(item => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`${styles.navLink} ${pathname === item.href ? styles.active : ''}`}
                  aria-label={item.label}
                  onClick={() => {
                    if (window.innerWidth <= 768) {
                      setIsMenuOpen(false)
                    }
                  }}
                >
                  <span><i className={item.icon}></i> {item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <button
          className={styles.mobileMenuBtn}
          id="menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  )
}

