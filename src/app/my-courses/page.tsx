'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import UserProfile from '@/components/auth/UserProfile';
import Footer from '@/components/layout/Footer';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  level: string;
  progress: number;
  status: 'enrolled' | 'in_progress' | 'completed';
  lastAccessed?: Date;
  completedAt?: Date;
  hasCertificate?: boolean;
  certificateUrl?: string;
}

interface UserCourse {
  id: string;
  courseId: string;
  course: Course;
  enrolledAt: Date;
  completedAt?: Date;
  progressPercentage: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export default function MyCoursesPage() {
  const { user, status } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [courses, setCourses] = useState<UserCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Cargar cursos del usuario
  useEffect(() => {
    const loadUserCourses = async () => {
      if (status !== 'authenticated' || !user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/courses/user-courses', {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setCourses(data.courses || []);
        } else {
          setError('Error al cargar los cursos');
        }
      } catch (error) {
        console.error('Error loading courses:', error);
        setError('Error de conexión');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserCourses();
  }, [user, status]);

  // Filtrar cursos según la pestaña activa
  const getFilteredCourses = () => {
    switch (activeTab) {
      case 'pending':
        return courses.filter(course => 
          course.status === 'ACTIVE' && course.progressPercentage < 100
        );
      case 'completed':
        return courses.filter(course => 
          course.status === 'COMPLETED' || course.progressPercentage === 100
        );
      case 'certificates':
        return courses.filter(course => 
          (course.status === 'COMPLETED' || course.progressPercentage === 100) &&
          course.course.hasCertificate
        );
      default:
        return courses;
    }
  };

  const filteredCourses = getFilteredCourses();

  // Obtener estadísticas
  const stats = {
    total: courses.length,
    pending: courses.filter(c => c.status === 'ACTIVE' && c.progressPercentage < 100).length,
    completed: courses.filter(c => c.status === 'COMPLETED' || c.progressPercentage === 100).length,
    certificates: courses.filter(c => 
      (c.status === 'COMPLETED' || c.progressPercentage === 100) && 
      c.course.hasCertificate
    ).length
  };

  // Redirigir si no está autenticado
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acceso Requerido</h1>
          <p className="mb-4">Necesitas iniciar sesión para ver tus cursos.</p>
          <Link href="/login" className="btn btn-primary">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

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
                <span className="block">Dashboard de Aprendizaje</span>
              </h1>
              <p className="hero-description">
                Gestiona tu progreso, continúa donde lo dejaste y obtén tus certificaciones.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="section bg-gray-50">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div className="stat-content">
                  <h3 className="stat-number">{stats.total}</h3>
                  <p className="stat-label">Total Cursos</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏳</div>
                <div className="stat-content">
                  <h3 className="stat-number">{stats.pending}</h3>
                  <p className="stat-label">En Progreso</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <h3 className="stat-number">{stats.completed}</h3>
                  <p className="stat-label">Completados</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-content">
                  <h3 className="stat-number">{stats.certificates}</h3>
                  <p className="stat-label">Certificaciones</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="section">
          <div className="container">
            <div className="tabs-container">
              <button
                className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                Todos los Cursos ({stats.total})
              </button>
              <button
                className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
                onClick={() => setActiveTab('pending')}
              >
                En Progreso ({stats.pending})
              </button>
              <button
                className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
                onClick={() => setActiveTab('completed')}
              >
                Completados ({stats.completed})
              </button>
              <button
                className={`tab ${activeTab === 'certificates' ? 'active' : ''}`}
                onClick={() => setActiveTab('certificates')}
              >
                Certificaciones ({stats.certificates})
              </button>
            </div>
          </div>
        </section>

        {/* Courses Section */}
        <section className="section">
          <div className="container">
            {isLoading ? (
              <div className="loading-container">
                <LoadingSpinner />
                <p>Cargando tus cursos...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <p className="error-message">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="btn btn-primary"
                >
                  Reintentar
                </button>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="empty-container">
                <div className="empty-icon">📚</div>
                <h3>No hay cursos para mostrar</h3>
                <p>
                  {activeTab === 'all' && 'Aún no te has inscrito en ningún curso.'}
                  {activeTab === 'pending' && 'No tienes cursos en progreso.'}
                  {activeTab === 'completed' && 'No has completado ningún curso aún.'}
                  {activeTab === 'certificates' && 'No tienes certificaciones disponibles.'}
                </p>
                <Link href="/courses" className="btn btn-primary">
                  Explorar Cursos
                </Link>
              </div>
            ) : (
              <div className="courses-grid">
                {filteredCourses.map((userCourse) => (
                  <CourseCard key={userCourse.id} userCourse={userCourse} />
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </main>

      <style jsx>{`
        .main-content {
          min-height: 100vh;
          background: #f8fafc;
        }

        .hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 4rem 0;
          text-align: center;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .hero-description {
          font-size: 1.25rem;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
        }

        .section {
          padding: 3rem 0;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon {
          font-size: 2rem;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .stat-label {
          color: #6b7280;
          margin: 0;
        }

        .tabs-container {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .tab {
          padding: 1rem 1.5rem;
          border: none;
          background: none;
          color: #6b7280;
          font-weight: 500;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .tab:hover {
          color: #3b82f6;
        }

        .tab.active {
          color: #3b82f6;
          border-bottom-color: #3b82f6;
        }

        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          max-width: 100%;
        }

        .loading-container,
        .error-container,
        .empty-container {
          text-align: center;
          padding: 4rem 0;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .error-message {
          color: #dc2626;
          margin-bottom: 1rem;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover {
          background: #2563eb;
        }
      `}</style>
    </>
  );
}

function CourseCard({ userCourse }: { userCourse: UserCourse }) {
  const { course } = userCourse;
  const isCompleted = userCourse.status === 'COMPLETED' || userCourse.progressPercentage === 100;
  const isInProgress = userCourse.status === 'ACTIVE' && userCourse.progressPercentage > 0;

  const getActionButton = () => {
    if (isCompleted) {
      if (course.hasCertificate) {
        return (
          <Link 
            href={course.certificateUrl || `/certificate/${course.id}`}
            className="course-action-btn certificate-btn"
          >
            🏆 Ver Certificado
          </Link>
        );
      }
      return (
        <Link 
          href={`/curso/${course.id}`} 
          className="course-action-btn review-btn"
        >
          🔄 Repasar Curso
        </Link>
      );
    }

    if (isInProgress) {
      return (
        <Link 
          href={`/curso/${course.id}`} 
          className="course-action-btn continue-btn"
        >
          ▶️ Continuar
        </Link>
      );
    }

    return (
      <Link 
        href={`/curso/${course.id}`} 
        className="course-action-btn start-btn"
      >
        🚀 Comenzar
      </Link>
    );
  };

  const getStatusBadge = () => {
    if (isCompleted) {
      return <span className="status-badge completed">✅ Completado</span>;
    }
    if (isInProgress) {
      return <span className="status-badge progress">⏳ En Progreso</span>;
    }
    return <span className="status-badge enrolled">📚 Inscrito</span>;
  };

  return (
    <div className="course-card-modern">
      <div className="course-header">
        <div className="course-image-wrapper">
          <img 
            src={course.image || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&crop=center'} 
            alt={course.title}
            className="course-image"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&crop=center';
            }}
          />
          <div className="status-badge-wrapper">
            {getStatusBadge()}
          </div>
        </div>
      </div>
      
      <div className="course-body">
        <h3 className="course-title-modern">
          {course.title}
        </h3>
        
        <p className="course-description-modern">
          {course.description}
        </p>
        
        <div className="course-meta-modern">
          <span className="meta-item-modern">
            <span className="meta-icon">⏱️</span>
            {course.duration}
          </span>
          <span className="meta-item-modern">
            <span className="meta-icon">📊</span>
            {course.level}
          </span>
        </div>

        {isInProgress && (
          <div className="progress-modern">
            <div className="progress-header-modern">
              <span>Progreso</span>
              <span>{Math.round(userCourse.progressPercentage)}%</span>
            </div>
            <div className="progress-bar-modern">
              <div 
                className="progress-fill-modern"
                style={{ width: `${userCourse.progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="course-actions-modern">
          {getActionButton()}
          
          {isCompleted && course.hasCertificate && (
            <button className="course-action-btn download-btn">
              📥 Descargar PDF
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .course-card-modern {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          height: 450px;
          display: flex;
          flex-direction: column;
        }

        .course-card-modern:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border-color: #d1d5db;
        }

        .course-header {
          position: relative;
        }

        .course-image-wrapper {
          position: relative;
          height: 200px;
          overflow: hidden;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px 12px 0 0;
        }

        .course-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 0.3s ease;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .course-card-modern:hover .course-image {
          transform: scale(1.05);
        }

        .course-image-wrapper::before {
          content: '📚';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 3rem;
          color: rgba(255, 255, 255, 0.3);
          z-index: 1;
          display: none;
        }

        .course-image-wrapper:has(img[src*="unsplash"])::before {
          display: block;
        }

        .course-card-modern:hover .course-image {
          transform: scale(1.05);
        }

        .status-badge-wrapper {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 10;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .status-badge.completed {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .status-badge.progress {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
        }

        .status-badge.enrolled {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
        }

        .course-body {
          padding: 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .course-title-modern {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 12px 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .course-description-modern {
          color: #6b7280;
          font-size: 14px;
          line-height: 1.6;
          margin: 0 0 16px 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .course-meta-modern {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
        }

        .meta-item-modern {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #9ca3af;
          font-weight: 500;
        }

        .meta-icon {
          font-size: 14px;
        }

        .progress-modern {
          margin-bottom: 20px;
        }

        .progress-header-modern {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .progress-bar-modern {
          width: 100%;
          height: 6px;
          background: #f3f4f6;
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill-modern {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #1d4ed8);
          border-radius: 3px;
          transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .course-actions-modern {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: auto;
        }

        .course-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 20px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          min-width: 130px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .course-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }

        .start-btn {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
        }

        .start-btn:hover {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
        }

        .continue-btn {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .continue-btn:hover {
          background: linear-gradient(135deg, #059669, #047857);
        }

        .certificate-btn {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
        }

        .certificate-btn:hover {
          background: linear-gradient(135deg, #d97706, #b45309);
        }

        .review-btn {
          background: linear-gradient(135deg, #6b7280, #4b5563);
          color: white;
        }

        .review-btn:hover {
          background: linear-gradient(135deg, #4b5563, #374151);
        }

        .download-btn {
          background: transparent;
          color: #6b7280;
          border: 2px solid #e5e7eb;
        }

        .download-btn:hover {
          background: #f9fafb;
          border-color: #d1d5db;
          color: #374151;
        }

        @media (max-width: 768px) {
          .course-card-modern {
            margin: 0 16px;
          }
          
          .course-body {
            padding: 20px;
          }
          
          .course-actions-modern {
            flex-direction: column;
          }
          
          .course-action-btn {
            width: 100%;
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
} 