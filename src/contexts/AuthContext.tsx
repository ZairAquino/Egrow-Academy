'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  username?: string
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

  // Función para obtener usuario desde el endpoint /api/auth/me
  const fetchUserFromAPI = async (): Promise<User | null> => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include'
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
    
    const apiUser = await fetchUserFromAPI()
    if (apiUser) {
      setUser(apiUser)
      setStatus('authenticated')
    } else {
      setUser(null)
      setStatus('unauthenticated')
    }
  }

  // Función de logout
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      
      setUser(null)
      setStatus('unauthenticated')
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
    logout,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}