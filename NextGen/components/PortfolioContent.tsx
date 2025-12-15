'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { useTheme } from '@/hooks/useTheme'
import styles from './PortfolioContent.module.css'

export default function PortfolioContent() {
  const [projects, setProjects] = useState<any[]>([])
  const { isDarkMode } = useTheme()

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const response = await fetch('/data/portfolio.json')
        const data = await response.json()
        const sorted = [...data.projects].sort((a: any, b: any) => a.displayOrder - b.displayOrder)
        setProjects(sorted)
      } catch (error) {
        console.error('Error loading portfolio:', error)
      }
    }
    loadPortfolio()
  }, [])

  // Group projects by company
  const projectsByCompany = useMemo(() => {
    const grouped: { [key: string]: { company: any; projects: any[] } } = {}
    
    projects.forEach((project) => {
      const companyName = project.company?.name || 'Other'
      if (!grouped[companyName]) {
        grouped[companyName] = {
          company: project.company,
          projects: []
        }
      }
      grouped[companyName].projects.push(project)
    })
    
    return grouped
  }, [projects])

  const getLogoUrl = (company: any) => {
    if (!company?.logo) return ''
    return isDarkMode ? company.logo.dark : company.logo.light
  }

  return (
    <div className={styles.portfolioContainer}>
      {Object.entries(projectsByCompany).map(([companyName, { company, projects: companyProjects }]) => (
        <div key={companyName} className={styles.companySection}>
          {company && (
            <div className={styles.companyHeader}>
              <div className={styles.companyLogo}>
                <Image
                  src={getLogoUrl(company)}
                  alt={`${company.name} logo`}
                  width={150}
                  height={48}
                />
              </div>
              <a
                href={company.website}
                className={styles.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit {company.name} Website <i className="fas fa-external-link-alt"></i>
              </a>
            </div>
          )}
          <div className={styles.portfolioSections} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridAutoRows: '1fr', gap: '2rem', width: '100%', alignItems: 'stretch' }} suppressHydrationWarning>
            {companyProjects.map((project) => {
              const imageUrl = project.image !== 'none' ? project.image : '/assets/images/project-placeholder.png'
              
              return (
                <section key={project.id} className={styles.portfolioSection} id={`project-${project.id}`}>
                  <div className={styles.projectContent}>
                    <div className={styles.projectImage}>
                      <Image
                        src={imageUrl}
                        alt={project.title}
                        width={600}
                        height={600}
                      />
                    </div>
                    <div className={styles.projectDetails}>
                      <h2 className={styles.projectTitle}>{project.title}</h2>
                      <h3 className={styles.projectSubtitle}>{project.subtitle}</h3>
                      <p className={styles.projectDescription}>{project.description}</p>
                      
                      <div className={styles.projectCategories}>
                        {project.categories.map((category: string, idx: number) => (
                          <span key={idx} className={styles.categoryTag}>{category}</span>
                        ))}
                      </div>
                      
                      <div className={styles.projectLinks}>
                        {project.link !== 'none' && (
                          <a
                            href={project.link}
                            className={`${styles.projectLink} ${styles.primaryLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className="fas fa-external-link-alt"></i> View Project
                          </a>
                        )}
                        {project.github !== 'disabled' && (
                          <a
                            href={project.github}
                            className={`${styles.projectLink} ${styles.secondaryLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className="fab fa-github"></i> Contribute with GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

