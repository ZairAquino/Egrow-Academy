import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface Resource {
  id: string;
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  imageUrl?: string;
  category: string;
  type: string;
  author?: string;
  fileUrl?: string;
  requiresAuth: boolean;
  isFree: boolean;
  rating: number | string;
  downloadsCount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  topics: ResourceTopic[];
  _count?: {
    accessLogs: number;
  };
}

export interface ResourceTopic {
  id: string;
  title: string;
  description?: string;
  order: number;
  resourceId: string;
}

export interface ResourcesResponse {
  success: boolean;
  data: Resource[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  error?: string;
}

export interface ResourceResponse {
  success: boolean;
  data: Resource;
  error?: string;
}

export function useResources(category?: string) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 50,
    offset: 0,
    hasMore: false
  });

  const fetchResources = async (offset = 0) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        limit: '50',
        offset: offset.toString()
      });

      if (category && category !== 'todos') {
        params.append('category', category);
      }

      const response = await fetch(`/api/resources?${params}`);
      const text = await response.text();
      let data: ResourcesResponse;
      try {
        data = JSON.parse(text);
      } catch (e) {
        setError('Respuesta inválida del servidor');
        setLoading(false);
        return;
      }

      if (data.success) {
        if (offset === 0) {
          setResources(data.data);
        } else {
          setResources(prev => [...prev, ...data.data]);
        }
        setPagination(data.pagination);
      } else {
        setError(data.error || 'Error al cargar recursos');
      }
    } catch (err) {
      setError('Error de conexión');
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [category]);

  const loadMore = () => {
    if (pagination.hasMore && !loading) {
      fetchResources(pagination.offset + pagination.limit);
    }
  };

  return {
    resources,
    loading,
    error,
    pagination,
    loadMore,
    refetch: () => fetchResources()
  };
}

export function useResource(slug: string) {
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchResource = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/resources/${slug}`);
      const data: ResourceResponse = await response.json();

      if (data.success) {
        setResource(data.data);
      } else {
        setError(data.error || 'Error al cargar el recurso');
      }
    } catch (err) {
      setError('Error de conexión');
      console.error('Error fetching resource:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkAccess = async () => {
    if (!token) {
      return { hasAccess: false, requiresAuth: true };
    }

    try {
      const response = await fetch(`/api/resources/${slug}/access`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success && data.data) {
        return { hasAccess: data.data.hasAccess };
      }
      
      return { hasAccess: false, error: data.error };
    } catch (err) {
      console.error('Error checking access:', err);
      return { hasAccess: false, error: 'Error de conexión' };
    }
  };

  useEffect(() => {
    if (slug) {
      fetchResource();
    }
  }, [slug]);

  return {
    resource,
    loading,
    error,
    checkAccess,
    refetch: fetchResource
  };
} 