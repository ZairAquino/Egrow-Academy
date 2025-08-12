'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function useAutoSave(
  data: any, 
  saveFunction: () => Promise<{ success: boolean; error?: any }>,
  interval: number = 30000 // 30 segundos
) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastDataRef = useRef<string>('');
  const isMountedRef = useRef(true);

  // Función para guardar datos
  const saveData = useCallback(async () => {
    if (!isMountedRef.current || saveStatus === 'saving') return;

    const currentDataString = JSON.stringify(data);
    
    // Solo guardar si los datos han cambiado
    if (currentDataString === lastDataRef.current) return;

    setSaveStatus('saving');
    
    try {
      const result = await saveFunction();
      
      if (!isMountedRef.current) return;
      
      if (result.success) {
        setSaveStatus('saved');
        setLastSaved(new Date());
        lastDataRef.current = currentDataString;
        
        // Volver a idle después de 2 segundos
        setTimeout(() => {
          if (isMountedRef.current) {
            setSaveStatus('idle');
          }
        }, 2000);
      } else {
        setSaveStatus('error');
        console.error('Error en auto-guardado:', result.error);
        
        // Volver a idle después de 5 segundos
        setTimeout(() => {
          if (isMountedRef.current) {
            setSaveStatus('idle');
          }
        }, 5000);
      }
    } catch (error) {
      if (!isMountedRef.current) return;
      
      setSaveStatus('error');
      console.error('Error en auto-guardado:', error);
      
      // Volver a idle después de 5 segundos
      setTimeout(() => {
        if (isMountedRef.current) {
          setSaveStatus('idle');
        }
      }, 5000);
    }
  }, [data, saveFunction, saveStatus]);

  // Función para forzar un guardado inmediato
  const forceSave = useCallback(async () => {
    if (saveStatus === 'saving') return;
    await saveData();
  }, [saveData, saveStatus]);

  // Función para habilitar/deshabilitar auto-guardado
  const enableAutoSave = useCallback(() => {
    setIsEnabled(true);
  }, []);

  const disableAutoSave = useCallback(() => {
    setIsEnabled(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Configurar auto-guardado
  useEffect(() => {
    if (!isEnabled) return;

    // Limpiar intervalo anterior si existe
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Configurar nuevo intervalo
    intervalRef.current = setInterval(() => {
      if (isEnabled && isMountedRef.current) {
        saveData();
      }
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isEnabled, interval, saveData]);

  // Auto-guardado cuando el usuario sale de la página
  useEffect(() => {
    const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
      const currentDataString = JSON.stringify(data);
      
      if (currentDataString !== lastDataRef.current && saveStatus !== 'saving') {
        // Intentar guardar antes de salir
        event.preventDefault();
        event.returnValue = '';
        
        // Guardar de forma síncrona usando sendBeacon si está disponible
        try {
          const formData = new FormData();
          formData.append('data', currentDataString);
          
          if (navigator.sendBeacon) {
            navigator.sendBeacon('/api/admin/courses/auto-save', formData);
          }
        } catch (error) {
          console.error('Error guardando antes de salir:', error);
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Guardar cuando la página se oculta (cambio de tab, minimizar, etc.)
        forceSave();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [data, saveStatus, forceSave]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Guardar cuando cambian los datos (con debounce)
  useEffect(() => {
    const currentDataString = JSON.stringify(data);
    
    // Solo proceder si los datos realmente cambiaron
    if (currentDataString === lastDataRef.current) return;
    
    // Debounce: esperar 5 segundos después del último cambio
    const timeoutId = setTimeout(() => {
      if (isEnabled && isMountedRef.current) {
        saveData();
      }
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [data, isEnabled, saveData]);

  return {
    saveStatus,
    lastSaved,
    forceSave,
    enableAutoSave,
    disableAutoSave,
    isEnabled
  };
}