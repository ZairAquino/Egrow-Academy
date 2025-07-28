'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function TestLoginPage() {
  const { user, status, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleMockLogin = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/auth/mock-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email: 'luisdavid.ls47@gmail.com' }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Guardar token en localStorage
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        
        setMessage('✅ Mock login exitoso! Refrescando contexto...');
        
        // Refrescar el contexto de autenticación
        await refreshUser();
        
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        setMessage('❌ Error: ' + data.error);
      }
    } catch (error) {
      setMessage('❌ Error de conexión: ' + error);
    }
    
    setLoading(false);
  };

  const handleRealLogin = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          email: 'test@egrowacademy.com', 
          password: 'password123' 
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        
        setMessage('✅ Login real exitoso! Refrescando contexto...');
        await refreshUser();
        
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        setMessage('❌ Error: ' + data.error);
      }
    } catch (error) {
      setMessage('❌ Error de conexión: ' + error);
    }
    
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      localStorage.removeItem('authToken');
      await refreshUser();
      setMessage('✅ Logout exitoso!');
    } catch (error) {
      setMessage('❌ Error en logout: ' + error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          🧪 Panel de Pruebas de Login
        </h1>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Estado Actual:</h3>
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Usuario:</strong> {user ? user.firstName + ' ' + user.lastName : 'No autenticado'}</p>
          <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
          <p><strong>Membership:</strong> {user?.membershipLevel || 'N/A'}</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleMockLogin}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? '⏳ Cargando...' : '🎭 Mock Login (Usuario Premium)'}
          </button>
          
          <button
            onClick={handleRealLogin}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? '⏳ Cargando...' : '🔐 Login Real (test@egrowacademy.com)'}
          </button>
          
          <button
            onClick={handleLogout}
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            🚪 Logout
          </button>
        </div>
        
        {message && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <p className="text-sm">{message}</p>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <a href="/" className="text-blue-500 hover:underline">
            ← Volver al Home
          </a>
        </div>
      </div>
    </div>
  );
}