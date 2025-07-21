'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// PÁGINA TEMPORALMENTE DESHABILITADA PARA DEMO
// Los usuarios se verifican automáticamente al registrarse

function VerifyEmailContent() {
  const router = useRouter()

  useEffect(() => {
    // Redirigir automáticamente a la página principal
    router.push('/')
  }, [router])



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
          🔄
        </div>
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: '700',
          color: '#1f2937',
          margin: '0 0 0.5rem 0'
        }}>
          Redirigiendo...
        </h1>
        <p style={{
          color: '#6b7280',
          fontSize: '1rem',
          lineHeight: '1.5',
          margin: 0
        }}>
          La verificación de email está temporalmente deshabilitada para la presentación.
          <br />
          Los usuarios se verifican automáticamente al registrarse.
        </p>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return <VerifyEmailContent />
} 