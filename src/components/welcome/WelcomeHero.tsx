'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function WelcomeHero() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Activar animación después del montaje
    const timer1 = setTimeout(() => setIsVisible(true), 100);
    const timer2 = setTimeout(() => setShowContent(true), 800);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '¡Buenos días';
    if (hour < 18) return '¡Buenas tardes';
    return '¡Buenas noches';
  };

  const getMotivationalMessage = () => {
    const messages = [
      "¡Es momento de seguir aprendiendo!",
      "¡Tu futuro en IA te espera!",
      "¡Cada día es una oportunidad para crecer!",
      "¡Convierte tus ideas en realidad con IA!",
      "¡El conocimiento es tu superpoder!"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <section className="welcome-hero">
      <div className="welcome-background">
        <div className="floating-elements">
          <div className="element element-1">🚀</div>
          <div className="element element-2">💡</div>
          <div className="element element-3">⭐</div>
          <div className="element element-4">🎯</div>
          <div className="element element-5">🔥</div>
        </div>
      </div>

      <div className="container">
        <div className="welcome-content">
          <div className={`welcome-main ${isVisible ? 'animate-in' : ''}`}>
            <div className="greeting-line">
              <h1 className="welcome-greeting">
                {getGreeting()}, {user?.firstName}!
              </h1>
              <div className="wave-emoji">👋</div>
            </div>
            
            <div className={`welcome-message ${showContent ? 'animate-in' : ''}`}>
              <p className="motivational-text">
                {getMotivationalMessage()}
              </p>
              
              <div className="welcome-stats">
                <div className="stat-item">
                  <span className="stat-icon">📚</span>
                  <span className="stat-text">Continúa tu viaje de aprendizaje</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .welcome-hero {
          position: relative;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 300px;
          display: flex;
          align-items: center;
          overflow: hidden;
          margin-bottom: 3rem;
        }

        .welcome-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.1;
        }

        .floating-elements {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .element {
          position: absolute;
          font-size: 2rem;
          animation: float 6s ease-in-out infinite;
        }

        .element-1 {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .element-2 {
          top: 60%;
          left: 20%;
          animation-delay: 1s;
        }

        .element-3 {
          top: 30%;
          right: 15%;
          animation-delay: 2s;
        }

        .element-4 {
          bottom: 40%;
          right: 25%;
          animation-delay: 3s;
        }

        .element-5 {
          bottom: 20%;
          left: 60%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        .welcome-content {
          position: relative;
          z-index: 2;
          width: 100%;
          text-align: center;
        }

        .welcome-main {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .welcome-main.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .greeting-line {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .welcome-greeting {
          font-size: 3rem;
          font-weight: 800;
          color: white;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          letter-spacing: -0.02em;
        }

        .wave-emoji {
          font-size: 3rem;
          animation: wave 2s ease-in-out infinite;
          transform-origin: 70% 70%;
        }

        @keyframes wave {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(20deg);
          }
          50% {
            transform: rotate(0deg);
          }
          75% {
            transform: rotate(-10deg);
          }
        }

        .welcome-message {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          transition-delay: 0.3s;
        }

        .welcome-message.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .motivational-text {
          font-size: 1.5rem;
          color: rgba(255, 255, 255, 0.95);
          margin: 0 0 2rem 0;
          font-weight: 500;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .welcome-stats {
          display: flex;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.2);
          padding: 1rem 1.5rem;
          border-radius: 50px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }

        .stat-item:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .stat-icon {
          font-size: 1.5rem;
        }

        .stat-text {
          color: white;
          font-weight: 600;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        @media (max-width: 768px) {
          .welcome-greeting {
            font-size: 2.5rem;
          }
          
          .motivational-text {
            font-size: 1.25rem;
          }
          
          .greeting-line {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .wave-emoji {
            font-size: 2.5rem;
          }
          
          .welcome-stats {
            gap: 1rem;
          }
          
          .stat-item {
            padding: 0.75rem 1.25rem;
          }
        }

        @media (max-width: 480px) {
          .welcome-hero {
            min-height: 250px;
          }
          
          .welcome-greeting {
            font-size: 2rem;
          }
          
          .motivational-text {
            font-size: 1.125rem;
          }
        }
      `}</style>
    </section>
  );
}