'use client'

import Link from 'next/link'
import styles from './page.module.css'

export default function SuccessPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <div className={styles.successContent}>
          <div className={styles.successIcon}>
            <i className="fas fa-check-circle"></i>
          </div>
          <h1 className={styles.successTitle}>Message Sent!</h1>
          <p className={styles.successMessage}>
            Thank you for reaching out. I'll get back to you as soon as possible.
          </p>
          <Link href="/" className={styles.backButton}>
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

