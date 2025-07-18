'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import GmailQuickSelect from './GmailQuickSelect'

export default function LoginForm() {
  const router = useRouter()
  const { refreshUser } = useAuth()
  const [loading, setLoading] = useState(false)
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

  // Función para manejar la selección de email desde GmailQuickSelect
  const handleEmailSelect = (email: string) => {
    setFormData({
      ...formData,
      email
    })
  }

  // Función para guardar email en localStorage después de login exitoso
  const saveEmailToStorage = (email: string) => {
    if (!email.includes('@gmail.com')) return

    try {
      const saved = localStorage.getItem('gmail-accounts')
      const emails = saved ? JSON.parse(saved) : []
      const updatedEmails = [...new Set([email, ...emails])].slice(0, 5) // Máximo 5 emails
      localStorage.setItem('gmail-accounts', JSON.stringify(updatedEmails))
    } catch (error) {
      console.error('Error saving email to storage:', error)
    }
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

      // Guardar email en localStorage si es Gmail
      saveEmailToStorage(formData.email)

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Mensaje informativo */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '1rem',
        borderRadius: '12px',
        textAlign: 'center',
        fontSize: '0.9rem'
      }}>
        <strong>🎓 eGrow Academy</strong><br />
        Inicia sesión con tu correo verificado
      </div>

      {/* Formulario tradicional */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
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
              paddingRight: formData.email.includes('@gmail.com') ? '2.5rem' : '1rem',
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
          {/* Componente de selección rápida de Gmail */}
          <GmailQuickSelect 
            onEmailSelect={handleEmailSelect}
            currentEmail={formData.email}
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

        {/* Mensajes de error y éxito */}
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '0.75rem',
            borderRadius: '8px',
            fontSize: '0.9rem'
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
            fontSize: '0.9rem'
          }}>
            ✅ {success}
          </div>
        )}

        {/* Botón de envío */}
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
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
              Iniciando sesión...
            </>
          ) : (
            <>
              🔐 Iniciar sesión
            </>
          )}
        </button>
      </form>

      {/* Enlaces adicionales */}
      <div style={{
        textAlign: 'center',
        fontSize: '0.9rem',
        color: '#6b7280'
      }}>
        <p>
          ¿No tienes cuenta?{' '}
          <a 
            href="/register" 
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: '600'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            Regístrate aquí
          </a>
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          ¿Olvidaste tu contraseña?{' '}
          <a 
            href="/contacto" 
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: '600'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            Contacta soporte
          </a>
        </p>
      </div>
    </div>
  )
}