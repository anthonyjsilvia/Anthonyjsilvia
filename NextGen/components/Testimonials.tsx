'use client'

import { useState } from 'react'
import Image from 'next/image'
import styles from './Testimonials.module.css'

const testimonials = [
  {
    content: "Anthony is a joy to work with! Hard working, proactive and enterprising, he helped me on a variety of projects under tight deadlines and shifting priorities. His curiosity around emerging technologies keeps him on the forefront of what's new and how to leverage into his existing work flows.",
    author: {
      name: "Melody Cassen",
      title: "EUX Senior Product Designer",
      company: "Lowe's Companies, Inc. (2025)",
      image: "/assets/images/recommendations/mcassen.jpeg",
      linkedin: "https://www.linkedin.com/in/melodycassen/"
    },
    fullContent: null
  },
  {
    content: "Anthony worked directly on my team and continues to support us from an adjacent team within the same vertical. I had the pleasure of interviewing him when he was joining Lowe's. He was recruited from our stores into our internal talent incubator (Launchpad) program by one of our senior executives, and a few years ago—has it really been that long?!—he officially joined our team.",
    author: {
      name: "Kristin Ludlow",
      title: "Senior UX Leader",
      company: "Lowe's Companies, Inc. (2025)",
      image: "/assets/images/recommendations/kludlow.jpeg",
      linkedin: "https://www.linkedin.com/in/kristinludlow/"
    },
    fullContent: "If you're ever stranded on a deserted island, you want an Anthony. He's a true Swiss Army knife of a designer: deeply versatile, incredibly hardworking, and endlessly curious. He's the first to raise his hand, has no ego, and is remarkably open to coaching and feedback. On top of that, he's kind, funny, sweet-natured, and always ready to lend a hand. Practically speaking, Anthony has been instrumental in maturing our usability testing practice. He builds complex prototypes quickly and manages the tactical side of testing—from organizing logistics and writing scripts to conducting and moderating interviews. He's a flexible designer who can drop into any product space and ramp up fast. He collaborates well with a range of Product Management styles and can hold his own in technical conversations, thanks to his background in coding. He often brings fresh ideas and alternative approaches we hadn't considered, pushing our thinking forward. Anthony is an absolute joy to have on the team. I'm so grateful he chose to stay in Enterprise—especially in Post-Selling. He has a bright, rewarding career ahead of him."
  }
]

export default function Testimonials() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const toggleTestimonial = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <div className={styles.testimonialsSection}>
      <div className={styles.pageHeader}>
        <span className={styles.pageSubtitle}>
          <i className="far fa-comment"></i> Testimonials
        </span>
        <h2 className={styles.pageTitle}>
          Trusted by <span className={styles.highlight}>Many</span>
        </h2>
        <p className={styles.pageDescription}>
          What others have to say about working with me.
        </p>
      </div>
      
      <div className={styles.testimonialsGrid}>
        {testimonials.map((testimonial, index) => (
          <div key={index} className={styles.testimonialCard}>
            <div className={styles.testimonialContent}>
              {testimonial.fullContent ? (
                <>
                  <div className={styles.testimonialPreview}>
                    <p>{testimonial.content}</p>
                  </div>
                  {expandedIndex === index && (
                    <div className={styles.testimonialFull}>
                      <p>{testimonial.fullContent}</p>
                    </div>
                  )}
                  <button
                    className={styles.showMoreBtn}
                    onClick={() => toggleTestimonial(index)}
                  >
                    {expandedIndex === index ? 'Show Less' : 'Show More'}
                  </button>
                </>
              ) : (
                <p>{testimonial.content}</p>
              )}
            </div>
            <div className={styles.testimonialAuthor}>
              <div className={styles.authorImage}>
                <Image
                  src={testimonial.author.image}
                  alt={testimonial.author.name}
                  width={60}
                  height={60}
                />
              </div>
              <div className={styles.authorInfo}>
                <h3>{testimonial.author.name}</h3>
                <p>
                  {testimonial.author.title} <span>{testimonial.author.company}</span>
                </p>
                <a
                  href={testimonial.author.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkedinLink}
                >
                  <i className="fab fa-linkedin"></i> LinkedIn
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

