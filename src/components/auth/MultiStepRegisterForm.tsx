'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface FormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  username: string
  country: string
  verificationCode: string
}

export default function MultiStepRegisterForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    country: '',
    verificationCode: ''
  })

  const [emailValid, setEmailValid] = useState<boolean | null>(null)
  const [passwordValid, setPasswordValid] = useState(false)
  const [passwordsMatch, setPasswordsMatch] = useState(false)

  useEffect(() => {
    // Validar email
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      setEmailValid(emailRegex.test(formData.email))
    }

    // Validar contraseña
    if (formData.password) {
      setPasswordValid(formData.password.length >= 6)
    }

    // Validar que las contraseñas coincidan
    if (formData.confirmPassword) {
      setPasswordsMatch(formData.password === formData.confirmPassword)
    }
  }, [formData.email, formData.password, formData.confirmPassword])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.firstName.trim() !== '' && formData.lastName.trim() !== ''
      case 2:
        return emailValid === true
      case 3:
        return passwordValid && passwordsMatch
      case 4:
        return true
      case 5:
        return formData.verificationCode.trim() !== ''
      default:
        return false
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 2) {
        saveGmailToStorage(formData.email)
      }
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1))
  }

  const saveGmailToStorage = (email: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gmailForQuickSelect', email)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          country: formData.country
        }),
      })

      if (response.ok) {
        setCurrentStep(5)
      } else {
        const error = await response.json()
        alert(error.message || 'Error al crear la cuenta')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  const handleVerification = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          verificationCode: formData.verificationCode
        }),
      })

      if (response.ok) {
        router.push('/login?verified=true')
      } else {
        const error = await response.json()
        alert(error.message || 'Código de verificación incorrecto')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al verificar el código')
    } finally {
      setLoading(false)
    }
  }

  // Estilos
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '1rem',
    position: 'relative' as const,
    overflow: 'hidden'
  }

  const overlayStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    zIndex: 1
  }

  const contentStyle = {
    position: 'relative' as const,
    zIndex: 2,
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '2rem',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    maxWidth: '500px',
    width: '100%',
    animation: 'slideIn 0.5s ease-out'
  }

  const headerStyle = {
    textAlign: 'center' as const,
    marginBottom: '2rem'
  }

  const titleStyle = {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 0.5rem 0',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text' as const,
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  }

  const subtitleStyle = {
    fontSize: '1rem',
    color: '#6b7280',
    margin: 0,
    fontWeight: '500'
  }

  const formStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem'
  }

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem'
  }

  const labelStyle = {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.5rem',
    display: 'block'
  }

  const modernInputStyle = {
    width: '100%',
    padding: '0.875rem 1rem',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    background: 'rgba(255, 255, 255, 0.9)',
    color: '#1f2937',
    outline: 'none',
    boxSizing: 'border-box' as const
  }

  const mobileStyle = `
    @media (max-width: 768px) {
      .register-form-container {
        padding: 1rem !important;
        margin: 0.5rem !important;
        border-radius: 15px !important;
      }
      .register-step-title {
        font-size: 1.5rem !important;
      }
      .register-step-subtitle {
        font-size: 0.9rem !important;
      }
      .register-form-input {
        font-size: 16px !important;
      }
    }
  `

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <style dangerouslySetInnerHTML={{ __html: mobileStyle }} />
            <div style={containerStyle} className="register-form-container">
              <div style={overlayStyle}></div>
              <div style={contentStyle}>
                <div style={headerStyle}>
                  <h2 style={titleStyle} className="register-step-title">👤 Información Personal</h2>
                  <p style={subtitleStyle} className="register-step-subtitle">Comencemos con tu nombre completo</p>
                </div>

                <div style={formStyle} className="register-step-content">
                  <div style={{ ...inputGroupStyle, gridTemplateColumns: '1fr 1fr' }} className="register-name-grid">
                    <div>
                      <label htmlFor="firstName" style={labelStyle} className="register-form-label">Nombre</label>
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Tu nombre"
                        style={modernInputStyle}
                        className="register-form-input"
                      />
                    </div>

                    <div>
                      <label htmlFor="lastName" style={labelStyle} className="register-form-label">Apellido</label>
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Tu apellido"
                        style={modernInputStyle}
                        className="register-form-input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )

      case 2:
        return (
          <>
            <style dangerouslySetInnerHTML={{ __html: mobileStyle }} />
            <div style={containerStyle} className="register-form-container">
              <div style={overlayStyle}></div>
              <div style={contentStyle}>
                <div style={headerStyle}>
                  <h2 style={titleStyle} className="register-step-title">📧 Correo Electrónico</h2>
                  <p style={subtitleStyle} className="register-step-subtitle">Ingresa tu correo para crear tu cuenta</p>
                </div>

                <div style={formStyle} className="register-step-content">
                  <div style={inputGroupStyle}>
                    <div>
                      <label htmlFor="email" style={labelStyle} className="register-form-label">Correo electrónico</label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="tu@email.com"
                        style={modernInputStyle}
                        className="register-form-input"
                      />
                      {formData.email && (
                        <div style={{
                          marginTop: '0.75rem',
                          fontSize: '0.875rem',
                          color: emailValid === true ? '#059669' : emailValid === false ? '#dc2626' : '#6b7280',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontWeight: '600'
                        }}>
                          {emailValid === true ? (
                            <>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="#059669">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                              </svg>
                              Email válido
                            </>
                          ) : emailValid === false ? (
                            <>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="#dc2626">
                                <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                              </svg>
                              Correo no válido
                            </>
                          ) : (
                            <>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="#6b7280">
                                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                              </svg>
                              Ingresa un correo válido
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )

      case 3:
        return (
          <>
            <style dangerouslySetInnerHTML={{ __html: mobileStyle }} />
            <div style={containerStyle} className="register-form-container">
              <div style={overlayStyle}></div>
              <div style={contentStyle}>
                <div style={headerStyle}>
                  <h2 style={titleStyle} className="register-step-title">🔒 Contraseña Segura</h2>
                  <p style={subtitleStyle} className="register-step-subtitle">Crea una contraseña segura para tu cuenta</p>
                </div>

                <div style={formStyle} className="register-step-content">
                  <div style={{ ...inputGroupStyle, gap: '0.75rem' }}>
                    <div>
                      <label htmlFor="password" style={labelStyle} className="register-form-label">Contraseña</label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        required
                        minLength={6}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Mínimo 6 caracteres"
                        style={{ 
                          ...modernInputStyle, 
                          padding: '0.75rem 1rem',
                          borderColor: formData.password ? (passwordValid ? '#059669' : '#dc2626') : '#e5e7eb' 
                        }}
                        className="register-form-input"
                      />
                      {formData.password && (
                        <div style={{
                          marginTop: '0.25rem',
                          fontSize: '0.75rem',
                          color: passwordValid ? '#059669' : '#dc2626',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontWeight: '600'
                        }} className="password-validation">
                          {passwordValid ? (
                            <>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="#059669">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                              </svg>
                              Contraseña válida
                            </>
                          ) : (
                            <>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="#dc2626">
                                <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                              </svg>
                              Mínimo 6 caracteres
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" style={labelStyle} className="register-form-label">Confirmar contraseña</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        required
                        minLength={6}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Repite tu contraseña"
                        style={{ 
                          ...modernInputStyle, 
                          padding: '0.75rem 1rem',
                          borderColor: formData.confirmPassword ? (passwordsMatch ? '#059669' : '#dc2626') : '#e5e7eb' 
                        }}
                        className="register-form-input"
                      />
                      {formData.confirmPassword && (
                        <div style={{
                          marginTop: '0.25rem',
                          fontSize: '0.75rem',
                          color: passwordsMatch ? '#059669' : '#dc2626',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontWeight: '600'
                        }} className="password-match-validation">
                          {passwordsMatch ? (
                            <>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="#059669">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                              </svg>
                              Las contraseñas coinciden
                            </>
                          ) : (
                            <>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="#dc2626">
                                <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                              </svg>
                              Las contraseñas no coinciden
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )

      case 4:
        return (
          <>
            <style dangerouslySetInnerHTML={{ __html: mobileStyle }} />
            <div style={containerStyle} className="register-form-container">
              <div style={overlayStyle}></div>
              <div style={contentStyle}>
                <div style={headerStyle}>
                  <h2 style={titleStyle} className="register-step-title">🌍 País</h2>
                  <p style={subtitleStyle} className="register-step-subtitle">Selecciona tu país de residencia</p>
                </div>

                <div style={formStyle} className="register-step-content">
                  <div style={inputGroupStyle}>
                    <div>
                      <label htmlFor="country" style={labelStyle} className="register-form-label">País</label>
                      <select
                        name="country"
                        id="country"
                        required
                        value={formData.country}
                        onChange={handleChange}
                        style={modernInputStyle}
                        className="register-form-input"
                      >
                        <option value="">Selecciona tu país</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Bolivia">Bolivia</option>
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
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )

      case 5:
        return (
          <>
            <style dangerouslySetInnerHTML={{ __html: mobileStyle }} />
            <div style={containerStyle} className="register-form-container">
              <div style={overlayStyle}></div>
              <div style={contentStyle}>
                <div style={headerStyle}>
                  <h2 style={titleStyle} className="register-step-title">✅ Verificación</h2>
                  <p style={subtitleStyle} className="register-step-subtitle">Ingresa el código de verificación enviado a tu email</p>
                </div>

                <div style={formStyle} className="register-step-content">
                  <div style={inputGroupStyle}>
                    <div>
                      <label htmlFor="verificationCode" style={labelStyle} className="register-form-label">Código de verificación</label>
                      <input
                        type="text"
                        name="verificationCode"
                        id="verificationCode"
                        required
                        value={formData.verificationCode}
                        onChange={handleChange}
                        placeholder="Ingresa el código de 6 dígitos"
                        style={modernInputStyle}
                        className="register-form-input"
                        maxLength={6}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div>
      {renderStep()}
      
      {/* Navegación */}
      {currentStep <= 5 && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '1rem',
          zIndex: 1000,
          maxWidth: '500px',
          width: '90%'
        }}>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.9)',
                color: '#667eea',
                fontWeight: '700',
                padding: '1rem 2rem',
                borderRadius: '15px',
                border: '2px solid #667eea',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.05em',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#667eea'
                e.currentTarget.style.color = 'white'
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(102, 126, 234, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'
                e.currentTarget.style.color = '#667eea'
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              className="register-nav-button"
            >
              ← Anterior
            </button>
          )}
          
          <button
            type="button"
            onClick={
              currentStep === 4 ? handleSubmit : 
              currentStep === 5 ? handleVerification : 
              nextStep
            }
            disabled={
              loading || 
              (currentStep === 3 && (!passwordValid || !passwordsMatch)) ||
              (currentStep === 5 && !formData.verificationCode.trim())
            }
            style={{
              flex: 1,
              background: loading || 
                (currentStep === 3 && (!passwordValid || !passwordsMatch)) ||
                (currentStep === 5 && !formData.verificationCode.trim()) ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: '700',
              padding: '1rem 2rem',
              borderRadius: '15px',
              border: 'none',
              fontSize: '1rem',
              cursor: loading || 
                (currentStep === 3 && (!passwordValid || !passwordsMatch)) ||
                (currentStep === 5 && !formData.verificationCode.trim()) ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.05em',
              boxShadow: loading || 
                (currentStep === 3 && (!passwordValid || !passwordsMatch)) ||
                (currentStep === 5 && !formData.verificationCode.trim()) ? 'none' : '0 10px 25px -5px rgba(102, 126, 234, 0.4)'
            }}
            className="register-nav-button"
          >
            {loading ? (
              <>
                <span style={{
                  width: '18px',
                  height: '18px',
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></span>
                {currentStep === 4 ? 'Creando cuenta...' : 'Verificando...'}
              </>
            ) : currentStep === 4 ? (
              '🚀 Crear cuenta'
            ) : currentStep === 5 ? (
              '✅ Verificar código'
            ) : (
              'Siguiente →'
            )}
          </button>
        </div>
      )}
      
      {/* Botón Volver al inicio */}
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <a href="/" style={{
          color: '#667eea',
          textDecoration: 'none',
          fontSize: '0.9rem',
          fontWeight: '600',
          opacity: 0.8,
          transition: 'opacity 0.3s ease',
          textTransform: 'uppercase' as const,
          letterSpacing: '0.05em'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.8'
        }}
        >
          ← Volver al inicio
        </a>
      </div>
    </div>
  )
} 