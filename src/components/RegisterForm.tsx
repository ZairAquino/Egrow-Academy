'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    username: ''
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

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden. Verifica que ambas sean iguales')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Importante para incluir cookies
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username || undefined
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Error al registrar la cuenta')
        return
      }

      // Mostrar mensaje de éxito
      setSuccess(data.message || '¡Cuenta creada exitosamente!')
      
      // El token se guarda automáticamente en cookies HTTP-only
      // Ya no necesitamos localStorage para el token
      
      // Redirigir al home después de un breve delay
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

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: error ? '2px solid #ef4444' : '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    outline: 'none',
    backgroundColor: '#f9fafb'
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#667eea';
    e.target.style.backgroundColor = '#ffffff';
    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = error ? '#ef4444' : '#e5e7eb';
    e.target.style.backgroundColor = '#f9fafb';
    e.target.style.boxShadow = 'none';
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label htmlFor="firstName" style={{
            display: 'block',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            👤 Nombre
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Tu nombre"
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        <div>
          <label htmlFor="lastName" style={{
            display: 'block',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            👤 Apellido
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Tu apellido"
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
      </div>

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
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      <div>
        <label htmlFor="username" style={{
          display: 'block',
          fontSize: '0.9rem',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          🏷️ Nombre de usuario <span style={{ color: '#9ca3af', fontWeight: 'normal' }}>(opcional)</span>
        </label>
        <input
          type="text"
          name="username"
          id="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="usuario123"
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
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
          minLength={6}
          value={formData.password}
          onChange={handleChange}
          placeholder="Mínimo 6 caracteres"
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" style={{
          display: 'block',
          fontSize: '0.9rem',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          🔑 Confirmar contraseña
        </label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          required
          minLength={6}
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Repite tu contraseña"
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
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
            Creando cuenta...
          </span>
        ) : (
          '🚀 Crear cuenta'
        )}
      </button>

      <div style={{
        fontSize: '0.8rem',
        color: '#9ca3af',
        textAlign: 'center',
        lineHeight: '1.4'
      }}>
        Al registrarte, aceptas nuestros términos de servicio y política de privacidad
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  )
}