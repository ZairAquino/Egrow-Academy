'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  username?: string
  bio?: string
  profileImage?: string
  emailVerified: boolean
  isActive: boolean
  membershipLevel: string
  lastLogin?: Date | null
  createdAt: Date
  updatedAt: Date
}

interface AuthContextType {
  user: User | null
  status: 'loading' | 'authenticated' | 'unauthenticated'
  token: string | null
  isAuthenticated: boolean
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading')
  const [token, setToken] = useState<string | null>(null)

  // Función para obtener usuario desde el endpoint /api/auth/me
  const fetchUserFromAPI = async (): Promise<User | null> => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include', // Incluir cookies automáticamente
      })
      
      if (response.ok) {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json()
          console.log('🔍 [AuthContext] User fetched from API:', data.user?.email, 'Membership:', data.user?.membershipLevel)
          return data.user
        } else {
          console.error('Respuesta no es JSON:', contentType)
          return null
        }
      }
      return null
    } catch (error) {
      console.error('Error fetching user from API:', error)
      return null
    }
  }

  // Función para refrescar la información del usuario
  const refreshUser = async () => {
    setStatus('loading')
    
    console.log('🔍 AuthContext - Verificando autenticación...')
    
    // El token se maneja automáticamente a través de cookies
    const apiUser = await fetchUserFromAPI()
    if (apiUser) {
      setUser(apiUser)
      setStatus('authenticated')
      setToken('cookie-based') // Indicador de que usa cookies
      console.log('✅ AuthContext - Usuario autenticado:', apiUser.email)
    } else {
      setUser(null)
      setStatus('unauthenticated')
      setToken(null)
      console.log('❌ AuthContext - Usuario no autenticado')
    }
  }

  // Función de logout
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Incluir cookies automáticamente
      })
      
      setUser(null)
      setStatus('unauthenticated')
      setToken(null)
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  // Effect para verificar la sesión al cargar la página
  useEffect(() => {
    refreshUser()
  }, [])

  // Effect para actualizar automáticamente cada 30 segundos
  useEffect(() => {
    if (status === 'authenticated' && user) {
      const interval = setInterval(() => {
        console.log('🔄 [AuthContext] Auto-refreshing user data...')
        refreshUser()
      }, 30000) // 30 segundos

      return () => clearInterval(interval)
    }
  }, [status, user]) // Añadir dependencias necesarias

  const value: AuthContextType = {
    user,
    status,
    token,
    isAuthenticated: status === 'authenticated',
    logout,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}