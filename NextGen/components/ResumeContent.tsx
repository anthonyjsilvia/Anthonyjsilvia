'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '@/hooks/useTheme'
import styles from './ResumeContent.module.css'

export default function ResumeContent() {
  const [resumeData, setResumeData] = useState<any>(null)
  const { isDarkMode } = useTheme()

  useEffect(() => {
    const loadResume = async () => {
      try {
        const response = await fetch('/data/resume.json')
        const data = await response.json()
        setResumeData(data)
      } catch (error) {
        console.error('Error loading resume:', error)
      }
    }
    loadResume()
  }, [])

  const getLogoUrl = (job: any) => {
    if (!job.logo) return ''
    if (typeof job.logo === 'object') {
      return isDarkMode ? job.logo.dark : job.logo.light
    }
    return job.logo
  }

  if (!resumeData) {
    return <div>Loading resume...</div>
  }

  return (
    <div className={styles.resumeModernContainer}>
      <aside className={styles.resumeSidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarAvatar}>
            <Image
              src="/assets/images/me.jpg"
              alt="Anthony Silvia"
              width={150}
              height={150}
            />
          </div>
          <h1 className={styles.sidebarName}>{resumeData.personalInfo.name}</h1>
          <p className={styles.sidebarTitle}>{resumeData.personalInfo.title} & Developer</p>
        </div>
        
        <div className={styles.sidebarSection}>
          <h2>Contact</h2>
          <Link href="https://www.linkedin.com/in/anthonyjsilvia/" target="_blank" className={styles.contactBtn} style={{ marginBottom: '10px' }}>
            <i className="fab fa-linkedin"></i> LinkedIn
          </Link>
          <Link href="/contact" className={styles.contactBtn}>
            <i className="fas fa-envelope"></i> Contact Me
          </Link>
        </div>
        
        <div className={styles.sidebarSection}>
          <h2>Skills</h2>
          <div className={styles.skillsContainer}>
            <div className={styles.skillsCategory}>
              <h3>Top Skills</h3>
              <ul className={styles.skillsList}>
                {['UX Design', 'Software Development', 'Project Management', 'Start-up Leadership'].map((skill, idx) => (
                  <li key={idx}><i className="fas fa-star"></i>{skill}</li>
                ))}
              </ul>
            </div>
            
            {resumeData.skills.designTools && resumeData.skills.designTools.length > 0 && (
              <div className={styles.skillsCategory}>
                <h3>Design Tools</h3>
                <div className={styles.skillsChart}>
                  {resumeData.skills.designTools.map((tool: any, idx: number) => (
                    <div key={idx} className={styles.skillItem}>
                      <div className={styles.skillName}>{tool.name}</div>
                      <div className={styles.skillBar}>
                        <div className={styles.skillLevel} style={{ width: `${tool.level}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {resumeData.keyStrengths && resumeData.keyStrengths.length > 0 && (
          <div className={styles.sidebarSection}>
            <h2>Key Strengths</h2>
            <ul className={styles.keyStrengthsList}>
              {resumeData.keyStrengths.map((strength: any, idx: number) => (
                <li key={idx}>{strength}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className={styles.sidebarSection}>
          <h2>Languages</h2>
          <ul className={styles.sidebarLanguages}>
            {resumeData.languages.map((lang: any, idx: number) => (
              <li key={idx}>
                {lang.name}
                <span className={styles.languageLevel}>{lang.level}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {resumeData.honors && resumeData.honors.length > 0 && (
          <div className={styles.sidebarSection}>
            <h2>Honors & Awards</h2>
            <ul className={styles.honorsList}>
              {resumeData.honors.map((honor: any, idx: number) => (
                <li key={idx}>{honor}</li>
              ))}
            </ul>
          </div>
        )}
      </aside>
      
      <main className={styles.resumeMain}>
        <div className={styles.pageHeader} style={{ paddingBottom: '24px', backgroundColor: 'rgba(0, 0, 0, 0.08)', borderRadius: '16px', padding: '24px' }}>
          <span className={styles.pageSubtitle}>
            <i className="fas fa-briefcase"></i> Resume
          </span>
          <h1 className={styles.pageTitle}>
            My Professional <span className={styles.highlight}>Journey</span>
          </h1>
          <p className={styles.pageDescription}>
            A dynamic problem solver at the intersection of web and native design, crafting innovative solutions that bridge digital experiences.
          </p>
        </div>
        
        <div className={styles.resumeContent}>
          <div className={styles.resumeSection}>
            <h2 className={styles.sectionTitle}>Professional Experience</h2>
            <div className={styles.timeline}>
              {resumeData.experience.map((job: any, idx: number) => (
                <div key={idx} className={styles.timelineItem}>
                  <div className={styles.companyHeader}>
                    {job.logo && (
                      <div className={styles.companyLogo}>
                        <Image
                          src={getLogoUrl(job)}
                          alt={job.company}
                          width={150}
                          height={30}
                        />
                      </div>
                    )}
                    <h3 className={styles.companyName}>{job.company}</h3>
                  </div>
                  <div className={styles.role}>
                    <h4>{job.position}</h4>
                    <span className={styles.timelineDateBadge}>{job.period}</span>
                    <p className={styles.location}>{job.locationType} • {job.positionType}</p>
                    <ul className={styles.roleDuties}>
                      {job.duties.map((duty: any, dutyIdx: number) => (
                        <li key={dutyIdx}>{duty}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.resumeSection}>
            <h2 className={styles.sectionTitle}>Education</h2>
            <div className={styles.timeline}>
              {resumeData.education.map((edu: any, idx: number) => (
                <div key={idx} className={styles.timelineItem}>
                  <div className={styles.timelineContent}>
                    <h3>{edu.school}</h3>
                    {edu.period && <span className={styles.timelineDateBadge}>{edu.period}</span>}
                    <p>{edu.degree}</p>
                    {edu.minor && <p>Minor: {edu.minor}</p>}
                    {edu.gpa && <span className={styles.gpa}>{edu.gpa} GPA</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.resumeSection}>
            <h2 className={styles.sectionTitle}>Certifications</h2>
            <div className={styles.certificationsContainer}>
              <ul className={styles.certificationsList}>
                {resumeData.certifications.map((cert: any, idx: number) => {
                  const dateMatch = cert.match(/\((.*?)\)/)
                  const date = dateMatch ? dateMatch[1] : null
                  const name = dateMatch ? cert.replace(/\((.*?)\)/, '').trim() : cert
                  
                  return (
                    <li key={idx}>
                      <div className={styles.certificationItem}>
                        <span className={styles.certificationName}>{name}</span>
                        {date && <span className={styles.certificationDate}>{date}</span>}
                        {name.toLowerCase().includes('professional certificate') && (
                          <span className={styles.certificationBadge}>Professional</span>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

