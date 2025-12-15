'use client'

import { useEffect, useRef } from 'react'

export default function StarsAnimation() {
  const containerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const numStars = 15
    const stars: HTMLDivElement[] = []

    // Create stars
    for (let i = 0; i < numStars; i++) {
      const star = document.createElement('div')
      star.className = 'star'
      
      const size = Math.random() * 3 + 3
      star.style.width = `${size}px`
      star.style.height = `${size}px`
      
      const x = Math.random() * 100
      const y = Math.random() * 100
      star.style.left = `${x}%`
      star.style.top = `${y}%`
      
      star.style.opacity = (Math.random() * 0.5 + 0.5).toString()
      star.style.transform = `rotate(${Math.random() * 360}deg)`
      star.style.position = 'absolute'
      
      container.appendChild(star)
      stars.push(star)
    }

    // Animate stars
    stars.forEach(star => {
      const duration = Math.random() * 2 + 1
      
      const animate = () => {
        star.style.opacity = (Math.random() * 0.5 + 0.5).toString()
        setTimeout(animate, duration * 1000)
      }
      
      animate()
    })

    return () => {
      stars.forEach(star => star.remove())
    }
  }, [])

  return <span ref={containerRef} className="stars-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
}

