'use client'

import { useState, useEffect } from 'react'
import styles from './ContactForm.module.css'

export default function ContactForm() {
  const [mathProblem, setMathProblem] = useState<{ problem: string; answer: number } | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [showSubmit, setShowSubmit] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    generateMathProblem()
  }, [])

  const generateMathProblem = () => {
    const operations = ['+', '-', '×']
    const operation = operations[Math.floor(Math.random() * operations.length)]
    let num1, num2, answer

    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * 10) + 1
        num2 = Math.floor(Math.random() * 10) + 1
        answer = num1 + num2
        break
      case '-':
        num1 = Math.floor(Math.random() * 10) + 6
        num2 = Math.floor(Math.random() * 5) + 1
        answer = num1 - num2
        break
      case '×':
        num1 = Math.floor(Math.random() * 5) + 1
        num2 = Math.floor(Math.random() * 5) + 1
        answer = num1 * num2
        break
      default:
        answer = 0
    }

    setMathProblem({
      problem: `${num1} ${operation} ${num2} = ?`,
      answer
    })
    setUserAnswer('')
    setShowSubmit(false)
    setError('')
  }

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUserAnswer(value)
    
    if (mathProblem && parseInt(value) === mathProblem.answer) {
      setShowSubmit(true)
      setError('')
    } else {
      setShowSubmit(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!mathProblem || parseInt(userAnswer) !== mathProblem.answer) {
      setError('Incorrect answer. Please try again.')
      generateMathProblem()
      return
    }

    const form = e.currentTarget
    const formData = new FormData(form)
    
    try {
      const response = await fetch('https://formspree.io/f/xnnvnywd', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })

      if (response.ok) {
        window.location.href = '/success'
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    }
  }

  return (
    <div className={styles.contactForm}>
      <form id="contact-form" onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Your email:</label>
          <input
            type="email"
            id="email"
            name="email"
            className={styles.formControl}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="message">Your message:</label>
          <textarea
            id="message"
            name="message"
            className={styles.formControl}
            required
          ></textarea>
        </div>
        
        <div className={styles.verificationGroup}>
          <label>Prove you're human</label>
          {mathProblem && (
            <>
              <div className={styles.mathProblem}>{mathProblem.problem}</div>
              <input
                type="number"
                id="verification"
                name="verification"
                className={styles.formControl}
                required
                placeholder="Enter your answer"
                value={userAnswer}
                onChange={handleAnswerChange}
              />
              {error && <div className={styles.errorMessage}>{error}</div>}
              <div className={styles.verificationMessage}>
                Solve this to reveal the submit button
              </div>
            </>
          )}
        </div>
        
        {showSubmit && (
          <button type="submit" className={styles.submitBtn}>
            <span className={styles.buttonText}>Send</span>
          </button>
        )}
      </form>
    </div>
  )
}

