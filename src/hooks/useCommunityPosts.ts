import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    username: string | null;
    profileImage: string | null;
  };
  comments: Comment[];
  likes: Like[];
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    username: string | null;
    profileImage: string | null;
  };
}

export interface Like {
  id: string;
  userId: string;
}

export function useCommunityPosts() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Obtener todas las discusiones
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/community/posts');
      
      if (!response.ok) {
        throw new Error('Error al obtener las discusiones');
      }
      
      const data = await response.json();
      setPosts(data.posts);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Crear nueva discusión
  const createPost = async (title: string, content: string, category: string) => {
    try {
      console.log('🔍 [COMMUNITY] Iniciando creación de discusión...');
      console.log('🔍 [COMMUNITY] Usuario:', user?.email);
      
      if (!user) {
        throw new Error('Debes estar autenticado para crear una discusión');
      }

      console.log('🔍 [COMMUNITY] Enviando request a /api/community/posts...');
      
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Incluir cookies automáticamente
        body: JSON.stringify({ title, content, category }),
      });

      console.log('🔍 [COMMUNITY] Response status:', response.status);
      console.log('🔍 [COMMUNITY] Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('🔍 [COMMUNITY] Error response:', errorData);
        throw new Error(errorData.error || 'Error al crear la discusión');
      }

      const data = await response.json();
      console.log('🔍 [COMMUNITY] Discusión creada exitosamente:', data.post);
      
      // Agregar la nueva discusión al inicio de la lista
      setPosts(prevPosts => [data.post, ...prevPosts]);
      
      return data.post;
    } catch (err) {
      console.error('🔍 [COMMUNITY] Error en createPost:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    }
  };

  // Cargar discusiones al montar el componente
  useEffect(() => {
    fetchPosts();
  }, []);

  // Dar/quitar like a una discusión
  const toggleLike = async (postId: string) => {
    try {
      if (!user) {
        throw new Error('Debes estar autenticado para dar like');
      }

      const response = await fetch(`/api/community/posts/${postId}/like`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al procesar el like');
      }

      const { liked } = await response.json();
      
      // Actualizar el estado local
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            const newLikes = liked 
              ? [...post.likes, { id: 'temp', userId: user.id }]
              : post.likes.filter(like => like.userId !== user.id);
            return { ...post, likes: newLikes };
          }
          return post;
        })
      );
      
      return liked;
    } catch (err) {
      console.error('Error al procesar like:', err);
      throw err;
    }
  };

  // Crear comentario en una discusión
  const createComment = async (postId: string, content: string) => {
    try {
      if (!user) {
        throw new Error('Debes estar autenticado para comentar');
      }

      const response = await fetch(`/api/community/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear el comentario');
      }

      const { comment } = await response.json();
      
      // Actualizar el estado local
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            return { ...post, comments: [...post.comments, comment] };
          }
          return post;
        })
      );
      
      return comment;
    } catch (err) {
      console.error('Error al crear comentario:', err);
      throw err;
    }
  };

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    toggleLike,
    createComment,
  };
} 