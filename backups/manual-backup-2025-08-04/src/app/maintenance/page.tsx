'use client'

import { useEffect, useState } from 'react'
import { Clock, Settings, RefreshCw, CheckCircle } from 'lucide-react'

interface MaintenanceInfo {
  startTime?: string
  estimatedDuration?: string
  reason?: string
  enabled: boolean
}

export default function MaintenancePage() {
  const [maintenanceInfo, setMaintenanceInfo] = useState<MaintenanceInfo | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [elapsedTime, setElapsedTime] = useState('')

  useEffect(() => {
    // Simular obtener info de mantenimiento (en producción vendría de API)
    const mockInfo: MaintenanceInfo = {
      startTime: new Date().toISOString(),
      estimatedDuration: '15 minutos',
      reason: 'Actualización de contenido y nuevos cursos',
      enabled: true
    }
    setMaintenanceInfo(mockInfo)

    // Actualizar tiempo cada segundo
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      
      if (mockInfo.startTime) {
        const start = new Date(mockInfo.startTime)
        const elapsed = Math.floor((Date.now() - start.getTime()) / 1000 / 60)
        setElapsedTime(`${elapsed} minuto${elapsed !== 1 ? 's' : ''}`)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const checkStatus = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        {/* Logo */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-white animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">eGrow Academy</h1>
        </div>

        {/* Estado de mantenimiento */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            🚧 Sitio en Mantenimiento
          </h2>
          <p className="text-gray-600 mb-4">
            Estamos actualizando nuestros sistemas para brindarte una mejor experiencia.
          </p>
        </div>

        {/* Información del mantenimiento */}
        {maintenanceInfo && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="flex items-center mb-2">
              <Clock className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Información</span>
            </div>
            
            {maintenanceInfo.reason && (
              <p className="text-sm text-gray-600 mb-2">
                <strong>Motivo:</strong> {maintenanceInfo.reason}
              </p>
            )}
            
            {maintenanceInfo.estimatedDuration && (
              <p className="text-sm text-gray-600 mb-2">
                <strong>Duración estimada:</strong> {maintenanceInfo.estimatedDuration}
              </p>
            )}
            
            {elapsedTime && (
              <p className="text-sm text-gray-600">
                <strong>Tiempo transcurrido:</strong> {elapsedTime}
              </p>
            )}
          </div>
        )}

        {/* Progreso visual */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Progreso</span>
            <span className="text-sm text-blue-600">En curso...</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '45%' }}></div>
          </div>
        </div>

        {/* Acciones */}
        <div className="space-y-3">
          <button
            onClick={checkStatus}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Verificar Estado
          </button>
          
          <p className="text-xs text-gray-500">
            La página se actualizará automáticamente cuando el mantenimiento termine
          </p>
        </div>

        {/* Información de contacto */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            ¿Necesitas ayuda urgente?
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <a 
              href="mailto:soporte@egrowacademy.com" 
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              📧 Soporte
            </a>
            <a 
              href="https://twitter.com/egrowacademy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              🐦 Twitter
            </a>
          </div>
        </div>

        {/* Mensaje de agradecimiento */}
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">Gracias por tu paciencia</span>
          </div>
          <p className="text-xs text-green-700">
            Estamos trabajando para mejorar tu experiencia de aprendizaje
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            © 2025 eGrow Academy - Todos los derechos reservados
          </p>
        </div>
      </div>

      {/* Auto-refresh script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Auto-refresh cada 30 segundos para verificar si el mantenimiento terminó
            setTimeout(() => {
              fetch('/api/health')
                .then(response => {
                  if (response.ok) {
                    window.location.href = '/';
                  }
                })
                .catch(() => {
                  // Error de red, probablemente aún en mantenimiento
                });
            }, 30000);
          `
        }}
      />
    </div>
  )
}