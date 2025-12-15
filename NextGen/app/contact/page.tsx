'use client'

import { useState } from 'react'
import ContactForm from '@/components/ContactForm'
import styles from './page.module.css'

export default function ContactPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <span className={styles.pageSubtitle}>
            <i className="fas fa-envelope"></i> Contact
          </span>
          <h1 className={styles.pageTitle}>
            Get In <span className={styles.highlight}>Touch</span>
          </h1>
          <p className={styles.pageDescription}>
            Have a project in mind or want to collaborate? Feel free to reach out!
          </p>
        </div>
        
        <div className={styles.contactContainer}>
          <div className={styles.contactInfo}>
            <a href="https://www.google.com/maps/place/Charlotte,+NC" target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div className={styles.contactDetails}>
                <h3>Location</h3>
                <p>Based in Charlotte Metro, NC</p>
              </div>
            </a>
            
            <a href="https://linkedin.com/in/anthonyjsilvia" target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <i className="fab fa-linkedin"></i>
              </div>
              <div className={styles.contactDetails}>
                <h3>LinkedIn</h3>
                <p>linkedin.com/in/anthonyjsilvia</p>
              </div>
            </a>
            
            <a href="https://github.com/anthonyjsilvia" target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <i className="fab fa-github"></i>
              </div>
              <div className={styles.contactDetails}>
                <h3>GitHub</h3>
                <p>github.com/anthonyjsilvia</p>
              </div>
            </a>
          </div>
          
          <ContactForm />
        </div>
      </div>
    </div>
  )
}

