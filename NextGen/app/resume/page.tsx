'use client'

import { Suspense } from 'react'
import ResumeContent from '@/components/ResumeContent'
import styles from './page.module.css'

export default function ResumePage() {
  return (
    <div className={styles.resumeContainer}>
      <Suspense fallback={<div>Loading resume...</div>}>
        <ResumeContent />
      </Suspense>
    </div>
  )
}

