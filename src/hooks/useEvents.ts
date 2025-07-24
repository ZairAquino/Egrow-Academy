import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  type: string;
  category: string;
  instructor: string;
  image?: string;
  maxAttendees?: number;
  isActive: boolean;
  attendees: number;
}

export interface UserRegistration {
  eventId: string;
  eventTitle: string;
  eventDate: Date;
  eventTime: string;
  eventType: string;
  eventCategory: string;
  instructor: string;
  registeredAt: Date;
  reminderSent: boolean;
  reminderSentAt?: Date;
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [userRegistrations, setUserRegistrations] = useState<UserRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Cargar eventos desde la base de datos
  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/events');
      
      if (!response.ok) {
        throw new Error('Error al cargar eventos');
      }
      
      const data = await response.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error('Error cargando eventos:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Cargar registros del usuario
  const loadUserRegistrations = async () => {
    if (!user) {
      setUserRegistrations([]);
      return;
    }

    try {
      const response = await fetch('/api/events/user-registrations');
      
      if (!response.ok) {
        throw new Error('Error al cargar registros');
      }
      
      const data = await response.json();
      setUserRegistrations(data.registrations || []);
    } catch (err) {
      console.error('Error cargando registros:', err);
    }
  };

  // Registrar usuario a un evento
  const registerToEvent = async (eventId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch('/api/events/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrarse');
      }

      // Recargar registros del usuario
      await loadUserRegistrations();
      
      return { success: true, message: data.message };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      return { success: false, message: errorMessage };
    }
  };

  // Verificar si el usuario está registrado en un evento
  const isUserRegistered = (eventId: string): boolean => {
    return userRegistrations.some(registration => registration.eventId === eventId);
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    loadUserRegistrations();
  }, [user]);

  return {
    events,
    userRegistrations,
    loading,
    error,
    registerToEvent,
    isUserRegistered,
    refreshEvents: loadEvents,
    refreshRegistrations: loadUserRegistrations
  };
} 