'use client'

import { Suspense } from 'react'
import PortfolioContent from '@/components/PortfolioContent'
import styles from './page.module.css'

export default function PortfolioPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <span className={styles.pageSubtitle}>
          <i className="fas fa-grip-vertical"></i> Portfolio
        </span>
        <h1 className={styles.pageTitle}>
          My <span className={styles.highlight}>Portfolio</span>
        </h1>
        <p className={styles.pageDescription}>
          A showcase of my best design and development work.
        </p>
      </div>
      
      <Suspense fallback={<div>Loading portfolio...</div>}>
        <PortfolioContent />
      </Suspense>
    </div>
  )
}

