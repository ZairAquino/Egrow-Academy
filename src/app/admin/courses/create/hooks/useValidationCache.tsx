"use client";

import { useState, useCallback, useRef } from 'react';

interface ValidationResult {
  valid: boolean;
  errors?: string[];
  suggestions?: string[];
  generatedSlug?: string;
}

interface CacheEntry {
  result: ValidationResult;
  timestamp: number;
}

// Cache en memoria para validaciones
const validationCache = new Map<string, CacheEntry>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export function useValidationCache() {
  const [pendingValidations, setPendingValidations] = useState<Set<string>>(new Set());
  const debounceTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const getCacheKey = (field: string, value: string, courseId?: string) => {
    return `${field}:${value}:${courseId || 'new'}`;
  };

  const isValidCacheEntry = (entry: CacheEntry): boolean => {
    return Date.now() - entry.timestamp < CACHE_DURATION;
  };

  const getCachedResult = (field: string, value: string, courseId?: string): ValidationResult | null => {
    const key = getCacheKey(field, value, courseId);
    const entry = validationCache.get(key);
    
    if (entry && isValidCacheEntry(entry)) {
      return entry.result;
    }
    
    // Limpiar entrada expirada
    if (entry) {
      validationCache.delete(key);
    }
    
    return null;
  };

  const setCachedResult = (
    field: string, 
    value: string, 
    result: ValidationResult, 
    courseId?: string
  ) => {
    const key = getCacheKey(field, value, courseId);
    validationCache.set(key, {
      result,
      timestamp: Date.now()
    });
  };

  const validateWithCache = useCallback(async (
    field: string,
    value: string,
    courseId?: string,
    debounceMs: number = 500
  ): Promise<ValidationResult> => {
    // Verificar caché primero
    const cached = getCachedResult(field, value, courseId);
    if (cached) {
      return cached;
    }

    const key = getCacheKey(field, value, courseId);
    
    // Si ya hay una validación pendiente para este valor, esperar
    if (pendingValidations.has(key)) {
      return new Promise((resolve) => {
        const checkPending = () => {
          const cachedResult = getCachedResult(field, value, courseId);
          if (cachedResult) {
            resolve(cachedResult);
          } else if (pendingValidations.has(key)) {
            setTimeout(checkPending, 100);
          } else {
            // Si no hay resultado y no está pendiente, hacer nueva validación
            validateWithCache(field, value, courseId, 0).then(resolve);
          }
        };
        checkPending();
      });
    }

    // Cancelar timer anterior si existe
    const existingTimer = debounceTimers.current.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    return new Promise((resolve) => {
      const timer = setTimeout(async () => {
        try {
          setPendingValidations(prev => new Set(prev).add(key));
          
          const response = await fetch('/api/admin/courses/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ field, value, courseId })
          });
          
          const result = await response.json();
          
          // Guardar en caché
          setCachedResult(field, value, result, courseId);
          
          setPendingValidations(prev => {
            const newSet = new Set(prev);
            newSet.delete(key);
            return newSet;
          });
          
          debounceTimers.current.delete(key);
          resolve(result);
        } catch (error) {
          setPendingValidations(prev => {
            const newSet = new Set(prev);
            newSet.delete(key);
            return newSet;
          });
          
          debounceTimers.current.delete(key);
          
          const errorResult = {
            valid: false,
            errors: ['Error de conexión. Inténtalo de nuevo.']
          };
          
          resolve(errorResult);
        }
      }, debounceMs);
      
      debounceTimers.current.set(key, timer);
    });
  }, [pendingValidations]);

  const clearCache = useCallback(() => {
    validationCache.clear();
  }, []);

  const clearExpiredCache = useCallback(() => {
    const now = Date.now();
    for (const [key, entry] of validationCache.entries()) {
      if (now - entry.timestamp >= CACHE_DURATION) {
        validationCache.delete(key);
      }
    }
  }, []);

  const isPending = useCallback((field: string, value: string, courseId?: string) => {
    const key = getCacheKey(field, value, courseId);
    return pendingValidations.has(key);
  }, [pendingValidations]);

  return {
    validateWithCache,
    getCachedResult,
    clearCache,
    clearExpiredCache,
    isPending,
    cacheSize: validationCache.size
  };
}