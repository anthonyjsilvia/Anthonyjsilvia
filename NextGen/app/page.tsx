'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Suspense, useState, useEffect } from 'react'
import Testimonials from '@/components/Testimonials'
import StarsAnimation from '@/components/StarsAnimation'
import CloudsAnimation from '@/components/CloudsAnimation'
import styles from './page.module.css'

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    // Add home-page class to body for CSS targeting
    document.body.classList.add('home-page')
    
    return () => {
      document.body.classList.remove('home-page')
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      // Calculate scroll progress (0 to 1) starting immediately from scroll position 0
      // Complete the transition over a longer scroll distance for smoother feel
      const scrollEnd = 800 // Complete transition over 800px of scrolling
      
      // Use a smooth easing function for natural feel
      const rawProgress = Math.min(scrollY / scrollEnd, 1)
      
      // Apply easing for smoother animation curve
      // Ease-out cubic for natural deceleration
      const easedProgress = rawProgress < 1
        ? 1 - Math.pow(1 - rawProgress, 3)
        : 1
      
      setScrollProgress(easedProgress)
    }

    // Use requestAnimationFrame for smoother scroll handling
    let ticking = false
    const optimizedScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', optimizedScroll, { passive: true })
    handleScroll() // Initial call
    
    return () => window.removeEventListener('scroll', optimizedScroll)
  }, [])

  // Calculate hero styles based on scroll progress
  // Header is positioned at left: 20px, right: 20px (so width is calc(100% - 40px))
  // When fully scrolled, hero should match header position
  const headerLeft = 20 // pixels
  const headerMargin = 40 // total (20px left + 20px right)
  
  // 3D morphing calculations - more pronounced effect
  // Create a more pronounced 3D effect with perspective and rotation
  const perspective = 1000 // Perspective distance
  const rotateX = scrollProgress * -8 // More pronounced tilt backward (degrees)
  const rotateY = scrollProgress * 3 // More rotation on Y axis (degrees)
  const scaleY = 1 - (scrollProgress * 0.08) // More vertical compression
  const translateZ = scrollProgress * -30 // Move back more in 3D space (pixels)
  
  // Calculate shadow intensity based on scroll (more shadow = more 3D depth) - reduced to 25%
  const shadowIntensity = scrollProgress * 0.2 // 0 to 0.2 multiplier (25% of 0.8)
  const shadowBlur = 5 + (scrollProgress * 10) // 5px to 15px blur (25% of 20-60px)
  const shadowSpread = scrollProgress * 2.5 // 0px to 2.5px spread (25% of 10px)
  
  // Calculate beveled edge border width based on scroll
  const bevelWidth = scrollProgress * 4 // 0px to 4px bevel width
  
  const heroStyle: React.CSSProperties = {
    width: `calc(100% - ${scrollProgress * headerMargin}px)`, // From 100% to calc(100% - 40px)
    marginLeft: `${scrollProgress * headerLeft}px`, // From 0px to 20px
    borderRadius: `${scrollProgress * 64}px`, // From 0px to 64px (header border radius)
    // 3D morphing transforms - more pronounced
    transform: `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scaleY(${scaleY}) translateZ(${translateZ}px)`,
    transformStyle: 'preserve-3d' as const,
    transformOrigin: 'center center',
    // Enhanced shadows that increase with scroll for 3D depth - reduced to 25%
    boxShadow: `
      /* Top beveled edge highlight - 25% intensity */
      inset 0 ${2 + bevelWidth}px ${4 + bevelWidth * 2}px rgba(255, 255, 255, ${0.1 + scrollProgress * 0.075}),
      inset 0 ${1 + bevelWidth * 0.5}px ${2 + bevelWidth}px rgba(255, 255, 255, ${0.075 + scrollProgress * 0.075}),
      /* Left beveled edge highlight - 25% intensity */
      inset ${bevelWidth}px 0 ${4 + bevelWidth * 2}px rgba(255, 255, 255, ${scrollProgress * 0.0625}),
      /* Right beveled edge highlight - 25% intensity */
      inset -${bevelWidth}px 0 ${4 + bevelWidth * 2}px rgba(255, 255, 255, ${scrollProgress * 0.0625}),
      /* Bottom beveled edge shadow - 25% intensity */
      inset 0 -${3 + bevelWidth}px ${6 + bevelWidth * 2}px rgba(0, 0, 0, ${0.1 + scrollProgress * 0.1}),
      inset 0 -${1 + bevelWidth * 0.5}px ${2 + bevelWidth}px rgba(0, 0, 0, ${0.125 + scrollProgress * 0.075}),
      /* Outer shadows - reduced to 25% for subtle 3D depth */
      0 ${2 + scrollProgress * 2}px ${shadowBlur}px rgba(0, 0, 0, ${0.05 + shadowIntensity}),
      0 ${8 + scrollProgress * 5}px ${shadowBlur + 4}px rgba(0, 0, 0, ${0.0875 + shadowIntensity}),
      0 ${4 + scrollProgress * 3}px ${shadowBlur + 1}px rgba(0, 0, 0, ${0.075 + shadowIntensity * 0.15}),
      0 ${12 + scrollProgress * 9}px ${shadowBlur + 6}px rgba(0, 0, 0, ${0.075 + shadowIntensity}),
      0 ${20 + scrollProgress * 13}px ${shadowBlur + 10}px rgba(0, 0, 0, ${0.0625 + shadowIntensity * 0.175})
    `,
    // No border - removed per user request
    border: 'none',
    // Remove transition for instant response to scroll
  }
  
  // Add class when scrolled to apply content effects
  const heroClassName = scrollProgress > 0.5 ? `${styles.hero} ${styles.scrolled}` : styles.hero

  return (
    <div className={styles.pageContainer}>
      <div className={styles.heroWrapper}>
        <div className={heroClassName} style={heroStyle}>
          {/* Day side overlay with clouds */}
          <div className={styles.heroDaySide}>
            <CloudsAnimation />
          </div>
          
          {/* Night side overlay with stars */}
          <div className={styles.heroNightSide}>
            <StarsAnimation />
          </div>
          
          {/* Highlight overlay for scroll effect */}
          <div className={styles.heroHighlight}></div>
          
          {/* Day side content wrapper - clips to day side */}
          <div className={styles.heroDayContentWrapper}>
            <div className={styles.heroDayContent}>
              <h1 className={styles.heroTitle}>
                <div className={styles.titleLine}>Experience Designer by</div>
                <span className={`${styles.highlight} ${styles.dayText}`}>
                  Day
                </span>
                <span className={styles.staticDayText}>Day</span>
              </h1>
            </div>
          </div>
          
          {/* Night side content wrapper - clips to night side */}
          <div className={styles.heroNightContentWrapper}>
            <div className={styles.heroNightContent}>
              <h1 className={styles.heroTitle}>
                <div className={styles.titleLine}>Entrepreneur by</div>
                <span className={styles.nightStars}>
                  Night
                </span>
                <span className={styles.staticNightText}>Night</span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.aboutContent}>
          <div className={styles.missionStatement}>
            <span className={styles.sectionSubtitle}>
              <i className="fas fa-user"></i> My Approach
            </span>
            <div className={styles.titlesContainer}>
              <h2 className={styles.sectionTitle}>
                Rooted in <span className={styles.highlight}>Experience.</span>
              </h2>
              <h2 className={styles.sectionTitle}>
                Inspired by Steve's<span className={styles.highlight}> Vision.</span>
              </h2>
            </div>
            <p className={styles.sectionDescription}>
              "Design is not just what it looks like and feels like. Design is how it works." - Steve Jobs
            </p>
          </div>

          <div className={styles.aboutImage}>
            <Image
              src="/assets/images/nodeda.os.wireframe.png"
              alt="Wireframe of NodeDa OS"
              width={800}
              height={500}
              priority
            />
          </div>
        </div>
      </div>

      <div className={styles.sectionDivider}></div>

      <div className={styles.container}>
        <Suspense fallback={<div>Loading testimonials...</div>}>
          <Testimonials />
        </Suspense>
      </div>
    </div>
  )
}
