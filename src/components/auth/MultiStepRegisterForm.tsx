'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { validateEmail } from '@/lib/email-validation'
import StepIndicator from './StepIndicator'

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
  const { refreshUser } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [emailValid, setEmailValid] = useState<boolean | null>(null)
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null)
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null)
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

  const totalSteps = 6

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    
    if (error) setError('')
    
    if (e.target.name === 'email') {
      const email = e.target.value
      if (email) {
        const validation = validateEmail(email)
        setEmailValid(validation.isValid)
      } else {
        setEmailValid(null)
      }
    }
    
    // Validación de contraseña en tiempo real
    if (e.target.name === 'password') {
      const password = e.target.value
      if (password) {
        setPasswordValid(password.length >= 6)
        // Verificar si las contraseñas coinciden
        if (formData.confirmPassword) {
          setPasswordsMatch(password === formData.confirmPassword)
        }
      } else {
        setPasswordValid(null)
        setPasswordsMatch(null)
      }
    }
    
    // Validación de confirmación de contraseña en tiempo real
    if (e.target.name === 'confirmPassword') {
      const confirmPassword = e.target.value
      if (confirmPassword && formData.password) {
        setPasswordsMatch(confirmPassword === formData.password)
      } else if (confirmPassword && !formData.password) {
        setPasswordsMatch(null)
      } else {
        setPasswordsMatch(null)
      }
    }
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
          setError('Por favor completa tu nombre y apellido')
          return false
        }
        break
      case 2:
        if (!formData.email.trim()) {
          setError('Por favor ingresa tu correo electrónico')
          return false
        }
        if (!emailValid) {
          setError('Por favor ingresa un correo electrónico válido')
          return false
        }
        break
      case 3:
        if (!formData.password) {
          setError('Por favor ingresa una contraseña')
          return false
        }
        if (formData.password.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres')
          return false
        }
        if (!formData.confirmPassword) {
          setError('Por favor confirma tu contraseña')
          return false
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Las contraseñas no coinciden. Verifica que ambas sean iguales')
          return false
        }
        break
      case 4:
        if (!formData.username.trim()) {
          setError('Por favor ingresa un nombre de usuario')
          return false
        }
        if (!formData.country) {
          setError('Por favor selecciona tu país')
          return false
        }
        break
    }
    return true
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setError('')
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const prevStep = () => {
    setError('')
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const saveGmailToStorage = (email: string) => {
    if (!email.includes('@gmail.com') || !validateEmail(email).isValid) return

    try {
      const saved = localStorage.getItem('gmail-accounts')
      const emails = saved ? JSON.parse(saved) : []
      const updatedEmails = [...new Set([email, ...emails])].slice(0, 5)
      localStorage.setItem('gmail-accounts', JSON.stringify(updatedEmails))
    } catch (error) {
      console.error('Error saving Gmail to storage:', error)
    }
  }

  const handleSubmit = async () => {
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          country: formData.country
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Error al registrar la cuenta')
        return
      }

      if (emailValid) {
        saveGmailToStorage(formData.email)
      }

      setSuccess('¡Cuenta creada exitosamente!')
      setCurrentStep(5) // Ir al paso de verificación
    } catch (err) {
      setError('Error de conexión. Verifica tu conexión a internet')
    } finally {
      setLoading(false)
    }
  }

  const handleVerification = async () => {
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          code: formData.verificationCode
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Código de verificación incorrecto')
        return
      }

      // El endpoint de verificación ya hace login automático y establece cookies
      // Actualizar el contexto de autenticación
      await refreshUser()

      setSuccess('¡Email verificado exitosamente!')
      setCurrentStep(6) // Ir al paso de bienvenida
      
      // Esperar un momento para que el contexto se actualice completamente
      setTimeout(async () => {
        // Forzar una actualización del contexto antes de redirigir
        await refreshUser()
        
        // Verificar que el usuario esté autenticado antes de redirigir
        const authResponse = await fetch('/api/auth/me', {
          credentials: 'include'
        })
        
                 if (authResponse.ok) {
           router.push('/')
           router.refresh()
         } else {
           // Si no está autenticado, intentar login manual
           const loginResponse = await fetch('/api/auth/login', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             credentials: 'include',
             body: JSON.stringify({
               email: formData.email,
               password: formData.password
             })
           })
           
           if (loginResponse.ok) {
             await refreshUser()
             router.push('/')
             router.refresh()
           }
         }
      }, 2000)
    } catch (err) {
      setError('Error de conexión. Verifica tu conexión a internet')
    } finally {
      setLoading(false)
    }
  }

  const getInputStyle = (customBorderColor?: string) => ({
    width: '100%',
    padding: '0.75rem 1rem',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: customBorderColor || (error ? '#ef4444' : '#e5e7eb'),
    borderRadius: '12px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    outline: 'none',
    backgroundColor: '#f9fafb'
  })

  const inputStyle = getInputStyle()

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = '#667eea'
    e.target.style.backgroundColor = '#ffffff'
    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    // No modificar borderColor aquí para evitar conflictos
    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'
    e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  }

  const renderStep = () => {
    // Nuevo diseño minimalista y moderno
    const containerStyle = {
      display: 'flex',
      flexDirection: 'column' as const,
      height: '400px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '20px',
      padding: '2rem',
      position: 'relative' as const,
      overflow: 'hidden'
    }
    
    // Agregar estilos responsivos
    const mobileStyle = `
      @media (max-width: 768px) {
        .register-form-container {
          height: 350px !important;
          padding: 1.5rem !important;
        }
        .register-step-title {
          font-size: 1.75rem !important;
          margin-bottom: 1.5rem !important;
        }
        .register-step-subtitle {
          font-size: 0.875rem !important;
          margin-bottom: 1rem !important;
        }
        .register-form-label {
          font-size: 0.875rem !important;
          margin-bottom: 0.5rem !important;
        }
        .register-form-input {
          padding: 0.75rem 1rem !important;
          font-size: 0.875rem !important;
        }
        .register-name-grid {
          gap: 1rem !important;
        }
        .register-step-content {
          gap: 1rem !important;
        }
        .register-nav-button {
          padding: 0.75rem 1.5rem !important;
          font-size: 0.875rem !important;
        }
        .password-validation {
          font-size: 0.6875rem !important;
          gap: 0.125rem !important;
        }
      }
      @media (max-width: 480px) {
        .register-form-container {
          height: 320px !important;
          padding: 1rem !important;
        }
        .register-step-title {
          font-size: 1.5rem !important;
          margin-bottom: 1rem !important;
          line-height: 1.1 !important;
        }
        .register-step-subtitle {
          font-size: 0.8125rem !important;
          margin-bottom: 0.75rem !important;
        }
        .register-form-label {
          font-size: 0.8125rem !important;
          margin-bottom: 0.375rem !important;
        }
        .register-form-input {
          padding: 0.625rem 0.875rem !important;
          font-size: 0.8125rem !important;
        }
        .register-name-grid {
          grid-template-columns: 1fr !important;
          gap: 0.75rem !important;
        }
        .register-step-content {
          gap: 0.75rem !important;
        }
        .register-nav-button {
          padding: 0.625rem 1.25rem !important;
          font-size: 0.8125rem !important;
        }
        .password-validation {
          font-size: 0.625rem !important;
        }
      }
    `

    const overlayStyle = {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }

    const contentStyle = {
      position: 'relative' as const,
      zIndex: 1,
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'space-between'
    }

    const headerStyle = {
      textAlign: 'center' as const,
      marginBottom: '2rem'
    }

    const titleStyle = {
      fontSize: '2rem',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text' as const,
      WebkitTextFillColor: 'transparent',
      marginBottom: '0.5rem'
    }

    const subtitleStyle = {
      color: '#6b7280',
      fontSize: '1rem',
      fontWeight: '500'
    }

    const formStyle = {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1.5rem',
      flex: 1
    }

    const inputGroupStyle = {
      display: 'grid',
      gap: '1.5rem'
    }

    const labelStyle = {
      display: 'block',
      fontSize: '1rem',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '0.75rem',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em'
    }

    const modernInputStyle = {
      width: '100%',
      padding: '1rem 1.25rem',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: '#e5e7eb',
      borderRadius: '15px',
      fontSize: '1rem',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      outline: 'none',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }

    const buttonStyle = {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontWeight: '700',
      padding: '1rem 2rem',
      borderRadius: '15px',
      border: 'none',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 10px 25px -5px rgba(102, 126, 234, 0.4)',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em'
    }

    const secondaryButtonStyle = {
      background: 'rgba(255, 255, 255, 0.9)',
      color: '#667eea',
      fontWeight: '700',
      padding: '1rem 2rem',
      borderRadius: '15px',
      border: '2px solid #667eea',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em'
    }

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
                        onFocus={handleFocus}
                        onBlur={handleBlur}
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
                        onFocus={handleFocus}
                        onBlur={handleBlur}
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
                        onFocus={handleFocus}
                        onBlur={handleBlur}
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
                        onFocus={handleFocus}
                        onBlur={handleBlur}
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
                        onFocus={handleFocus}
                        onBlur={handleBlur}
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
                        }} className="password-validation">
                        {passwordsMatch ? (
                          <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="#059669">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            Contraseñas coinciden
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
                  <h2 style={titleStyle} className="register-step-title">🏷️ Perfil de Usuario</h2>
                  <p style={subtitleStyle} className="register-step-subtitle">Personaliza tu perfil en la plataforma</p>
                </div>

                <div style={formStyle} className="register-step-content">
                  <div style={inputGroupStyle}>
                    <div>
                      <label htmlFor="username" style={labelStyle} className="register-form-label">Nombre de usuario</label>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="usuario123"
                        style={modernInputStyle}
                        className="register-form-input"
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                      />
                    </div>

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
                  <h2 style={titleStyle} className="register-step-title">📧 Verificación de Email</h2>
                  <p style={subtitleStyle} className="register-step-subtitle">Hemos enviado un código a <strong>{formData.email}</strong></p>
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
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        maxLength={6}
                      />
                    </div>
                  </div>

                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '2px solid #10b981',
                  borderRadius: '15px',
                  padding: '1rem',
                  marginTop: '1rem'
                }}>
                  <p style={{ color: '#059669', fontSize: '0.875rem', margin: 0, fontWeight: '600' }}>
                    ✅ Revisa tu bandeja de entrada y spam para encontrar el código
                  </p>
                </div>
              </div>
            </div>
          </>
        )

      case 6:
        return (
          <div style={containerStyle}>
            <div style={overlayStyle}></div>
            <div style={contentStyle}>
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 2rem',
                  fontSize: '3rem',
                  boxShadow: '0 20px 40px -10px rgba(102, 126, 234, 0.5)'
                }}>
                  🎉
                </div>
                
                <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1f2937', marginBottom: '1rem' }}>
                  ¡Bienvenido a eGrow Academy!
                </h2>
                
                <p style={{ color: '#6b7280', fontSize: '1.125rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                  Hola <strong>{formData.firstName}</strong>, tu cuenta ha sido verificada exitosamente.
                </p>
                
                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '2px solid #10b981',
                  borderRadius: '15px',
                  padding: '1.5rem',
                  marginBottom: '2rem'
                }}>
                  <p style={{ color: '#059669', fontSize: '1rem', margin: 0, fontWeight: '600' }}>
                    ✅ Tu cuenta está completamente activa y lista para usar
                  </p>
                </div>
                
                <p style={{ color: '#6b7280', fontSize: '1rem', fontWeight: '500' }}>
                  Redirigiendo a la página de inicio...
                </p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      width: '100%',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      {/* Indicador de pasos */}
      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

      {/* Contenido del paso actual */}
      {renderStep()}

      {/* Mensajes de error */}
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

      {/* Botones de navegación */}
      {currentStep < 6 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
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
      )}
    </div>
  )
} 
