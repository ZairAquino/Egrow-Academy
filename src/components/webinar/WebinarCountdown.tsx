'use client';

import { useState, useEffect } from 'react';

interface WebinarCountdownProps {
  date: Date;
  onComplete?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function WebinarCountdown({ date, onComplete }: WebinarCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isLive, setIsLive] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const webinarTime = new Date(date).getTime();
      const difference = webinarTime - now;

      if (difference <= 0) {
        // El webinar ya pasó
        setIsExpired(true);
        onComplete?.();
        return;
      }

      // Si faltan menos de 30 minutos, está en vivo
      if (difference <= 30 * 60 * 1000) {
        setIsLive(true);
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    // Calcular inmediatamente
    calculateTimeLeft();

    // Actualizar cada segundo
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [date, onComplete]);

  if (isExpired) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 text-4xl mb-4">⏰</div>
        <h3 className="text-xl font-semibold text-red-800 mb-2">
          Este webinar ya finalizó
        </h3>
        <p className="text-red-700">
          El evento ya se realizó. Revisa nuestra página para futuros webinars.
        </p>
      </div>
    );
  }

  if (isLive) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-green-600 text-4xl mb-4">🔴</div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">
          ¡El webinar está en vivo!
        </h3>
        <p className="text-green-700 mb-4">
          Únete ahora mismo al evento
        </p>
        <div className="bg-white rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-700">
            <strong>Estado:</strong> Transmitiendo en vivo
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-blue-900 mb-2">
          El webinar comienza en:
        </h3>
        <p className="text-blue-700">
          {new Date(date).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="text-2xl md:text-3xl font-bold text-blue-600">
              {timeLeft.days.toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-blue-700 mt-1">Días</div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="text-2xl md:text-3xl font-bold text-blue-600">
              {timeLeft.hours.toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-blue-700 mt-1">Horas</div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="text-2xl md:text-3xl font-bold text-blue-600">
              {timeLeft.minutes.toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-blue-700 mt-1">Minutos</div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="text-2xl md:text-3xl font-bold text-blue-600">
              {timeLeft.seconds.toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-blue-700 mt-1">Segundos</div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-blue-700">
          <strong>Recordatorio:</strong> El link de acceso se enviará por email 15 minutos antes del evento.
        </p>
      </div>
    </div>
  );
} 