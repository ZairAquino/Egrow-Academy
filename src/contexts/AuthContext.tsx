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
  const fetchUserFromAPI = async (authToken?: string): Promise<User | null> => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      // Si tenemos token, lo incluimos en el header
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
      }
      
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers,
      })
      
      if (response.ok) {
        const data = await response.json()
        return data.user
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
    
    // Obtener token del localStorage o sessionStorage
    const storedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
    setToken(storedToken)
    
    console.log('🔍 AuthContext - Token encontrado:', storedToken ? 'SÍ' : 'NO')
    if (storedToken) {
      console.log('🔍 AuthContext - Token:', storedToken.substring(0, 50) + '...')
    }
    
    const apiUser = await fetchUserFromAPI(storedToken || undefined)
    if (apiUser) {
      setUser(apiUser)
      setStatus('authenticated')
      console.log('✅ AuthContext - Usuario autenticado:', apiUser.email)
    } else {
      setUser(null)
      setStatus('unauthenticated')
      setToken(null)
      console.log('❌ AuthContext - Usuario no autenticado')
      // Limpiar token si no es válido
      localStorage.removeItem('authToken')
      sessionStorage.removeItem('authToken')
    }
  }

  // Función de logout
  const logout = async () => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers,
      })
      
      setUser(null)
      setStatus('unauthenticated')
      setToken(null)
      // Limpiar token del almacenamiento
      localStorage.removeItem('authToken')
      sessionStorage.removeItem('authToken')
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  // Effect para verificar la sesión al cargar la página
  useEffect(() => {
    refreshUser()
  }, [])

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