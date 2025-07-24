'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Sidebar from '@/components/layout/Sidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useCommunityPosts, CommunityPost } from '@/hooks/useCommunityPosts';

export default function ForoPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [showCommentModal, setShowCommentModal] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostData, setNewPostData] = useState({
    title: '',
    content: '',
    category: 'general'
  });
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { posts, loading, error, toggleLike, createComment } = useCommunityPosts();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Categorías disponibles
  const categories = [
    { id: 'todas', name: 'Todas las categorías', icon: '📋' },
    { id: 'general', name: 'General', icon: '💬' },
    { id: 'courses', name: 'Cursos', icon: '📚' },
    { id: 'projects', name: 'Proyectos', icon: '🚀' },
    { id: 'questions', name: 'Preguntas', icon: '❓' },
    { id: 'resources', name: 'Recursos', icon: '📖' },
    { id: 'events', name: 'Eventos', icon: '🎉' },
    { id: 'career', name: 'Carrera', icon: '💼' },
  ];

  // Filtrar posts por categoría
  const filteredPosts = selectedCategory === 'todas' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

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

  const handleLike = async (postId: string) => {
    try {
      if (!user) {
        router.push('/login?redirect=/community/foro');
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
      router.push('/login?redirect=/community/foro');
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

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPostData.title.trim() || !newPostData.content.trim()) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      setIsSubmittingPost(true);
      
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newPostData.title.trim(),
          content: newPostData.content.trim(),
          category: newPostData.category
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear la discusión');
      }

      // Limpiar el formulario y cerrar el modal
      setNewPostData({
        title: '',
        content: '',
        category: 'general'
      });
      setShowCreateModal(false);
      
      // Recargar los posts para mostrar el nuevo
      window.location.reload();
      
      alert('¡Discusión creada exitosamente!');
    } catch (error) {
      console.error('Error al crear discusión:', error);
      alert(error instanceof Error ? error.message : 'Error al crear la discusión');
    } finally {
      setIsSubmittingPost(false);
    }
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setNewPostData({
      title: '',
      content: '',
      category: 'general'
    });
  };

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="main-content">
        {/* Hero Section */}
        <section className="hero gradient-bg">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">
                Foro de la
                <span className="block">Comunidad</span>
              </h1>
              <p className="hero-description">
                Conecta, comparte y aprende con otros miembros de eGrow Academy. 
                Explora discusiones por categorías y participa en conversaciones valiosas.
              </p>
              
              {/* Logo animado debajo del texto */}
              <div className="hero-bottom-logo">
                <div className="logo-animation-wrapper">
                  <Image 
                    src={user && user.membershipLevel === 'PREMIUM' ? "/images/logop.png" : "/images/logog.png"}
                    alt="eGrow Academy" 
                    width={95}
                    height={95}
                    priority
                    className="hero-bottom-logo-image"
                  />
                </div>
              </div>
              
                             <div className="hero-buttons">
                 <a href="/community#forum" className="btn btn-back">
                   <span className="btn-icon">←</span>
                   <span>Volver</span>
                 </a>
               </div>
            </div>
          </div>
        </section>

        {/* Categorías */}
        <section id="categories" className="categories-section">
          <div className="container">
            <div className="categories-grid">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`category-card ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
                  <span className="category-count">
                    {category.id === 'todas' 
                      ? posts.length 
                      : posts.filter(post => post.category === category.id).length
                    }
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Discusiones */}
        <section className="discussions-section">
          <div className="container">
            <div className="section-header">
              <div className="section-header-content">
                <h2>
                  {selectedCategory === 'todas' 
                    ? 'Todas las Discusiones' 
                    : `Discusiones de ${categories.find(c => c.id === selectedCategory)?.name}`
                  }
                  <span className="discussion-count">({filteredPosts.length})</span>
                </h2>
                <button 
                  className="btn-create-discussion"
                  onClick={() => {
                    if (!user) {
                      router.push('/login?redirect=/community/foro');
                      return;
                    }
                    setShowCreateModal(true);
                  }}
                >
                  <span className="btn-icon">✏️</span>
                  <span>Nueva Discusión</span>
                </button>
              </div>
            </div>

            <div className="discussions-grid">
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
              ) : filteredPosts.length === 0 ? (
                <div className="empty-state">
                  <p>
                    {selectedCategory === 'todas' 
                      ? 'No hay discusiones aún. ¡Sé el primero en crear una!' 
                      : `No hay discusiones en la categoría "${categories.find(c => c.id === selectedCategory)?.name}". ¡Sé el primero!`
                    }
                  </p>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <div key={post.id} className="discussion-card">
                    <div className="discussion-header">
                      <div className="user-info">
                        <img 
                          src={post.user.profileImage || `https://via.placeholder.com/50x50/667eea/ffffff?text=${post.user.firstName.charAt(0)}${post.user.lastName.charAt(0)}`} 
                          alt={`${post.user.firstName} ${post.user.lastName}`} 
                          className="user-avatar" 
                        />
                        <div className="user-details">
                          <h3 className="discussion-title">{post.title}</h3>
                          <p className="discussion-meta">
                            {post.user.firstName} {post.user.lastName} · {formatTimeAgo(post.createdAt)} · 
                            <span className="category-tag"> {post.category}</span>
                          </p>
                        </div>
                      </div>
                      <div className="discussion-engagement">
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
                    <div className="discussion-content">
                      <p>{post.content.length > 300 ? `${post.content.substring(0, 300)}...` : post.content}</p>
                    </div>
                    
                    {/* Mostrar comentarios si existen */}
                    {post.comments.length > 0 && (
                      <div className="comments-section">
                        <h5>Comentarios ({post.comments.length})</h5>
                        <div className="comments-list">
                          {post.comments.slice(0, 2).map((comment) => (
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
                          {post.comments.length > 2 && (
                            <p className="more-comments">
                              Ver {post.comments.length - 2} comentarios más...
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>

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

      {/* Modal para crear nueva discusión */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={closeCreateModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>✏️ Nueva Discusión</h3>
              <button className="modal-close" onClick={closeCreateModal}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreatePost}>
                <div className="form-group">
                  <label htmlFor="title">Título de la discusión *</label>
                  <input
                    type="text"
                    id="title"
                    value={newPostData.title}
                    onChange={(e) => setNewPostData({...newPostData, title: e.target.value})}
                    placeholder="Escribe un título atractivo..."
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="category">Categoría *</label>
                  <select
                    id="category"
                    value={newPostData.category}
                    onChange={(e) => setNewPostData({...newPostData, category: e.target.value})}
                    className="form-select"
                    required
                  >
                    {categories.filter(cat => cat.id !== 'todas').map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="content">Contenido de la discusión *</label>
                  <textarea
                    id="content"
                    value={newPostData.content}
                    onChange={(e) => setNewPostData({...newPostData, content: e.target.value})}
                    placeholder="Comparte tus pensamientos, preguntas o experiencias..."
                    rows={6}
                    className="form-textarea"
                    required
                  />
                </div>
                
                <div className="modal-actions">
                  <button type="button" onClick={closeCreateModal} className="btn btn-secondary" disabled={isSubmittingPost}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isSubmittingPost}>
                    {isSubmittingPost ? 'Creando...' : 'Crear Discusión'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
      
      <style jsx>{`
        .main-content {
          min-height: 100vh;
        }

        /* Hero Section */
        .hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 4rem 0;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }

        .hero-title .block {
          display: block;
          background: linear-gradient(45deg, #fff, #f0f0f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          opacity: 0.9;
          line-height: 1.6;
        }

        .hero-bottom-logo {
          display: flex;
          justify-content: center;
          margin: 2rem 0;
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

        .hero-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 2rem;
        }

        .btn {
          padding: 0.875rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 160px;
        }

        .btn-white {
          background: white;
          color: #667eea;
          border-color: white;
        }

        .btn-white:hover {
          background: transparent;
          color: white;
          border-color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
        }

        .btn-outline {
          background: transparent;
          color: white;
          border-color: rgba(255, 255, 255, 0.5);
        }

                 .btn-outline:hover {
           background: rgba(255, 255, 255, 0.1);
           border-color: white;
           transform: translateY(-2px);
           box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
         }

         .btn-back {
           background: rgba(255, 255, 255, 0.15);
           color: white;
           border: 2px solid rgba(255, 255, 255, 0.3);
           backdrop-filter: blur(10px);
           display: flex;
           align-items: center;
           gap: 0.5rem;
           padding: 1rem 2rem;
           font-size: 1.1rem;
           font-weight: 600;
           transition: all 0.3s ease;
           position: relative;
           overflow: hidden;
         }

         .btn-back::before {
           content: '';
           position: absolute;
           top: 0;
           left: -100%;
           width: 100%;
           height: 100%;
           background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
           transition: left 0.5s ease;
         }

         .btn-back:hover {
           background: rgba(255, 255, 255, 0.25);
           border-color: rgba(255, 255, 255, 0.6);
           transform: translateY(-3px);
           box-shadow: 0 12px 30px rgba(255, 255, 255, 0.3);
         }

         .btn-back:hover::before {
           left: 100%;
         }

         .btn-back:hover .btn-icon {
           transform: translateX(-3px);
         }

         .btn-icon {
           font-size: 1.2rem;
           transition: transform 0.3s ease;
         }

        .categories-section {
          padding: 2rem 0;
          background: white;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .category-card {
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .category-card:hover {
          border-color: #667eea;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
        }

        .category-card.active {
          border-color: #667eea;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .category-icon {
          font-size: 2rem;
        }

        .category-name {
          font-weight: 600;
          text-align: center;
        }

        .category-count {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .category-card.active .category-count {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .discussions-section {
          padding: 3rem 0;
          background: #f8fafc;
        }

        .section-header {
          margin-bottom: 2rem;
        }

        .section-header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .section-header h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #2d3748;
          margin: 0;
        }

        .btn-create-discussion {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 0.875rem 1.5rem;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .btn-create-discussion:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .btn-create-discussion .btn-icon {
          font-size: 1.1rem;
        }

        .discussion-count {
          color: #667eea;
          font-weight: 600;
        }

        .discussions-grid {
          display: grid;
          gap: 2rem;
        }

        .discussion-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .discussion-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .discussion-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }

        .user-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
        }

        .discussion-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #2d3748;
          margin: 0 0 0.5rem 0;
        }

        .discussion-meta {
          color: #718096;
          font-size: 0.875rem;
          margin: 0;
        }

        .category-tag {
          color: #667eea;
          font-weight: 600;
        }

        .discussion-engagement {
          display: flex;
          gap: 1rem;
        }

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
          color: #718096;
        }

        .engagement-item:hover {
          background: #f7fafc;
          color: #4a5568;
          transform: translateY(-1px);
        }

        .like-button:hover {
          color: #dc2626;
        }

        .comment-button:hover {
          color: #2563eb;
        }

        .discussion-content {
          margin: 1rem 0;
          color: #4a5568;
          line-height: 1.6;
        }

        .loading-container,
        .error-container,
        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #718096;
        }

        .error-container {
          color: #dc2626;
        }

        /* Estilos para comentarios */
        .comments-section {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
        }

        .comments-section h5 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 0.75rem;
        }

        .comments-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .comment-item {
          background: #f7fafc;
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
          color: #2d3748;
        }

        .comment-time {
          font-size: 0.75rem;
          color: #718096;
        }

        .comment-content {
          font-size: 0.875rem;
          color: #4a5568;
          line-height: 1.4;
          margin: 0;
        }

        .more-comments {
          font-size: 0.875rem;
          color: #667eea;
          text-align: center;
          margin: 0;
          cursor: pointer;
        }

        .more-comments:hover {
          text-decoration: underline;
        }

        /* Modal styles */
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
          padding: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 700;
          color: #2d3748;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #718096;
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
          padding: 1.5rem;
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
        .form-select {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
          background: white;
        }

        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: #667eea;
        }

        .form-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          resize: vertical;
          min-height: 120px;
          transition: border-color 0.3s ease;
        }

        .form-textarea:focus {
          outline: none;
          border-color: #667eea;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .btn-primary {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .btn-primary:hover {
          background: #5a67d8;
          border-color: #5a67d8;
        }

        .btn-secondary {
          background: #f7fafc;
          color: #4a5568;
          border-color: #e2e8f0;
        }

        .btn-secondary:hover {
          background: #edf2f7;
          border-color: #cbd5e0;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-description {
            font-size: 1.1rem;
          }

          .hero-bottom-logo-image {
            max-width: 76px;
            max-height: 57px;
          }

          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }

          .btn-back {
            width: 100%;
            max-width: 200px;
            justify-content: center;
          }

          .section-header-content {
            flex-direction: column;
            text-align: center;
          }

          .btn-create-discussion {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }

          .hero-description {
            font-size: 1rem;
          }

          .hero-bottom-logo-image {
            max-width: 66px;
            max-height: 48px;
          }

          .hero {
            padding: 3rem 0;
          }

          .categories-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }

          .discussion-header {
            flex-direction: column;
            gap: 1rem;
          }

          .discussion-engagement {
            align-self: flex-end;
          }

          .modal-actions {
            flex-direction: column;
          }

          .modal-actions .btn {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
} 