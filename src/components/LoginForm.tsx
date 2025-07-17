'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginForm() {
  const router = useRouter()
  const { refreshUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Importante para incluir cookies
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Error al iniciar sesión')
        return
      }

      // Mostrar mensaje de éxito
      setSuccess(data.message || '¡Inicio de sesión exitoso!')
      
      // El token se guarda automáticamente en cookies HTTP-only
      // Ya no necesitamos localStorage para el token
      
      // Refrescar el contexto de autenticación
      await refreshUser()
      
      // Redirigir al home después de un breve delay
      setTimeout(() => {
        router.push('/')
        router.refresh()
      }, 1500)
    } catch (err) {
      setError('Error de conexión. Verifica tu conexión a internet')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await signIn('google', {
        callbackUrl: '/',
        redirect: false
      })
      
      if (result?.ok) {
        // Refrescar el contexto de autenticación
        await refreshUser()
        // Redirigir manualmente
        router.push('/')
      } else {
        setError('Error al conectar con Google')
        setGoogleLoading(false)
      }
    } catch (err) {
      setError('Error al conectar con Google')
      setGoogleLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Botón de Google */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={googleLoading}
        style={{
          width: '100%',
          background: googleLoading ? '#9ca3af' : '#ffffff',
          color: '#374151',
          fontWeight: '600',
          padding: '0.875rem 1rem',
          borderRadius: '12px',
          border: '2px solid #e5e7eb',
          fontSize: '1rem',
          cursor: googleLoading ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}
        onMouseEnter={(e) => {
          if (!googleLoading) {
            const target = e.target as HTMLButtonElement;
            target.style.borderColor = '#d1d5db';
            target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
          }
        }}
        onMouseLeave={(e) => {
          if (!googleLoading) {
            const target = e.target as HTMLButtonElement;
            target.style.borderColor = '#e5e7eb';
            target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
          }
        }}
      >
        {googleLoading ? (
          <span style={{
            width: '20px',
            height: '20px',
            border: '2px solid transparent',
            borderTop: '2px solid #374151',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></span>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        {googleLoading ? 'Conectando con Google...' : 'Continuar con Google'}
      </button>

      {/* Separador */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        color: '#9ca3af',
        fontSize: '0.9rem'
      }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
        <span>o</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
      </div>

      {/* Formulario tradicional */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label htmlFor="email" style={{
            display: 'block',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            📧 Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: error ? '2px solid #ef4444' : '2px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              outline: 'none',
              backgroundColor: '#f9fafb'
            }}
            onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
              e.target.style.borderColor = '#667eea';
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
            }}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
              e.target.style.borderColor = error ? '#ef4444' : '#e5e7eb';
              e.target.style.backgroundColor = '#f9fafb';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div>
          <label htmlFor="password" style={{
            display: 'block',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            🔒 Contraseña
          </label>
          <input
            type="password"
            name="password"
            id="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: error ? '2px solid #ef4444' : '2px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              outline: 'none',
              backgroundColor: '#f9fafb'
            }}
            onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
              e.target.style.borderColor = '#667eea';
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
            }}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
              e.target.style.borderColor = error ? '#ef4444' : '#e5e7eb';
              e.target.style.backgroundColor = '#f9fafb';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fca5a5',
            color: '#dc2626',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            ❌ {error}
          </div>
        )}

        {success && (
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #86efac',
            color: '#16a34a',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            ✅ {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: '600',
            padding: '0.875rem 1rem',
            borderRadius: '12px',
            border: 'none',
            fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: loading ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              const target = e.target as HTMLButtonElement;
              target.style.transform = 'translateY(-2px)';
              target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              const target = e.target as HTMLButtonElement;
              target.style.transform = 'translateY(0)';
              target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
            }
          }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <span style={{
                width: '20px',
                height: '20px',
                border: '2px solid transparent',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></span>
              Iniciando sesión...
            </span>
          ) : (
            '🚀 Iniciar sesión'
          )}
        </button>
      </form>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}