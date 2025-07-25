'use client'

import { useState, useEffect } from 'react'

interface GmailQuickSelectProps {
  onEmailSelect: (email: string) => void
  currentEmail: string
}

export default function GmailQuickSelect({ onEmailSelect, currentEmail }: GmailQuickSelectProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [savedEmails, setSavedEmails] = useState<string[]>([])

  // Cargar emails guardados del localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gmail-accounts')
    if (saved) {
      try {
        const emails = JSON.parse(saved)
        setSavedEmails(emails.filter((email: string) => email.includes('@gmail.com')))
      } catch (error) {
        console.error('Error loading saved emails:', error)
      }
    }
  }, [])

  // Guardar email en localStorage
  const saveEmail = (email: string) => {
    if (!email.includes('@gmail.com')) return

    const updatedEmails = [...new Set([...savedEmails, email])].slice(0, 5) // Máximo 5 emails
    setSavedEmails(updatedEmails)
    localStorage.setItem('gmail-accounts', JSON.stringify(updatedEmails))
  }

  // Seleccionar email
  const handleEmailSelect = (email: string) => {
    onEmailSelect(email)
    setShowDropdown(false)
  }

  // Solo mostrar si es Gmail y hay emails guardados
  if (!currentEmail.includes('@gmail.com') || savedEmails.length === 0) {
    return null
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '4px',
          color: '#6b7280',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#667eea'
          e.currentTarget.style.backgroundColor = '#f3f4f6'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#6b7280'
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDropdown && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          marginTop: '4px',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          {savedEmails.map((email, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleEmailSelect(email)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                background: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '0.9rem',
                color: '#374151',
                borderBottom: index < savedEmails.length - 1 ? '1px solid #f3f4f6' : 'none',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#4285F4">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {email}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 