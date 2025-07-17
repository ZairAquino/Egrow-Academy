'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSession } from 'next-auth/react'

interface User {
  id: string
  name: string | null
  email: string | null
  image: string | null
  emailVerified?: Date | null
  isActive?: boolean
  membershipLevel?: string
  lastLogin?: Date | null
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
  const { data: session, status: nextAuthStatus } = useSession()
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
    
    // Primero intentar obtener de NextAuth (Google OAuth)
    if (session?.user) {
      try {
        // Obtener información completa del usuario desde la base de datos
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.user) {
            setUser(data.user)
            setStatus('authenticated')
            return
          }
        }
        
        // Fallback si no se puede obtener de la API
        setUser({
          id: session.user.id || '',
          name: session.user.name || null,
          email: session.user.email || null,
          image: session.user.image || null,
          emailVerified: new Date(),
          isActive: true,
          membershipLevel: 'FREE'
        })
        setStatus('authenticated')
        return
      } catch (error) {
        console.error('Error fetching user details:', error)
        // Fallback en caso de error
        setUser({
          id: session.user.id || '',
          name: session.user.name || null,
          email: session.user.email || null,
          image: session.user.image || null,
          emailVerified: new Date(),
          isActive: true,
          membershipLevel: 'FREE'
        })
        setStatus('authenticated')
        return
      }
    }

    // Si no hay sesión de NextAuth, intentar obtener del sistema manual
    const apiUser = await fetchUserFromAPI()
    if (apiUser) {
      setUser(apiUser)
      setStatus('authenticated')
    } else {
      setUser(null)
      setStatus('unauthenticated')
    }
  }

  // Función de logout unificada
  const logout = async () => {
    try {
      // Logout del sistema manual
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      
      // Logout de NextAuth (si hay sesión)
      if (session) {
        const { signOut } = await import('next-auth/react')
        await signOut({ redirect: false })
      }
      
      setUser(null)
      setStatus('unauthenticated')
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  // Effect para inicializar y manejar cambios en la sesión
  useEffect(() => {
    if (nextAuthStatus === 'loading') {
      setStatus('loading')
      return
    }
    
    refreshUser()
  }, [session, nextAuthStatus])

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