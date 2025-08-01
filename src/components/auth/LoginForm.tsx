'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { login } = useAuth()
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(formData.email, formData.password)
      showToast('¡Bienvenido de vuelta!', 'success')
      router.push('/my-courses')
      router.refresh()
    } catch (error: any) {
      const errorMessage = error.message || 'Error de conexión'
      setError(errorMessage)
      showToast(errorMessage, 'error')
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (error) setError('')
  }

  return (
    <div style={{
      maxWidth: '750px',
      width: '100%',
      margin: '0 auto',
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '0.5rem'
          }}>
            Iniciar Sesión
          </h2>
          <p style={{
            color: '#6b7280',
            fontSize: '0.875rem'
          }}>
            Accede a tu cuenta de eGrow Academy
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Email */}
          <div>
            <label htmlFor="email" style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '2px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.3s ease',
                outline: 'none'
              }}
              placeholder="tu@email.com"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '2px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.3s ease',
                outline: 'none'
              }}
              placeholder="Tu contraseña"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#dc2626',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          {/* Botón Principal */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.875rem 1.5rem',
              backgroundColor: loading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              minHeight: '48px'
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Iniciando sesión...
              </>
            ) : (
              <>
                <span>🔐</span>
                Iniciar Sesión
              </>
            )}
          </button>

          {/* Botón Secundario */}
          <button
            type="button"
            onClick={() => router.push('/register')}
            style={{
              width: '100%',
              padding: '0.875rem 1.5rem',
              backgroundColor: 'white',
              color: '#3b82f6',
              border: '2px solid #3b82f6',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              minHeight: '48px'
            }}
          >
            <span>👤</span>
            Crear Cuenta Nueva
          </button>

          {/* Links adicionales */}
          <div style={{
            textAlign: 'center',
            marginTop: '1rem',
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            <a 
              href="/forgot-password"
              style={{
                color: '#3b82f6',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Botón Ir a Inicio */}
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <a href="/" style={{
              color: '#3b82f6',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '600',
              opacity: 0.8,
              transition: 'opacity 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.8'
            }}
            >
              ← Ir a Inicio
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}