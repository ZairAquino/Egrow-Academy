'use client';

import { useState, Suspense, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import DynamicLogo from '@/components/ui/DynamicLogo';

import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useCommunityPosts, CommunityPost } from '@/hooks/useCommunityPosts';
import { useCommunityStats } from '@/hooks/useCommunityStats';
import { useEvents } from '@/hooks/useEvents';

// Lazy load components
const CompaniesMarquee = dynamic(() => import('@/components/ui/CompaniesMarquee'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function CommunityPage() {
  
  const [showCreateDiscussionModal, setShowCreateDiscussionModal] = useState(false);
  const [discussionForm, setDiscussionForm] = useState({
    title: '',
    content: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { posts, loading, error, createPost, toggleLike, createComment } = useCommunityPosts();
  const { stats: communityStats, loading: statsLoading } = useCommunityStats();
  const { events: dbEvents, userRegistrations, loading: eventsLoading, registerToEvent, isUserRegistered } = useEvents();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  

  const handleCreateDiscussion = () => {
    if (!user) {
      // Redirigir al login si no está autenticado
      router.push('/login?redirect=/community');
      return;
    }
    
    // Mostrar modal para crear discusión
    setShowCreateDiscussionModal(true);
  };

  const handleSubmitDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!discussionForm.title.trim() || !discussionForm.content.trim()) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      setIsSubmitting(true);
      await createPost(
        discussionForm.title.trim(),
        discussionForm.content.trim(),
        discussionForm.category
      );
      
      setShowCreateDiscussionModal(false);
      setDiscussionForm({ title: '', content: '', category: 'general' });
      alert('¡Discusión creada exitosamente!');
    } catch (error) {
      console.error('Error al crear discusión:', error);
      alert(error instanceof Error ? error.message : 'Error al crear la discusión');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowCreateDiscussionModal(false);
    setDiscussionForm({ title: '', content: '', category: 'general' });
  };

  const handleLike = async (postId: string) => {
    try {
      if (!user) {
        router.push('/login?redirect=/community');
        return;
      }
      await toggleLike(postId);
    } catch (error) {
      console.error('Error al procesar like:', error);
      alert(error instanceof Error ? error.message : 'Error al procesar el like');
    }
  };

  const handleComment = (postId: string) => {
    if (!user) {
      router.push('/login?redirect=/community');
      return;
    }
    setShowCommentModal(postId);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!showCommentModal || !commentContent.trim()) {
      alert('Por favor escribe un comentario');
      return;
    }

    try {
      setIsSubmittingComment(true);
      await createComment(showCommentModal, commentContent.trim());
      setShowCommentModal(null);
      setCommentContent('');
      alert('¡Comentario agregado exitosamente!');
    } catch (error) {
      console.error('Error al crear comentario:', error);
      alert(error instanceof Error ? error.message : 'Error al crear el comentario');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const closeCommentModal = () => {
    setShowCommentModal(null);
    setCommentContent('');
  };

  // Función para formatear el tiempo relativo
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'hace un momento';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `hace ${days} ${days === 1 ? 'día' : 'días'}`;
    } else {
      const months = Math.floor(diffInSeconds / 2592000);
      return `hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
    }
  };

  useEffect(() => {
    const handleFAQToggle = (e: Event) => {
      const question = (e.target as Element).closest('.faq-question');
      if (question) {
        const faqItem = question.closest('.faq-item');
        if (faqItem) {
          faqItem.classList.toggle('active');
        }
      }
    };

    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
      question.addEventListener('click', handleFAQToggle);
    });

    return () => {
      faqQuestions.forEach(question => {
        question.removeEventListener('click', handleFAQToggle);
      });
    };
  }, []);

  // Estadísticas dinámicas de la comunidad
  const getDisplayStats = () => {
    if (!communityStats) {
      return [
        { number: '...', label: 'Miembros Activos' },
        { number: '...', label: 'Países' },
        { number: '...', label: 'Interacciones' },
        { number: '...', label: 'Miembros Premium' }
      ];
    }

    return [
      { number: communityStats.activeMembers.toLocaleString(), label: 'Miembros Activos' },
      { number: communityStats.countriesCount.toString(), label: 'Países' },
      { number: communityStats.totalInteractions.toLocaleString(), label: 'Interacciones' },
      { number: communityStats.premiumMembers.toLocaleString(), label: 'Miembros Premium' }
    ];
  };

  const getForumStats = () => {
    if (!communityStats) {
      return {
        discussions: '...',
        activeMembers: '...',
        responses: '...'
      };
    }

    return {
      discussions: posts.length.toString(),
      activeMembers: communityStats.activeMembers.toString(),
      responses: communityStats.breakdown.comments.toString()
    };
  };

  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);

  // Usar eventos de la base de datos en lugar del array hardcodeado
  const allEvents = useMemo(() => dbEvents, [dbEvents]);

  // Función para filtrar eventos válidos (eventos futuros y recientes)
  const filterValidEvents = (events: any[]) => {
    const today = new Date();
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);

    return events.filter(event => {
      const eventDate = new Date(event.date);
      // Mostrar eventos futuros y eventos que ocurrieron en los últimos 3 días
      return eventDate >= threeDaysAgo;

      
    });
  };

  // Función para calcular días restantes hasta que se elimine el evento
  const getDaysUntilRemoval = (eventDate: string) => {
    const today = new Date();
    const eventDateObj = new Date(eventDate);
    const threeDaysAfterEvent = new Date(eventDateObj);
    threeDaysAfterEvent.setDate(eventDateObj.getDate() + 3);
    
    const diffTime = threeDaysAfterEvent.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Función para verificar si un evento está próximo a expirar
  const isEventExpiringSoon = (eventDate: string) => {
    const daysUntilRemoval = getDaysUntilRemoval(eventDate);
    return daysUntilRemoval <= 1;
  };

  // Función para formatear la fecha de manera amigable
  const formatEventDate = (dateInput: string | Date) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Mañana';
    } else {
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  // Efecto para actualizar eventos filtrados
  useEffect(() => {
    const validEvents = filterValidEvents(allEvents);
    setFilteredEvents(validEvents);
  }, [allEvents]);









  // Limpiar eventos pasados cada hora
  useEffect(() => {
    const interval = setInterval(() => {
      const validEvents = filterValidEvents(allEvents);
      setFilteredEvents(validEvents);
    }, 60 * 60 * 1000); // 1 hora
    return () => clearInterval(interval);
  }, []); // Sin dependencias para evitar recrear el intervalo

  const handleEventRegistration = async (eventId: string) => {
    if (!user) {
      router.push('/login?redirect=/community');
      return;
    }

    try {
      const result = await registerToEvent(eventId);
      
      if (result.success) {
        alert('¡Te has registrado exitosamente! Te enviaremos recordatorios por email.');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error al registrar al evento:', error);
      alert(error instanceof Error ? error.message : 'Error al registrarse al evento. Por favor, intenta de nuevo.');
    }
  };



  const communityFeatures = [
    {
      icon: '💬',
      title: 'Foros de Discusión',
      description: 'Conecta con otros profesionales, comparte conocimientos y resuelve dudas'
    },
    {
      icon: '🎯',
      title: 'Mentorías',
      description: 'Accede a sesiones de mentoría con expertos del sector'
    },
    {
      icon: '📚',
      title: 'Recursos Compartidos',
      description: 'Biblioteca de recursos, papers y herramientas recomendadas por la comunidad'
    },
    {
      icon: '🤝',
      title: 'Networking',
      description: 'Eventos presenciales y virtuales para expandir tu red profesional'
    },
    {
      icon: '🏆',
      title: 'Competencias',
      description: 'Participa en hackathons y competencias de IA'
    },
    {
      icon: '📈',
      title: 'Oportunidades Laborales',
      description: 'Acceso exclusivo a ofertas de trabajo en empresas líderes'
    }
  ];



  return (
    <>
      <Navbar  />
      
      
      
      <main className="main-content pt-16">
        {/* Hero Section */}
        <section className="hero gradient-bg">
          {/* Video de fondo - solo renderizar en el cliente */}
          {isClient && (
            <video
              autoPlay
              muted
              loop
              playsInline
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: -0.5
              }}
            >
              <source src="/videos/background.webm" type="video/webm" />
              Tu navegador no soporta el elemento video.
            </video>
          )}
          
          <div className="container" style={{ position: 'relative', zIndex: 10 }}>
            <div className="hero-content">
              <h1 className="hero-title">
                Únete a nuestra
                <span className="block">Comunidad </span>
              </h1>
              <p className="hero-description">
              Construye relaciones que transforman tu carrera. Conecta con expertos, 
              comparte conocimientos y accede a oportunidades exclusivas en el mundo de la IA.
              </p>
              
              {/* Logo blanco debajo del texto */}
              <div className="hero-bottom-logo">
                <div className="logo-animation-wrapper">
                  <DynamicLogo width={95} height={95} priority className="hero-bottom-logo-image" />
                </div>
              </div>
              

            </div>
          </div>
        </section>

        {/* Companies Marquee */}
        <Suspense fallback={<LoadingSpinner />}>
          <CompaniesMarquee />
        </Suspense>

        {/* Community Navigation Buttons */}
        <section className="section">
          <div className="container">
            <div className="community-nav-buttons">
              <a href="#features" className="btn btn-primary">¿Qué Ofrecemos?</a>
              <a href="#forum" className="btn btn-primary">Ver Foro</a>
              <a href="#events" className="btn btn-primary">Ver Eventos</a>
              <a href="#faq" className="btn btn-primary">FAQ</a>
            </div>
          </div>
        </section>

        {/* Community Features & Stats */}
        <section id="features" className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">¿Qué Ofrece Nuestra Comunidad?</h2>
              <p className="section-description">
                Descubre todas las oportunidades y recursos disponibles para miembros
              </p>
            </div>

            <div className="features-stats-layout">
              {/* Left side - Features */}
              <div className="features-container">
                <div className="features-grid-compact">
                  {communityFeatures.map((feature, index) => (
                    <div key={index} className="feature-card">
                      <div className="feature-icon">{feature.icon}</div>
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right side - Stats */}
              <div className="stats-container">
                <h3 className="stats-title">Nuestra Comunidad en Números</h3>
                <div className="stats-grid-vertical">
                  {getDisplayStats().map((stat, index) => (
                    <div key={index} className="stat-card">
                      <div className="stat-number">
                        {statsLoading ? (
                          <div className="stat-loading">
                            <div className="loading-dots">
                              <span></span>
                              <span></span>
                              <span></span>
                            </div>
                          </div>
                        ) : (
                          stat.number
                        )}
                      </div>
                      <div className="stat-label">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Forum */}
        <section id="forum" className="section forum-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Foro de la Comunidad eGrow</h2>
              <p className="section-description">
                Únete a las discusiones, comparte experiencias y conecta con otros estudiantes
              </p>
            </div>

            <div className="forum-layout">
              {/* Forum Header with Stats */}
              <div className="forum-header">
                <div className="forum-stats">
                  <div className="stat-item">
                    <span className="stat-number">
                      {statsLoading ? (
                        <span className="loading-dots">...</span>
                      ) : (
                        getForumStats().discussions
                      )}
                    </span>
                    <span className="stat-text">Discusiones</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">
                      {statsLoading ? (
                        <span className="loading-dots">...</span>
                      ) : (
                        getForumStats().activeMembers
                      )}
                    </span>
                    <span className="stat-text">Miembros Activos</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">
                      {statsLoading ? (
                        <span className="loading-dots">...</span>
                      ) : (
                        getForumStats().responses
                      )}
                    </span>
                    <span className="stat-text">Respuestas</span>
                  </div>
                </div>
                <button 
                  className="btn btn-primary forum-cta" 
                  onClick={handleCreateDiscussion}
                >
                  💬 Crear Nueva Discusión
                </button>
              </div>

              {/* Recent Discussions */}
              <div className="forum-content">
                <div className="forum-section-title">
                  <h3>💬 Discusiones Recientes</h3>
                  {user ? (
                    <a href="/community/foro" className="btn btn-primary forum-cta">
                      <span className="btn-text">Ver todas</span>
                      <svg className="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  ) : (
                    <div className="auth-required-btn">
                      <button 
                        onClick={() => router.push('/login?redirect=/community/foro')}
                        className="btn btn-primary forum-cta auth-btn"
                      >
                        <span className="lock-icon">🔒</span>
                        <span className="btn-text">Ver todas</span>
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="forum-posts">
                  {loading ? (
                    <div className="loading-container">
                      <LoadingSpinner />
                      <p>Cargando discusiones...</p>
                    </div>
                  ) : error ? (
                    <div className="error-container">
                      <p>Error al cargar las discusiones: {error}</p>
                      <button onClick={() => window.location.reload()} className="btn btn-primary">
                        Reintentar
                      </button>
                    </div>
                  ) : posts.length === 0 ? (
                    <div className="empty-state">
                      <p>No hay discusiones aún. ¡Sé el primero en crear una!</p>
                    </div>
                  ) : (
                    <>
                      {posts.slice(0, 3).map((post) => (
                      <div key={post.id} className="forum-post-card">
                        <div className="post-header">
                          <div className="user-info">
                            <img 
                              src={post.user.profileImage || `https://via.placeholder.com/50x50/667eea/ffffff?text=${post.user.firstName.charAt(0)}${post.user.lastName.charAt(0)}`} 
                              alt={`${post.user.firstName} ${post.user.lastName}`} 
                              className="user-avatar" 
                            />
                            <div className="user-details">
                              <h4 className="post-title">{post.title}</h4>
                              <p className="post-meta">
                                {post.user.firstName} {post.user.lastName} · {formatTimeAgo(post.createdAt)} · 
                                <span className="course-tag"> {post.category}</span>
                              </p>
                            </div>
                          </div>
                          <div className="post-engagement">
                            <button 
                              className="engagement-item like-button"
                              onClick={() => handleLike(post.id)}
                              title="Me gusta"
                            >
                              <span className="icon">👍</span>
                              <span>{post.likes.length}</span>
                            </button>
                            <button 
                              className="engagement-item comment-button"
                              onClick={() => handleComment(post.id)}
                              title="Comentar"
                            >
                              <span className="icon">💬</span>
                              <span>{post.comments.length}</span>
                            </button>
                          </div>
                        </div>
                        <div className="post-content">
                          <p>{post.content.length > 200 ? `${post.content.substring(0, 200)}...` : post.content}</p>
                        </div>
                        
                        {/* Mostrar comentarios si existen */}
                        {post.comments.length > 0 && (
                          <div className="comments-section">
                            <h5>Comentarios ({post.comments.length})</h5>
                            <div className="comments-list">
                              {post.comments.slice(0, 3).map((comment) => (
                                <div key={comment.id} className="comment-item">
                                  <div className="comment-header">
                                    <img 
                                      src={comment.user.profileImage || `https://via.placeholder.com/32x32/667eea/ffffff?text=${comment.user.firstName.charAt(0)}`} 
                                      alt={`${comment.user.firstName} ${comment.user.lastName}`} 
                                      className="comment-avatar" 
                                    />
                                    <span className="comment-author">
                                      {comment.user.firstName} {comment.user.lastName}
                                    </span>
                                    <span className="comment-time">
                                      {formatTimeAgo(comment.createdAt)}
                                    </span>
                                  </div>
                                  <p className="comment-content">{comment.content}</p>
                                </div>
                              ))}
                              {post.comments.length > 3 && (
                                <p className="more-comments">
                                  Ver {post.comments.length - 3} comentarios más...
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      ))}
                      
                      {/* Indicador de más conversaciones */}
                      {posts.length > 3 && (
                        <div className="more-discussions-indicator">
                          <div className="indicator-content">
                            <div className="indicator-icon">💬</div>
                            <div className="indicator-text">
                              <p className="indicator-title">¡Hay más conversaciones!</p>
                              <p className="indicator-subtitle">
                                Mostrando 3 de {posts.length} discusiones activas
                              </p>
                            </div>
                            {user ? (
                              <a href="/community/foro" className="btn btn-outline btn-small">
                                Ver todas
                              </a>
                            ) : (
                              <button 
                                onClick={() => router.push('/login?redirect=/community/foro')}
                                className="btn btn-outline btn-small auth-indicator-btn"
                              >
                                🔒 Ver todas
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section id="events" className="section events-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Próximos Eventos</h2>
              <p className="section-description">
                Participa en nuestros eventos y workshops exclusivos
              </p>
            </div>

            <div className="events-table-container">
              {/* Indicador de deslizamiento para móvil */}
              <div className="scroll-indicator">
                <span className="scroll-text">Desliza para ver más</span>
                <div className="scroll-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              
              {dbEvents.length > 0 ? (
                <div className="events-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Evento</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Tipo</th>
                        <th>Asistentes</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dbEvents.map((event) => {
                        const isRegistered = isUserRegistered(event.id);
                        return (
                          <tr key={event.id}>
                            <td>
                              <div className="event-info">
                                <h4>{event.title}</h4>
                                <p>{event.description}</p>
                                <small>Con {event.instructor}</small>
                              </div>
                            </td>
                            <td>{formatEventDate(event.date)}</td>
                            <td>{event.time}</td>
                            <td>
                              <span className={`event-type-badge ${event.type.toLowerCase()}`}>
                                {event.type}
                              </span>
                            </td>
                            <td>👥 {event.attendees}</td>
                            <td>
                              {isRegistered ? (
                                <button 
                                  className="btn btn-success btn-small"
                                  disabled
                                >
                                  ✅ Registrado
                                </button>
                              ) : (
                                <button 
                                  className="btn btn-primary btn-small"
                                  onClick={() => handleEventRegistration(event.id)}
                                >
                                  📅 Registrarse
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="no-events-message">
                  <div className="no-events-icon">📅</div>
                  <h3>No hay eventos próximos</h3>
                  <p>Mantente atento a nuestros próximos lanzamientos y eventos especiales.</p>
                  <div className="no-events-cta">
                    <a href="/community/foro" className="btn btn-primary">
                      Únete a la comunidad
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="section faq-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Preguntas Frecuentes</h2>
              <p className="section-description">
                Encuentra respuestas a las preguntas más comunes de nuestra comunidad
              </p>
            </div>

            <div className="faq-container">
              <div className="faq-item">
                <div className="faq-question">
                  <h3>¿Cómo puedo acceder a los cursos gratuitos?</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>Simplemente regístrate en eGrow Academy y tendrás acceso inmediato a todos nuestros cursos gratuitos. No necesitas tarjeta de crédito ni suscripción premium.</p>
                </div>
              </div>

              <div className="faq-item">
                <div className="faq-question">
                  <h3>¿Qué diferencia hay entre la cuenta gratuita y premium?</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>La cuenta gratuita te da acceso a cursos básicos y la comunidad. La cuenta premium incluye todos los cursos avanzados, recursos exclusivos, certificados y soporte prioritario.</p>
                </div>
              </div>

              <div className="faq-item">
                <div className="faq-question">
                  <h3>¿Cómo funciona el sistema de certificados?</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>Al completar un curso premium, recibirás automáticamente un certificado digital que puedes descargar y compartir en LinkedIn. Los certificados son verificables y reconocidos por la industria.</p>
                </div>
              </div>

              <div className="faq-item">
                <div className="faq-question">
                  <h3>¿Puedo acceder a los recursos desde cualquier dispositivo?</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>Sí, nuestra plataforma es completamente responsive. Puedes acceder desde tu computadora, tablet o smartphone. Tu progreso se sincroniza automáticamente entre dispositivos.</p>
                </div>
              </div>

              <div className="faq-item">
                <div className="faq-question">
                  <h3>¿Cómo puedo participar en la comunidad?</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>Una vez registrado, puedes crear discusiones, responder preguntas, compartir recursos y conectar con otros miembros en nuestro foro. La participación activa te ayuda a crecer profesionalmente.</p>
                </div>
              </div>

              <div className="faq-item">
                <div className="faq-question">
                  <h3>¿Los cursos incluyen ejercicios prácticos?</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>Sí, todos nuestros cursos incluyen ejercicios prácticos, proyectos reales y evaluaciones para que puedas aplicar lo que aprendes. También tienes acceso a un entorno de práctica en la nube.</p>
                </div>
              </div>

              <div className="faq-item">
                <div className="faq-question">
                  <h3>¿Puedo cancelar mi suscripción premium en cualquier momento?</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>Sí, puedes cancelar tu suscripción premium en cualquier momento desde tu perfil. Mantendrás acceso hasta el final del período facturado y conservarás todos los certificados obtenidos.</p>
                </div>
              </div>

              <div className="faq-item">
                <div className="faq-question">
                  <h3>¿Qué métodos de pago aceptan?</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>Aceptamos todas las tarjetas de crédito y débito principales, PayPal y transferencias bancarias. Todos los pagos son procesados de forma segura a través de Stripe.</p>
                </div>
              </div>

              <div className="faq-item">
                <div className="faq-question">
                  <h3>¿Hay garantía de devolución?</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>Ofrecemos una garantía de satisfacción de 30 días. Si no estás satisfecho con tu suscripción premium, te reembolsamos el 100% sin preguntas.</p>
                </div>
              </div>

              <div className="faq-item">
                <div className="faq-question">
                  <h3>¿Cómo puedo obtener soporte técnico?</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>Puedes contactarnos a través del formulario de contacto, por email o directamente en el foro de la comunidad. Los miembros premium tienen acceso a soporte prioritario.</p>
                </div>
              </div>

              {/* Forum CTA */}
              <div className="ask-question-cta">
                <div className="cta-content">
                  <h3>¿Tienes alguna duda específica?</h3>
                  <p>¡Únete a nuestro foro y pregunta a la comunidad! Nuestros expertos y miembros de eGrow Academy estarán encantados de ayudarte.</p>
                  {user ? (
                    <a href="/community/foro" className="btn btn-primary">
                      💬 Ir al Foro
                    </a>
                  ) : (
                    <button 
                      onClick={() => router.push('/login?redirect=/community/foro')}
                      className="btn btn-primary faq-auth-btn"
                    >
                      🔒 Ir al Foro
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Modal para crear discusión */}
      {showCreateDiscussionModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>💬 Crear Nueva Discusión</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmitDiscussion}>
                <div className="form-group">
                  <label htmlFor="title">Título de la discusión *</label>
                  <input
                    type="text"
                    id="title"
                    value={discussionForm.title}
                    onChange={(e) => setDiscussionForm({...discussionForm, title: e.target.value})}
                    placeholder="Escribe un título descriptivo..."
                    required
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="category">Categoría</label>
                  <select
                    id="category"
                    value={discussionForm.category}
                    onChange={(e) => setDiscussionForm({...discussionForm, category: e.target.value})}
                    className="form-select"
                  >
                    <option value="general">General</option>
                    <option value="courses">Cursos</option>
                    <option value="projects">Proyectos</option>
                    <option value="career">Carrera</option>
                    <option value="tools">Herramientas</option>
                    <option value="events">Eventos</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="content">Contenido de la discusión *</label>
                  <textarea
                    id="content"
                    value={discussionForm.content}
                    onChange={(e) => setDiscussionForm({...discussionForm, content: e.target.value})}
                    placeholder="Describe tu pregunta, comparte tu experiencia o inicia una discusión..."
                    required
                    rows={6}
                    className="form-textarea"
                  />
                </div>
                
                <div className="modal-actions">
                  <button type="button" onClick={closeModal} className="btn btn-secondary" disabled={isSubmitting}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Creando...' : 'Crear Discusión'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para comentarios */}
      {showCommentModal && (
        <div className="modal-overlay" onClick={closeCommentModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>💬 Agregar Comentario</h3>
              <button className="modal-close" onClick={closeCommentModal}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmitComment}>
                <div className="form-group">
                  <label htmlFor="comment">Tu comentario *</label>
                  <textarea
                    id="comment"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Escribe tu comentario aquí..."
                    rows={4}
                    className="form-textarea"
                    required
                  />
                </div>
                
                <div className="modal-actions">
                  <button type="button" onClick={closeCommentModal} className="btn btn-secondary" disabled={isSubmittingComment}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isSubmittingComment}>
                    {isSubmittingComment ? 'Enviando...' : 'Enviar Comentario'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
      
      <style jsx>{`
        .hero-bottom-logo {
          display: flex;
          justify-content: center;
          margin-top: 32px;
        }

        .hero-bottom-logo-image {
          height: auto;
          max-height: 71px;
          width: auto;
          max-width: 95px;
          opacity: 0.9;
          transition: all 0.3s ease;
        }

        .logo-animation-wrapper {
          animation: logoFloat 3s ease-in-out infinite;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .logo-animation-wrapper:hover {
          animation-play-state: paused;
        }

        .logo-animation-wrapper:hover .hero-bottom-logo-image {
          transform: scale(1.1) rotate(5deg);
          filter: brightness(1.2);
        }

        @keyframes logoFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @media (max-width: 768px) {
          .hero-bottom-logo-image {
            max-width: 76px;
            max-height: 57px;
          }
        }

        @media (max-width: 480px) {
          .hero-bottom-logo-image {
            max-width: 66px;
            max-height: 48px;
          }
        }

        /* Estilos para el modal de crear discusión */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 1rem;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d3748;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          color: #718096;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .modal-close:hover {
          background: #f7fafc;
          color: #2d3748;
        }

        .modal-body {
          padding: 2rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #2d3748;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
        }

        .btn-secondary {
          background: #f7fafc;
          color: #4a5568;
          border: 2px solid #e2e8f0;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: #edf2f7;
          border-color: #cbd5e0;
        }

        @media (max-width: 768px) {
          .modal-content {
            margin: 1rem;
            max-height: calc(100vh - 2rem);
          }

          .modal-header,
          .modal-body {
            padding: 1rem;
          }

          .modal-actions {
            flex-direction: column;
          }

          .modal-actions .btn {
            width: 100%;
          }
        }

        /* Estilos para estados de carga y error */
        .loading-container {
          text-align: center;
          padding: 2rem;
          color: var(--gray-600);
        }

        .error-container {
          text-align: center;
          padding: 2rem;
          color: #dc2626;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
          color: var(--gray-500);
          background: var(--gray-50);
          border-radius: 12px;
          margin: 1rem 0;
        }

        .post-content {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--gray-200);
          color: var(--gray-700);
          line-height: 1.6;
        }

        .post-content p {
          margin: 0;
        }

        /* Estilos para botones de engagement */
        .engagement-item {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: var(--gray-600);
        }

        .engagement-item:hover {
          background: var(--gray-100);
          color: var(--gray-800);
          transform: translateY(-1px);
        }

        .like-button:hover {
          color: #dc2626;
        }

        .comment-button:hover {
          color: #2563eb;
        }

        .engagement-item:active {
          transform: translateY(0);
        }

        .engagement-item .icon {
          font-size: 1.1rem;
        }

        .engagement-item span:last-child {
          font-weight: 500;
        }

        /* Estilos para la sección de comentarios */
        .comments-section {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--gray-200);
        }

        .comments-section h5 {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--gray-700);
          margin-bottom: 0.75rem;
        }

        .comments-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .comment-item {
          background: var(--gray-50);
          border-radius: 8px;
          padding: 0.75rem;
        }

        .comment-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .comment-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          object-fit: cover;
        }

        .comment-author {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--gray-800);
        }

        .comment-time {
          font-size: 0.75rem;
          color: var(--gray-500);
        }

        .comment-content {
          font-size: 0.875rem;
          color: var(--gray-700);
          line-height: 1.4;
          margin: 0;
        }

        .more-comments {
          font-size: 0.875rem;
          color: var(--gray-500);
          text-align: center;
          margin: 0;
          cursor: pointer;
        }

        .more-comments:hover {
          color: var(--gray-700);
          text-decoration: underline;
        }

        .view-all {
          color: var(--primary-color);
          font-weight: 600;
          cursor: pointer;
          transition: color 0.3s ease;
          text-decoration: none;
        }

        .view-all:hover {
          color: var(--primary-dark);
          text-decoration: underline;
        }

        /* Estilos para loading de estadísticas */
        .stat-loading {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loading-dots {
          display: flex;
          gap: 0.25rem;
        }

        .loading-dots span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--primary-color);
          animation: loadingDots 1.4s infinite ease-in-out;
        }

        .loading-dots span:nth-child(1) {
          animation-delay: -0.32s;
        }

        .loading-dots span:nth-child(2) {
          animation-delay: -0.16s;
        }

        @keyframes loadingDots {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        /* Estilos para botón de autenticación requerida */
        .auth-required-btn {
          display: flex;
          align-items: center;
        }

        .auth-btn {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1)) !important;
          border: 2px dashed rgba(102, 126, 234, 0.4) !important;
          color: #667eea !important;
          position: relative;
          overflow: hidden;
        }

        .auth-btn:hover {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15)) !important;
          border-color: rgba(102, 126, 234, 0.6) !important;
          transform: translateY(-1px);
        }

        .auth-btn .lock-icon {
          font-size: 14px;
          margin-right: 8px;
          opacity: 0.8;
        }

        .auth-btn .btn-text {
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .auth-btn .lock-icon {
            margin-right: 4px;
          }
          
          .auth-btn .btn-text {
            font-size: 14px;
          }
        }

        /* Estilos para el indicador de más conversaciones */
        .more-discussions-indicator {
          margin-top: 24px;
          padding: 20px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.03), rgba(118, 75, 162, 0.03));
          border: 1px solid rgba(102, 126, 234, 0.1);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .more-discussions-indicator:hover {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
          border-color: rgba(102, 126, 234, 0.15);
          transform: translateY(-1px);
        }

        .indicator-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .indicator-icon {
          font-size: 28px;
          opacity: 0.7;
          flex-shrink: 0;
        }

        .indicator-text {
          flex: 1;
        }

        .indicator-title {
          font-size: 16px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 4px 0;
        }

        .indicator-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .auth-indicator-btn {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08)) !important;
          border-color: rgba(102, 126, 234, 0.3) !important;
          color: #667eea !important;
        }

        .auth-indicator-btn:hover {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.12), rgba(118, 75, 162, 0.12)) !important;
          border-color: rgba(102, 126, 234, 0.4) !important;
        }

        @media (max-width: 768px) {
          .indicator-content {
            flex-direction: column;
            text-align: center;
            gap: 12px;
          }

          .indicator-icon {
            font-size: 32px;
          }

          .indicator-title {
            font-size: 15px;
          }

          .indicator-subtitle {
            font-size: 13px;
          }

          .more-discussions-indicator {
            padding: 16px;
          }
        }

        /* Estilos para botón de FAQ con autenticación */
        .faq-auth-btn {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1)) !important;
          border: 2px solid rgba(102, 126, 234, 0.3) !important;
          color: #667eea !important;
          position: relative;
          transition: all 0.3s ease;
        }

        .faq-auth-btn:hover {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15)) !important;
          border-color: rgba(102, 126, 234, 0.5) !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
        }

        .faq-auth-btn:active {
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .faq-auth-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
} 