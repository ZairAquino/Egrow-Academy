'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function WelcomeMessage() {
  const { user } = useAuth();
  const [shouldShow, setShouldShow] = useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '¡Buenos días';
    if (hour < 18) return '¡Buenas tardes';
    return '¡Buenas noches';
  };

  const getFirstName = () => {
    return user?.firstName || user?.email?.split('@')[0] || 'Usuario';
  };

  const handleClose = () => {
    setShouldShow(false);
  };

  if (!shouldShow || !user) return null;

  return (
    <div className="welcome-card">
      <div className="welcome-content">
        <div className="greeting-section">
          <div className="emoji-float">👋</div>
          <div className="greeting-text">
            <h3>{getGreeting()}, {getFirstName()}!</h3>
            <p>Bienvenido de vuelta a eGrow Academy</p>
          </div>
        </div>
        
        <button onClick={handleClose} className="close-btn">
          ×
        </button>
      </div>

      <style jsx>{`
        .welcome-card {
          width: 100%;
          position: relative;
        }

        .welcome-content {
          background: white;
          border: 1px solid #000000;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          position: relative;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          height: 100%;
          min-height: 120px;
        }

        .greeting-section {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }

        .emoji-float {
          font-size: 2.5rem;
          animation: wave 2s infinite;
        }

        .greeting-text h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 0.25rem 0;
          color: #1f2937;
          text-shadow: none;
        }

        .greeting-text p {
          font-size: 1rem;
          margin: 0;
          color: #6b7280;
        }

        .close-btn {
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          color: #374151;
          font-size: 1.5rem;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          line-height: 1;
          padding: 0;
        }

        .close-btn:hover {
          background: #e5e7eb;
          border-color: #9ca3af;
          transform: scale(1.1);
        }

        @keyframes wave {
          0%, 100% {
            transform: rotate(0deg);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: rotate(-10deg);
          }
          20%, 40%, 60%, 80% {
            transform: rotate(10deg);
          }
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .welcome-content {
            min-height: 100px;
            padding: 1rem 1.25rem;
          }

          .greeting-text h3 {
            font-size: 1.25rem;
          }

          .greeting-text p {
            font-size: 0.875rem;
          }

          .emoji-float {
            font-size: 2rem;
          }
        }

        @media (max-width: 768px) {
          .welcome-content {
            flex-direction: column;
            gap: 0.75rem;
            padding: 1rem 1.25rem;
            text-align: center;
            min-height: 140px;
          }

          .greeting-section {
            gap: 0.75rem;
          }

          .greeting-text h3 {
            font-size: 1.125rem;
          }

          .greeting-text p {
            font-size: 0.8rem;
          }

          .emoji-float {
            font-size: 1.75rem;
          }

          .close-btn {
            position: absolute;
            top: 0.75rem;
            right: 0.75rem;
            width: 28px;
            height: 28px;
            font-size: 1.125rem;
          }
        }

        /* Respeto por preferencias de movimiento reducido */
        @media (prefers-reduced-motion: reduce) {
          .emoji-float {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}