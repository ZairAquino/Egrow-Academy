'use client';

import { useEffect, useState } from 'react';

interface Stats {
  totalCourses: number;
  freeCourses: number;
  totalUsers: number;
  totalEnrollments: number;
}

interface StatsContainerProps {
  showFreeCourses?: boolean;
}

export default function StatsContainer({ showFreeCourses = false }: StatsContainerProps) {
  const [stats, setStats] = useState<Stats>({
    totalCourses: 15,
    freeCourses: 8,
    totalUsers: 2500,
    totalEnrollments: 1200
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace('.0', '') + 'K+';
    }
    return num.toString();
  };

  return (
    <div className="stats-container">
      <h3 className="stats-title">Nuestros Números</h3>
      <div className="stats-grid-vertical">
        <div className="stat-card">
          <div className="stat-number">{showFreeCourses ? stats.freeCourses : stats.totalCourses}</div>
          <div className="stat-label">{showFreeCourses ? 'Cursos Gratuitos' : 'Cursos Disponibles'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">1-4</div>
          <div className="stat-label">Horas por Curso</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{formatNumber(stats.totalUsers)}</div>
          <div className="stat-label">Estudiantes</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">100%</div>
          <div className="stat-label">{showFreeCourses ? 'Gratuito' : 'Garantía'}</div>
        </div>
      </div>
    </div>
  );
}