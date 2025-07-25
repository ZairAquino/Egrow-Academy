'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { validateEmail } from '@/lib/email-validation'

export default function RegisterForm() {
  const router = useRouter()
  const { refreshUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [emailSuggestions, setEmailSuggestions] = useState<string[]>([])
  const [emailValid, setEmailValid] = useState<boolean | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    username: '',
    country: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError('')
    
    // Validar email en tiempo real
    if (e.target.name === 'email') {
      const email = e.target.value
      if (email) {
        const validation = validateEmail(email)
        setEmailValid(validation.isValid)
      } else {
        setEmailValid(null)
      }
    }
  }

  // Función para guardar email Gmail en localStorage
  const saveGmailToStorage = (email: string) => {
    if (!email.includes('@gmail.com') || !validateEmail(email).isValid) return

    try {
      const saved = localStorage.getItem('gmail-accounts')
      const emails = saved ? JSON.parse(saved) : []
      const updatedEmails = [...new Set([email, ...emails])].slice(0, 5) // Máximo 5 emails
      localStorage.setItem('gmail-accounts', JSON.stringify(updatedEmails))
    } catch (error) {
      console.error('Error saving Gmail to storage:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setEmailSuggestions([])

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
          username: formData.username || undefined,
          country: formData.country || undefined
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Error al registrar la cuenta')
        if (data.suggestions) {
          setEmailSuggestions(data.suggestions)
        }
        return
      }

      // Guardar email Gmail en localStorage si corresponde y es válido
      if (emailValid) {
        saveGmailToStorage(formData.email)
      }

      // Mostrar mensaje de éxito
      setSuccess('¡Cuenta creada exitosamente! Revisa tu correo electrónico para verificar tu cuenta.')
      
      // Redirigir a la página de verificación después de un breve delay
      setTimeout(() => {
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`)
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
        Crea tu cuenta y comienza a aprender IA
      </div>

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
          {formData.email && (
            <div style={{
              marginTop: '0.5rem',
              fontSize: '0.8rem',
              color: emailValid === true ? '#059669' : emailValid === false ? '#dc2626' : '#6b7280',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              {emailValid === true ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#059669">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Email válido
                </>
              ) : emailValid === false ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#dc2626">
                    <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Correo no válido - Usa un proveedor confiable
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#6b7280">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                  </svg>
                  Ingresa un correo válido
                </>
              )}
            </div>
          )}
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
          <label htmlFor="country" style={{
            display: 'block',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            🌍 País <span style={{ color: '#9ca3af', fontWeight: 'normal' }}>(opcional)</span>
          </label>
          <select
            name="country"
            id="country"
            value={formData.country}
            onChange={handleChange}
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            <option value="">Selecciona tu país</option>
            <option value="Argentina">Argentina</option>
            <option value="Bolivia">Bolivia</option>
            <option value="Brasil">Brasil</option>
            <option value="Chile">Chile</option>
            <option value="Colombia">Colombia</option>
            <option value="Costa Rica">Costa Rica</option>
            <option value="Cuba">Cuba</option>
            <option value="Ecuador">Ecuador</option>
            <option value="El Salvador">El Salvador</option>
            <option value="España">España</option>
            <option value="Guatemala">Guatemala</option>
            <option value="Honduras">Honduras</option>
            <option value="México">México</option>
            <option value="Nicaragua">Nicaragua</option>
            <option value="Panamá">Panamá</option>
            <option value="Paraguay">Paraguay</option>
            <option value="Perú">Perú</option>
            <option value="Puerto Rico">Puerto Rico</option>
            <option value="República Dominicana">República Dominicana</option>
            <option value="Uruguay">Uruguay</option>
            <option value="Venezuela">Venezuela</option>
            <option value="Estados Unidos">Estados Unidos</option>
            <option value="Canadá">Canadá</option>
            <option value="Reino Unido">Reino Unido</option>
            <option value="Francia">Francia</option>
            <option value="Alemania">Alemania</option>
            <option value="Italia">Italia</option>
            <option value="Portugal">Portugal</option>
            <option value="Otro">Otro</option>
          </select>
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
            
            {/* Mostrar sugerencias de correo si existen */}
            {emailSuggestions.length > 0 && (
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ 
                  fontSize: '0.85rem', 
                  fontWeight: '600', 
                  marginBottom: '0.5rem',
                  color: '#374151'
                }}>
                  💡 Sugerencias de correo:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {emailSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, email: suggestion }))
                        setError('')
                        setEmailSuggestions([])
                      }}
                      style={{
                        background: '#f3f4f6',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '0.5rem',
                        fontSize: '0.8rem',
                        color: '#374151',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#e5e7eb'
                        e.currentTarget.style.borderColor = '#9ca3af'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f3f4f6'
                        e.currentTarget.style.borderColor = '#d1d5db'
                      }}
                    >
                      📧 {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
              Creando cuenta...
            </>
          ) : (
            <>
              🚀 Crear cuenta
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
          ¿Ya tienes cuenta?{' '}
          <a 
            href="/login" 
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
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  )
}