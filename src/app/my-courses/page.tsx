'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/layout/Sidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Footer from '@/components/layout/Footer';
import UserProfile from '@/components/auth/UserProfile';
import { useUserStats } from '@/hooks/useUserStats';
import { useAuth } from '@/contexts/AuthContext';

// Lazy load components
const CompaniesMarquee = dynamic(() => import('@/components/ui/CompaniesMarquee'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  durationHours: number;
  isFree: boolean;
  progressPercentage: number;
  status: string;
  enrolledAt: string;
  completedAt?: string;
  certificateUrl?: string;
}

export default function MyCoursesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { user } = useAuth();
  const { stats, isLoading: statsLoading } = useUserStats();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Datos de ejemplo - en el futuro esto vendrá de una API
  const userCourses: Course[] = [
    {
      id: 'introduccion-llms',
      title: 'Introducción a Large Language Models (LLMs)',
      description: 'Aprende los fundamentos de los modelos de lenguaje grandes, desde GPT hasta Claude, y cómo implementarlos en aplicaciones reales.',
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&crop=center',
      durationHours: 2,
      isFree: true,
      progressPercentage: 25,
      status: 'IN_PROGRESS',
      enrolledAt: '2024-01-15',
      certificateUrl: undefined
    }
  ];

  const filters = [
    { id: 'all', name: 'Todos los Cursos', icon: '📚' },
    { id: 'in-progress', name: 'En Progreso', icon: '🔄' },
    { id: 'completed', name: 'Completados', icon: '✅' },
    { id: 'certificates', name: 'Certificaciones', icon: '🏆' }
  ];

  const getFilteredCourses = () => {
    switch (selectedFilter) {
      case 'in-progress':
        return userCourses.filter(course => course.status === 'IN_PROGRESS');
      case 'completed':
        return userCourses.filter(course => course.status === 'COMPLETED');
      case 'certificates':
        return userCourses.filter(course => course.certificateUrl);
      default:
        return userCourses;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="status-badge completed">✅ Completado</span>;
      case 'IN_PROGRESS':
        return <span className="status-badge in-progress">🔄 En Progreso</span>;
      case 'NOT_STARTED':
        return <span className="status-badge not-started">⏸️ No Iniciado</span>;
      default:
        return <span className="status-badge">❓ Desconocido</span>;
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const handleDownloadCertificate = (courseId: string) => {
    // En el futuro, esto descargará el certificado real
    alert(`Descargando certificado para ${courseId}...`);
  };

  const filteredCourses = getFilteredCourses();

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <UserProfile className="user-profile-top-right" />
      
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Hero Section */}
        <section className="hero gradient-bg">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">
                Mis Cursos
                <span className="block">y Progreso</span>
              </h1>
              <p className="hero-description">
                Revisa tu progreso, completa cursos y descarga tus certificaciones
              </p>
            </div>
          </div>
        </section>

        {/* Companies Marquee */}
        <Suspense fallback={<LoadingSpinner />}>
          <CompaniesMarquee />
        </Suspense>

        {/* Stats Section */}
        {!statsLoading && stats && (
          <section className="section bg-gray-50">
            <div className="container">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📚</div>
                  <div className="stat-content">
                    <h3 className="stat-number">{stats.totalEnrolled}</h3>
                    <p className="stat-label">Cursos Inscritos</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-content">
                    <h3 className="stat-number">{stats.completedCourses}</h3>
                    <p className="stat-label">Cursos Completados</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🏆</div>
                  <div className="stat-content">
                    <h3 className="stat-number">{stats.certificates}</h3>
                    <p className="stat-label">Certificaciones</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⏱️</div>
                  <div className="stat-content">
                    <h3 className="stat-number">{stats.totalHoursLearned}h</h3>
                    <p className="stat-label">Horas Aprendidas</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Courses Section */}
        <section className="section">
          <div className="container">
            {/* Filtros */}
            <div className="filters-container">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`filter-btn ${selectedFilter === filter.id ? 'active' : ''}`}
                >
                  <span className="filter-icon">{filter.icon}</span>
                  <span className="filter-name">{filter.name}</span>
                </button>
              ))}
            </div>

            {/* Grid de cursos */}
            <div className="my-courses-grid">
              {filteredCourses.map((course) => (
                <div key={course.id} className="course-card-my-courses">
                  <div className="course-image">
                    <img src={course.imageUrl} alt={course.title} />
                    <div className="course-overlay">
                      {course.isFree ? (
                        <span className="course-type free">Gratis</span>
                      ) : (
                        <span className="course-type premium">Premium</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="course-content">
                    <h3 className="course-title">{course.title}</h3>
                    <p className="course-description">{course.description}</p>
                    
                    <div className="course-meta">
                      <span className="course-duration">⏱️ {course.durationHours} horas</span>
                      <span className="course-enrolled">📅 {new Date(course.enrolledAt).toLocaleDateString()}</span>
                    </div>

                    <div className="course-progress">
                      <div className="progress-header">
                        <span className="progress-label">Progreso</span>
                        <span className="progress-percentage">{course.progressPercentage}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: `${course.progressPercentage}%`,
                            backgroundColor: getProgressColor(course.progressPercentage)
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="course-status">
                      {getStatusBadge(course.status)}
                    </div>

                    <div className="course-actions">
                      <button className="btn btn-primary">
                        {course.status === 'COMPLETED' ? 'Revisar' : 'Continuar'}
                      </button>
                      
                      {course.status === 'COMPLETED' && course.certificateUrl && (
                        <button 
                          className="btn btn-secondary"
                          onClick={() => handleDownloadCertificate(course.id)}
                        >
                          📄 Descargar Certificado
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="no-courses">
                <div className="no-courses-icon">📚</div>
                <h3>No tienes cursos en esta categoría</h3>
                <p>Explora nuestros cursos y comienza tu aprendizaje</p>
                <a href="/courses" className="btn btn-primary">
                  Ver Todos los Cursos
                </a>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
} 