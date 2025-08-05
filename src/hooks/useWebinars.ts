import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Webinar } from '@/types/webinar';

export interface WebinarRegistration {
  webinarId: string;
  webinarTitle: string;
  webinarDate: Date;
  webinarTime: string;
  hostName: string;
  registeredAt: Date;
  reminderSent: boolean;
  reminderSentAt?: Date;
}

export function useWebinars() {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [userRegistrations, setUserRegistrations] = useState<WebinarRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Cargar webinars desde la base de datos
  const loadWebinars = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/webinars');
      
      if (!response.ok) {
        throw new Error('Error al cargar webinars');
      }
      
      const data = await response.json();
      setWebinars(data.webinars || []);
    } catch (err) {
      console.error('Error cargando webinars:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Cargar registros del usuario a webinars
  const loadUserWebinarRegistrations = async () => {
    if (!user) {
      setUserRegistrations([]);
      return;
    }

    try {
      const response = await fetch('/api/webinars/user-registrations');
      
      if (!response.ok) {
        throw new Error('Error al cargar registros de webinars');
      }
      
      const data = await response.json();
      setUserRegistrations(data.registrations || []);
    } catch (err) {
      console.error('Error cargando registros de webinars:', err);
    }
  };

  // Registrar usuario a un webinar
  const registerToWebinar = async (webinarId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`/api/webinars/${webinarId}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          webinarId,
          userId: user?.id || null,
          email: user?.email || '',
          firstName: user?.firstName || '',
          lastName: user?.lastName || ''
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrarse');
      }

      // Recargar registros del usuario
      await loadUserWebinarRegistrations();
      
      return { success: true, message: data.message };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      return { success: false, message: errorMessage };
    }
  };

  // Verificar si el usuario está registrado en un webinar
  const isUserRegistered = (webinarId: string): boolean => {
    return userRegistrations.some(registration => registration.webinarId === webinarId);
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadWebinars();
  }, []);

  useEffect(() => {
    loadUserWebinarRegistrations();
  }, [user]);

  return {
    webinars,
    userRegistrations,
    loading,
    error,
    registerToWebinar,
    isUserRegistered,
    refreshWebinars: loadWebinars,
    refreshRegistrations: loadUserWebinarRegistrations
  };
} 