'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface VerificationResponse {
  message: string
  user?: {
    id: string
    email: string
    firstName: string
    lastName: string
    emailVerified: boolean
  }
}

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading')
  const [message, setMessage] = useState('')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Token de verificación no encontrado')
      return
    }

    verifyEmail(token)
  }, [token])

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationToken }),
      })

      const data: VerificationResponse = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message)
        if (data.user) {
          setUserEmail(data.user.email)
        }
      } else {
        if (data.error?.includes('expirado')) {
          setStatus('expired')
          setMessage('El enlace de verificación ha expirado. Solicita uno nuevo.')
        } else {
          setStatus('error')
          setMessage(data.error || 'Error verificando el email')
        }
      }
    } catch (error) {
      console.error('Error verificando email:', error)
      setStatus('error')
      setMessage('Error de conexión. Inténtalo de nuevo.')
    }
  }

  const resendVerification = async () => {
    if (!userEmail) {
      setMessage('No se pudo obtener el email. Contacta soporte.')
      return
    }

    try {
      setStatus('loading')
      setMessage('Enviando nuevo email de verificación...')

      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('Nuevo email de verificación enviado. Revisa tu bandeja de entrada.')
      } else {
        setStatus('error')
        setMessage(data.error || 'Error enviando email de verificación')
      }
    } catch (error) {
      console.error('Error reenviando verificación:', error)
      setStatus('error')
      setMessage('Error de conexión. Inténtalo de nuevo.')
    }
  }

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Verificando tu email...</h2>
            <p className="text-gray-600">Por favor espera un momento</p>
          </div>
        )

      case 'success':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Email verificado!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <Link 
                href="/"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ir al inicio
              </Link>
              <Link 
                href="/courses"
                className="block text-blue-600 hover:text-blue-700 transition-colors"
              >
                Explorar cursos
              </Link>
            </div>
          </div>
        )

      case 'expired':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Enlace expirado</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={resendVerification}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reenviar email de verificación
            </button>
          </div>
        )

      case 'error':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error de verificación</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <button
                onClick={resendVerification}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reenviar email de verificación
              </button>
              <Link 
                href="/contacto"
                className="block text-blue-600 hover:text-blue-700 transition-colors"
              >
                Contactar soporte
              </Link>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              eGrow Academy
            </h1>
          </Link>
          <p className="text-gray-600 mt-2">Verificación de cuenta</p>
        </div>

        {renderContent()}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            ¿Tienes problemas?{' '}
            <Link href="/contacto" className="text-blue-600 hover:text-blue-700">
              Contacta soporte
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 