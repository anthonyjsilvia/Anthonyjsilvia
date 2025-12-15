'use client'

import Image from 'next/image'
import styles from './page.module.css'

export default function AboutPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <span className={styles.pageSubtitle}>
            <i className="fas fa-user"></i> My Mission
          </span>
          <h1 className={styles.pageTitle}>
            Uncovering Design's Hidden Stories with <span className={styles.highlight}>Users at the core</span>
          </h1>
          <p className={styles.pageDescription}>
            Dedicated to creating intuitive, user-centered digital experiences that engage and delight.
          </p>
        </div>
        
        <div className={styles.aboutContent}>
          <div className={styles.aboutImage}>
            <Image
              src="/assets/images/me.jpg"
              alt="Anthony Silvia Working"
              width={500}
              height={500}
              priority
            />
          </div>
          
          <div className={styles.aboutText}>
            <h2>My Approach to Design</h2>
            <p>
              As a passionate UX Designer with over two years of experience, I am dedicated to uncovering the stories 
              that make designs resonate with users. My approach centers on placing users at the heart of every decision, 
              from research to prototyping, to create intuitive, user-centered digital experiences.
            </p>
            <p>
              Blending aesthetics with functionality, I strive to craft designs that engage and delight, ensuring each element serves a purpose. 
              By staying updated with trends and methodologies, I aim to push innovation and deliver impactful designs that 
              foster trust and connection, making users integral to the narrative of every digital experience.
            </p>
            <p>
              My design philosophy is built on deep empathy for users, meticulous research, and continuous iteration. 
              I believe that great design should be both beautiful and functional, solving real problems while creating 
              memorable experiences that users love to engage with.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

