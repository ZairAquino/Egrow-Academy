'use client';

import { useStreaks, getBadgeEmoji, getStreakEmoji } from '@/hooks/useStreaks';

interface StreakDisplayProps {
  compact?: boolean;
}

export default function StreakDisplay({ compact = false }: StreakDisplayProps) {
  const { stats, loading, error } = useStreaks();

  // No mostrar nada si hay error o no hay datos
  if (error || loading || !stats) {
    return null;
  }

  if (compact) {
    // Versión compacta para el dropdown
    return (
      <div className="streak-display-compact">
        <div className="streak-progress">
          <div className="streak-header">
            <span className="streak-emoji">{getStreakEmoji(stats.currentStreak)}</span>
            <span className="streak-text">Lecciones: {stats.weekProgress}</span>
          </div>
          {stats.currentStreak > 0 && (
            <div className="streak-info">
              <span className="streak-count">Racha: {stats.currentStreak} semana{stats.currentStreak !== 1 ? 's' : ''}</span>
              {stats.currentBadge && (
                <span className="streak-badge">
                  {getBadgeEmoji(stats.currentBadge.badgeLevel)}
                </span>
              )}
            </div>
          )}
        </div>
        
        {stats.totalPoints > 0 && (
          <div className="streak-points">
            <span className="points-text">💎 {stats.totalPoints} puntos</span>
          </div>
        )}
        
        {/* Barra de progreso visual */}
        <div className="progress-bar">
          <div 
            className={`progress-fill ${stats.goalMet ? 'completed' : ''}`}
            style={{ 
              width: `${Math.min((stats.currentWeekLessons / 5) * 100, 100)}%` 
            }}
          />
        </div>
      </div>
    );
  }

  // Versión expandida (para usar en otras partes si es necesario)
  return (
    <div className="streak-display-full">
      <div className="streak-header">
        <h3>📊 Tu Progreso Semanal</h3>
      </div>
      
      <div className="streak-stats">
        <div className="stat-main">
          <span className="stat-emoji">{getStreakEmoji(stats.currentStreak)}</span>
          <div className="stat-content">
            <div className="stat-primary">Lecciones: {stats.weekProgress}</div>
            {stats.currentStreak > 0 && (
              <div className="stat-secondary">
                Racha: {stats.currentStreak} semana{stats.currentStreak !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
        
        {stats.currentBadge && (
          <div className="badge-display">
            <span className="badge-emoji">{getBadgeEmoji(stats.currentBadge.badgeLevel)}</span>
            <span className="badge-name">{stats.currentBadge.badgeLevel}</span>
          </div>
        )}
      </div>
      
      {stats.totalPoints > 0 && (
        <div className="points-display">
          💎 {stats.totalPoints} puntos disponibles
        </div>
      )}
    </div>
  );
}

// Agregar estilos CSS específicos para el componente
export const streakStyles = `
.streak-display-compact {
  padding: 0.75rem;
  border-top: 1px solid var(--gray-200);
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 0 0 12px 12px;
}

.streak-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.streak-emoji {
  font-size: 1.2rem;
  margin-right: 0.5rem;
}

.streak-text {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--gray-900);
}

.streak-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.25rem;
}

.streak-count {
  font-size: 0.75rem;
  color: var(--gray-600);
  font-weight: 500;
}

.streak-badge {
  font-size: 1rem;
}

.streak-points {
  margin: 0.5rem 0;
  text-align: center;
}

.points-text {
  font-size: 0.75rem;
  color: var(--primary-blue);
  font-weight: 600;
  background: rgba(37, 99, 235, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  display: inline-block;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: var(--gray-200);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  border-radius: 3px;
  transition: width 0.3s ease;
  position: relative;
}

.progress-fill.completed {
  background: linear-gradient(90deg, #10b981, #059669);
}

.progress-fill.completed::after {
  content: '✨';
  position: absolute;
  right: -1rem;
  top: -0.5rem;
  font-size: 0.875rem;
  animation: sparkle 2s infinite;
}

@keyframes sparkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.2); }
}

/* Versión expandida */
.streak-display-full {
  padding: 1rem;
  background: white;
  border-radius: 12px;
  border: 1px solid var(--gray-200);
}

.stat-main {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stat-emoji {
  font-size: 2rem;
}

.stat-primary {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--gray-900);
}

.stat-secondary {
  font-size: 0.875rem;
  color: var(--gray-600);
}

.badge-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: var(--gray-50);
  border-radius: 8px;
}

.badge-emoji {
  font-size: 1.25rem;
}

.badge-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--gray-700);
  text-transform: capitalize;
}

.points-display {
  margin-top: 0.75rem;
  text-align: center;
  padding: 0.5rem;
  background: rgba(37, 99, 235, 0.05);
  border-radius: 8px;
  font-weight: 600;
  color: var(--primary-blue);
}

/* Responsive */
@media (max-width: 768px) {
  .streak-display-compact {
    padding: 0.5rem;
  }
  
  .streak-text {
    font-size: 0.8rem;
  }
  
  .points-text {
    font-size: 0.7rem;
  }
}
`;