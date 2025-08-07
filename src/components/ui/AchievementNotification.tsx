'use client';

import { useState, useEffect } from 'react';

interface AchievementNotificationProps {
  isVisible: boolean;
  type: 'module' | 'course';
  title: string;
  message: string;
  stats?: {
    completed: number;
    total: number;
    percentage: number;
  };
  onClose: () => void;
}

export default function AchievementNotification({
  isVisible,
  type,
  title,
  message,
  stats,
  onClose
}: AchievementNotificationProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      // Auto-close after 2 minutes
      const timer = setTimeout(() => {
        onClose();
      }, 120000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  // Si no es visible, no renderizar
  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="achievement-overlay"
        onClick={onClose}
      />
      
      {/* Notification */}
      <div className={`achievement-notification ${isAnimating ? 'animate-in' : ''}`}>
        {/* Background decoration */}
        <div className="achievement-bg-decoration">
          <div className="sparkle sparkle-1">✨</div>
          <div className="sparkle sparkle-2">🎉</div>
          <div className="sparkle sparkle-3">🏆</div>
          <div className="sparkle sparkle-4">⭐</div>
        </div>
        
        {/* Main content */}
        <div className="achievement-content">
          {/* Icon */}
          <div className="achievement-icon">
            {type === 'module' ? '📚' : '🎓'}
          </div>
          
          {/* Title */}
          <h3 className="achievement-title">
            {title}
          </h3>
          
          {/* Message */}
          <p className="achievement-message">
            {message}
          </p>
          
          {/* Stats (if provided) */}
          {stats && (
            <div className="achievement-stats">
              <div className="stat-item">
                <span className="stat-number">{stats.completed}</span>
                <span className="stat-label">Completadas</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.total}</span>
                <span className="stat-label">Total</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.percentage}%</span>
                <span className="stat-label">Progreso</span>
              </div>
            </div>
          )}
          
          {/* Progress bar */}
          {stats && (
            <div className="achievement-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${stats.percentage}%` }}
                />
              </div>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="achievement-actions">
            <button 
              className="btn-continue"
              onClick={onClose}
            >
              Continuar
            </button>
          </div>
        </div>
        
        {/* Close button */}
        <button 
          className="achievement-close"
          onClick={onClose}
          aria-label="Cerrar notificación"
        >
          ×
        </button>
      </div>

      <style jsx>{`
        .achievement-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 9999;
          animation: fadeIn 0.3s ease;
        }

        .achievement-notification {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.8);
          background: #4f46e5; /* Indigo 600 sólido, sin degradado */
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          z-index: 10000;
          max-width: 500px;
          width: 90%;
          text-align: center;
          color: white;
          overflow: hidden;
          animation: slideIn 0.4s ease forwards;
        }

        .achievement-notification.animate-in {
          animation: slideIn 0.4s ease forwards;
        }

        .achievement-bg-decoration {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .sparkle {
          position: absolute;
          font-size: 1.5rem;
          animation: sparkle 2s ease-in-out infinite;
        }

        .sparkle-1 {
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .sparkle-2 {
          top: 20%;
          right: 15%;
          animation-delay: 0.5s;
        }

        .sparkle-3 {
          bottom: 30%;
          left: 20%;
          animation-delay: 1s;
        }

        .sparkle-4 {
          bottom: 20%;
          right: 10%;
          animation-delay: 1.5s;
        }

        .achievement-content {
          position: relative;
          z-index: 1;
        }

        .achievement-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: bounce 0.6s ease;
        }

        .achievement-title {
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0 0 1rem 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .achievement-message {
          font-size: 1.1rem;
          margin: 0 0 1.5rem 0;
          opacity: 0.9;
          line-height: 1.5;
        }

        .achievement-stats {
          display: flex;
          justify-content: space-around;
          margin: 1.5rem 0;
          gap: 1rem;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: #fbbf24;
        }

        .stat-label {
          font-size: 0.8rem;
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .achievement-progress {
          margin: 1.5rem 0;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #f59e0b; /* Amber 500 sólido, sin degradado */
          border-radius: 4px;
          transition: width 0.8s ease;
        }

        .achievement-actions {
          margin-top: 2rem;
        }

        .btn-continue {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          padding: 0.75rem 2rem;
          border-radius: 25px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .btn-continue:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
        }

        .achievement-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          font-size: 1.5rem;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .achievement-close:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        @keyframes slideIn {
          from {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0;
          }
          to {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0, 0, 0);
          }
          40%, 43% {
            transform: translate3d(0, -30px, 0);
          }
          70% {
            transform: translate3d(0, -15px, 0);
          }
          90% {
            transform: translate3d(0, -4px, 0);
          }
        }

        @keyframes sparkle {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.2) rotate(180deg);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .achievement-notification {
            padding: 1.5rem;
            max-width: 90%;
          }

          .achievement-title {
            font-size: 1.5rem;
          }

          .achievement-message {
            font-size: 1rem;
          }

          .achievement-stats {
            flex-direction: column;
            gap: 0.5rem;
          }

          .stat-item {
            flex-direction: row;
            justify-content: space-between;
          }
        }
      `}</style>
    </>
  );
} 

// Hook para manejar notificaciones de logros (simplificado)
export const useAchievements = () => {
  const [showModuleNotification, setShowModuleNotification] = useState(false);
  const [showCourseNotification, setShowCourseNotification] = useState(false);
  const [achievementData, setAchievementData] = useState({
    type: 'module' as 'module' | 'course',
    title: '',
    message: '',
    stats: {
      completed: 0,
      total: 0,
      percentage: 0
    }
  });

  const showAchievement = (achievement: {
    type: 'module' | 'course';
    title: string;
    message: string;
    stats?: {
      completed: number;
      total: number;
      percentage: number;
    };
  }) => {
    setAchievementData({
      ...achievement,
      stats: achievement.stats || { completed: 0, total: 0, percentage: 0 }
    });
    
    if (achievement.type === 'module') {
      setShowModuleNotification(true);
    } else {
      setShowCourseNotification(true);
    }
  };

  const hideModuleNotification = () => setShowModuleNotification(false);
  const hideCourseNotification = () => setShowCourseNotification(false);

  return {
    showModuleNotification,
    showCourseNotification,
    achievementData,
    showAchievement,
    hideModuleNotification,
    hideCourseNotification,
  };
}; 