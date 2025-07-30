#!/usr/bin/env tsx
import fetch from 'node-fetch'

const BASE_URL = 'http://localhost:3001'

async function testLogin() {
  try {
    console.log('🧪 Probando login del usuario de prueba...')
    
    const loginData = {
      email: 'test@egrow.academy',
      password: 'Test123456'
    }

    console.log('📡 Enviando solicitud de login...')
    
    const response = await fetch(`${BASE_URL}/api/auth/login-test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    })

    const result = await response.json()

    if (response.ok) {
      console.log('✅ ¡Login exitoso!')
      console.log('👤 Usuario:', result.user.firstName, result.user.lastName)
      console.log('📧 Email:', result.user.email)
      console.log('💎 Membership:', result.user.membershipLevel)
      console.log('🔑 Token generado:', result.token ? 'Sí' : 'No')
      console.log('🍪 Cookie establecida:', response.headers.get('set-cookie') ? 'Sí' : 'No')
      
      // Probar acceso a endpoint protegido
      console.log('\n🔒 Probando acceso a endpoint protegido...')
      
      const authResponse = await fetch(`${BASE_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Cookie': response.headers.get('set-cookie') || ''
        }
      })
      
      if (authResponse.ok) {
        const authResult = await authResponse.json()
        console.log('✅ Acceso autorizado')
        console.log('👤 Usuario autenticado:', authResult.user.email)
        console.log('💎 Nivel de membresía:', authResult.user.membershipLevel)
      } else {
        console.log('❌ Error al acceder a endpoint protegido')
      }
      
    } else {
      console.log('❌ Error en login:', result.error)
    }

  } catch (error) {
    console.error('💥 Error:', error)
  }
}

testLogin()