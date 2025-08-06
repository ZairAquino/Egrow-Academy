'use client';

import { useState, useEffect } from 'react';
import { Webinar, WebinarFormData } from '@/types/webinar';
import { useAuth } from '@/contexts/AuthContext';
import { useWebinarVideoIATracker } from '@/components/analytics/WebinarVideoIATracker';

interface WebinarRegistrationFormProps {
  webinar: Webinar;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export default function WebinarRegistrationForm({ webinar, onSuccess, onError }: WebinarRegistrationFormProps) {
  const { user, status } = useAuth();
  const { trackRegistration, trackEngagement, getUserMetadata } = useWebinarVideoIATracker();
  const [formData, setFormData] = useState<WebinarFormData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    questions: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Auto-rellenar campos cuando el usuario esté logueado
  useEffect(() => {
    if (status === 'authenticated' && user) {
      setFormData(prev => ({
        ...prev,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        // El teléfono se mantiene vacío ya que no está en el modelo User
        phone: prev.phone || '',
        questions: prev.questions || ''
      }));
    }
  }, [user, status]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(''); // Limpiar errores anteriores

    try {
      const response = await fetch(`/api/webinars/${webinar.slug}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          webinarId: webinar.id,
          ...formData,
          // Incluir userId si el usuario está logueado
          ...(status === 'authenticated' && user ? { userId: user.id } : {})
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsRegistered(true);
        
        // Track registration success con metadatos completos
        if (webinar.slug === 'videos-profesionales-ia') {
          trackRegistration();
          trackEngagement('registration_success', {
            registration_method: 'form_submission',
            user_metadata: getUserMetadata(),
            webinar_details: {
              id: webinar.id,
              title: webinar.title,
              duration: webinar.duration,
              dateTime: webinar.dateTime
            }
          });
        }
        
        onSuccess?.();
      } else {
        setErrorMessage(result.message || 'Error al registrar');
        onError?.(result.message || 'Error al registrar');
      }
    } catch (error) {
      const errorMsg = 'Error de conexión. Intenta nuevamente.';
      setErrorMessage(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isRegistered) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-green-600 text-4xl mb-4">✅</div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">
          ¡Registro Exitoso!
        </h3>
        <p className="text-green-700 mb-4">
          Te has registrado correctamente al webinar "{webinar.title}"
        </p>
        <div className="bg-white rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-700">
            <strong>Fecha:</strong> {new Date(webinar.dateTime).toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          <p className="text-sm text-green-700 mt-2">
            <strong>Duración:</strong> {webinar.duration} minutos
          </p>
          <p className="text-sm text-green-700 mt-2">
            <strong>Google Meet:</strong> Se enviará por email
          </p>
        </div>
        <p className="text-sm text-green-600 mt-4">
          Revisa tu email para confirmar tu registro y recibir el link del webinar.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Registrarse al Webinar
        </h3>
        <p className="text-gray-600">
          Completa el formulario para asegurar tu lugar
        </p>
      </div>

      {/* Mensaje de Error */}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">
                {errorMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Indicador de usuario logueado */}
        {status === 'authenticated' && user && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-green-800">
                Registrándote como: <strong>{user.firstName} {user.lastName}</strong>
              </p>
            </div>
          </div>
        )}

        {/* Nombre y Apellido */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
              {status === 'authenticated' && user && (
                <span className="ml-2 text-xs text-green-600">(auto-completado)</span>
              )}
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              readOnly={status === 'authenticated' && !!user}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                status === 'authenticated' && user 
                  ? 'bg-gray-50 border-gray-200 cursor-not-allowed' 
                  : 'border-gray-300'
              }`}
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Apellido *
              {status === 'authenticated' && user && (
                <span className="ml-2 text-xs text-green-600">(auto-completado)</span>
              )}
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              readOnly={status === 'authenticated' && !!user}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                status === 'authenticated' && user 
                  ? 'bg-gray-50 border-gray-200 cursor-not-allowed' 
                  : 'border-gray-300'
              }`}
              placeholder="Tu apellido"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
            {status === 'authenticated' && user && (
              <span className="ml-2 text-xs text-green-600">(auto-completado)</span>
            )}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            readOnly={status === 'authenticated' && !!user}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              status === 'authenticated' && user 
                ? 'bg-gray-50 border-gray-200 cursor-not-allowed' 
                : 'border-gray-300'
            }`}
            placeholder="tu@email.com"
          />
        </div>

        {/* Teléfono */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono (opcional)
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+52 55 1234 5678"
          />
        </div>



        {/* Preguntas */}
        <div>
          <label htmlFor="questions" className="block text-sm font-medium text-gray-700 mb-1">
            ¿Tienes alguna pregunta específica? (opcional)
          </label>
          <textarea
            id="questions"
            name="questions"
            value={formData.questions}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Escribe aquí tus preguntas o comentarios..."
          />
        </div>

        {/* Información del evento */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Información del Evento</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Fecha:</strong> {new Date(webinar.dateTime).toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            <p><strong>Duración:</strong> {webinar.duration} minutos</p>
            {webinar.hostName && (
              <p><strong>Ponente:</strong> {webinar.hostName}</p>
            )}
            {webinar.maxAttendees && (
              <p><strong>Cupos:</strong> {webinar.currentAttendees}/{webinar.maxAttendees} registrados</p>
            )}
          </div>
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Registrando...
            </div>
          ) : (
            'Registrarme al Webinar'
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          Al registrarte, aceptas recibir información sobre este y futuros webinars.
        </p>
      </form>
    </div>
  );
} 