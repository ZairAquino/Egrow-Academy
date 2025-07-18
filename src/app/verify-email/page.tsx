'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refreshUser } = useAuth()
  
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [code, setCode] = useState('')
  
  const email = searchParams.get('email') || ''

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!code || code.length !== 6) {
      setError('Por favor, ingresa el código de 6 dígitos')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          code
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Error al verificar el código')
        return
      }

      setSuccess('¡Cuenta verificada exitosamente!')
      
      // Refrescar el contexto de autenticación
      await refreshUser()
      
      // Redirigir al dashboard después de un breve delay
      setTimeout(() => {
        router.push('/')
        router.refresh()
      }, 2000)
    } catch (err) {
      setError('Error de conexión. Verifica tu conexión a internet')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setError('')
    setResendLoading(true)

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Error al reenviar el código')
        return
      }

      setSuccess('Código reenviado. Revisa tu correo electrónico.')
    } catch (err) {
      setError('Error de conexión. Verifica tu conexión a internet')
    } finally {
      setResendLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: error ? '2px solid #ef4444' : '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '1.5rem',
    textAlign: 'center' as const,
    letterSpacing: '0.5rem',
    fontFamily: 'monospace',
    transition: 'all 0.3s ease',
    outline: 'none',
    backgroundColor: '#f9fafb'
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#667eea'
    e.target.style.backgroundColor = '#ffffff'
    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = error ? '#ef4444' : '#e5e7eb'
    e.target.style.backgroundColor = '#f9fafb'
    e.target.style.boxShadow = 'none'
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        maxWidth: '500px',
        width: '100%'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '2rem'
          }}>
            🔐
          </div>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: '700',
            color: '#1f2937',
            margin: '0 0 0.5rem 0'
          }}>
            Verifica tu cuenta
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '1rem',
            lineHeight: '1.5',
            margin: 0
          }}>
            Hemos enviado un código de 6 dígitos a
          </p>
          <p style={{
            color: '#374151',
            fontSize: '1rem',
            fontWeight: '600',
            margin: '0.25rem 0 0 0'
          }}>
            {email}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleVerify} style={{ marginBottom: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="code" style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Código de verificación
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
              maxLength={6}
              required
            />
          </div>

          {/* Mensajes de error y éxito */}
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '0.75rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              marginBottom: '1rem'
            }}>
              ❌ {error}
            </div>
          )}

          {success && (
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#16a34a',
              padding: '0.75rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              marginBottom: '1rem'
            }}>
              ✅ {success}
            </div>
          )}

          {/* Botón de verificación */}
          <button
            type="submit"
            disabled={loading || code.length !== 6}
            style={{
              width: '100%',
              background: loading || code.length !== 6 ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: '600',
              padding: '0.875rem 1rem',
              borderRadius: '12px',
              border: 'none',
              fontSize: '1rem',
              cursor: loading || code.length !== 6 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></span>
                Verificando...
              </>
            ) : (
              <>
                🔓 Verificar cuenta
              </>
            )}
          </button>
        </form>

        {/* Reenviar código */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            color: '#6b7280',
            fontSize: '0.9rem',
            margin: '0 0 1rem 0'
          }}>
            ¿No recibiste el código?
          </p>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading}
            style={{
              background: 'none',
              border: '2px solid #667eea',
              color: '#667eea',
              fontWeight: '600',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              cursor: resendLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (!resendLoading) {
                e.currentTarget.style.background = '#667eea'
                e.currentTarget.style.color = 'white'
              }
            }}
            onMouseLeave={(e) => {
              if (!resendLoading) {
                e.currentTarget.style.background = 'none'
                e.currentTarget.style.color = '#667eea'
              }
            }}
          >
            {resendLoading ? 'Enviando...' : '📧 Reenviar código'}
          </button>
        </div>

        {/* Volver al login */}
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #e5e7eb'
        }}>
          <a 
            href="/login" 
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = 'underline'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = 'none'
            }}
          >
            ← Volver al login
          </a>
        </div>
      </div>
    </div>
  )
} 