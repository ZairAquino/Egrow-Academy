'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refreshUser } = useAuth()
  
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    // Obtener email de los parámetros de URL
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam))
    }
  }, [searchParams])

  useEffect(() => {
    // Countdown para reenvío
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, code }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Error al verificar el código')
        return
      }

      setSuccess('¡Cuenta verificada exitosamente! Redirigiendo...')
      
      // Actualizar contexto de autenticación
      await refreshUser()
      
      // Redirigir después de un breve delay
      setTimeout(() => {
        router.push('/courses')
        router.refresh()
      }, 2000)
    } catch (err) {
      setError('Error de conexión. Verifica tu conexión a internet')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) {
      setError('Email es requerido para reenviar el código')
      return
    }

    setResendLoading(true)
    setError('')

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

      setSuccess('Nuevo código enviado a tu email')
      setCountdown(60) // 60 segundos de espera
    } catch (err) {
      setError('Error de conexión. Verifica tu conexión a internet')
    } finally {
      setResendLoading(false)
    }
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
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{
          margin: '0 auto 1rem',
          textAlign: 'center'
        }}>
          <Image 
            src="/images/egacademylogoblanco.png" 
            alt="eGrow Academy" 
            width={200}
            height={60}
            style={{ marginBottom: '1rem' }}
          />
        </div>
        
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: '700',
          color: '#1f2937',
          margin: '0 0 0.5rem 0'
        }}>
          🔐 Verifica tu cuenta
        </h1>
        
        <p style={{
          color: '#6b7280',
          fontSize: '1rem',
          lineHeight: '1.5',
          margin: '0 0 2rem 0'
        }}>
          Hemos enviado un código de verificación a tu email. 
          Ingresa el código para activar tu cuenta.
        </p>

        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#16a34a',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="email" style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem',
              textAlign: 'left'
            }}>
              📧 Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                outline: 'none',
                backgroundColor: '#f9fafb'
              }}
            />
          </div>

          <div>
            <label htmlFor="code" style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem',
              textAlign: 'left'
            }}>
              🔢 Código de verificación
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              required
              maxLength={6}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '1.5rem',
                textAlign: 'center',
                letterSpacing: '0.5rem',
                fontFamily: 'monospace',
                transition: 'all 0.3s ease',
                outline: 'none',
                backgroundColor: '#f9fafb'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '1rem',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Verificando...' : '✅ Verificar cuenta'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
          <p style={{
            color: '#6b7280',
            fontSize: '0.9rem',
            margin: '0 0 1rem 0'
          }}>
            ¿No recibiste el código?
          </p>
          
          <button
            onClick={handleResend}
            disabled={resendLoading || countdown > 0}
            style={{
              background: 'transparent',
              color: countdown > 0 ? '#9ca3af' : '#667eea',
              padding: '0.75rem 1.5rem',
              border: `2px solid ${countdown > 0 ? '#e5e7eb' : '#667eea'}`,
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: countdown > 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {resendLoading ? 'Enviando...' : 
             countdown > 0 ? `Reenviar en ${countdown}s` : '🔄 Reenviar código'}
          </button>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <button
            onClick={() => router.push('/login')}
            style={{
              background: 'transparent',
              color: '#6b7280',
              padding: '0.5rem 1rem',
              border: 'none',
              fontSize: '0.9rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            ← Volver al login
          </button>
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
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
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{
          margin: '0 auto 1rem',
          textAlign: 'center'
        }}>
          <Image 
            src="/images/egacademylogoblanco.png" 
            alt="eGrow Academy" 
            width={200}
            height={60}
            style={{ marginBottom: '1rem' }}
          />
        </div>
        <p>Cargando...</p>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerifyEmailContent />
    </Suspense>
  )
} 