"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

interface AnalyticsEvent {
  event: string;
  timestamp: number;
  data?: any;
  step?: number;
  userId?: string;
  sessionId: string;
}

interface StepMetrics {
  stepNumber: number;
  stepName: string;
  totalTime: number;
  visits: number;
  completions: number;
  abandonment: number;
  errors: number;
  lastVisit: number;
}

interface FormAnalytics {
  sessionId: string;
  startTime: number;
  currentStep: number;
  stepMetrics: Record<number, StepMetrics>;
  events: AnalyticsEvent[];
  errors: string[];
  totalTime: number;
  isCompleted: boolean;
}

const STEP_NAMES = {
  1: 'Información Básica',
  2: 'Instructor',
  3: 'Objetivos y Contenido',
  4: 'Módulos y Lecciones',
  5: 'Testimonios',
  6: 'Configuración de Precios',
  7: 'Preview Final'
};

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<FormAnalytics>(() => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      sessionId,
      startTime: Date.now(),
      currentStep: 1,
      stepMetrics: {},
      events: [],
      errors: [],
      totalTime: 0,
      isCompleted: false
    };
  });

  const stepStartTime = useRef<number>(Date.now());
  const currentStepRef = useRef<number>(1);

  // Trackear evento genérico
  const trackEvent = useCallback((eventName: string, data?: any) => {
    const event: AnalyticsEvent = {
      event: eventName,
      timestamp: Date.now(),
      data,
      step: currentStepRef.current,
      sessionId: analytics.sessionId
    };

    setAnalytics(prev => ({
      ...prev,
      events: [...prev.events, event]
    }));

    // Log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', eventName, data);
    }
  }, [analytics.sessionId]);

  // Trackear cambio de step
  const trackStepChange = useCallback((newStep: number, oldStep: number) => {
    const now = Date.now();
    const timeInStep = now - stepStartTime.current;

    setAnalytics(prev => {
      const updatedMetrics = { ...prev.stepMetrics };
      
      // Actualizar métricas del step anterior
      if (!updatedMetrics[oldStep]) {
        updatedMetrics[oldStep] = {
          stepNumber: oldStep,
          stepName: STEP_NAMES[oldStep as keyof typeof STEP_NAMES] || `Step ${oldStep}`,
          totalTime: 0,
          visits: 0,
          completions: 0,
          abandonment: 0,
          errors: 0,
          lastVisit: 0
        };
      }
      
      updatedMetrics[oldStep].totalTime += timeInStep;
      updatedMetrics[oldStep].lastVisit = now;
      
      // Si avanza al siguiente step, marcar como completado
      if (newStep > oldStep) {
        updatedMetrics[oldStep].completions++;
      }
      
      // Inicializar métricas del nuevo step si no existen
      if (!updatedMetrics[newStep]) {
        updatedMetrics[newStep] = {
          stepNumber: newStep,
          stepName: STEP_NAMES[newStep as keyof typeof STEP_NAMES] || `Step ${newStep}`,
          totalTime: 0,
          visits: 0,
          completions: 0,
          abandonment: 0,
          errors: 0,
          lastVisit: now
        };
      }
      
      updatedMetrics[newStep].visits++;
      
      return {
        ...prev,
        currentStep: newStep,
        stepMetrics: updatedMetrics
      };
    });

    stepStartTime.current = now;
    currentStepRef.current = newStep;
    
    trackEvent('step_change', { 
      from: oldStep, 
      to: newStep, 
      timeInPreviousStep: timeInStep 
    });
  }, [trackEvent]);

  // Trackear error
  const trackError = useCallback((error: string, step?: number) => {
    const errorStep = step || currentStepRef.current;
    
    setAnalytics(prev => {
      const updatedMetrics = { ...prev.stepMetrics };
      
      if (updatedMetrics[errorStep]) {
        updatedMetrics[errorStep].errors++;
      }
      
      return {
        ...prev,
        errors: [...prev.errors, error],
        stepMetrics: updatedMetrics
      };
    });

    trackEvent('error', { error, step: errorStep });
  }, [trackEvent]);

  // Trackear validación
  const trackValidation = useCallback((field: string, valid: boolean, step?: number) => {
    trackEvent('validation', { 
      field, 
      valid, 
      step: step || currentStepRef.current 
    });
  }, [trackEvent]);

  // Trackear auto-guardado
  const trackAutoSave = useCallback((success: boolean, data?: any) => {
    trackEvent('auto_save', { 
      success, 
      step: currentStepRef.current,
      ...data 
    });
  }, [trackEvent]);

  // Trackear acciones de usuario
  const trackUserAction = useCallback((action: string, target?: string, data?: any) => {
    trackEvent('user_action', { 
      action, 
      target, 
      step: currentStepRef.current,
      ...data 
    });
  }, [trackEvent]);

  // Trackear finalización del curso
  const trackCompletion = useCallback(() => {
    const now = Date.now();
    const totalTime = now - analytics.startTime;
    
    setAnalytics(prev => ({
      ...prev,
      isCompleted: true,
      totalTime
    }));

    trackEvent('course_completed', { 
      totalTime,
      totalSteps: Object.keys(analytics.stepMetrics).length
    });
  }, [analytics.startTime, analytics.stepMetrics, trackEvent]);

  // Calcular métricas en tiempo real
  const getMetrics = useCallback(() => {
    const now = Date.now();
    const currentSessionTime = now - analytics.startTime;
    
    // Tiempo promedio por step
    const completedSteps = Object.values(analytics.stepMetrics).filter(m => m.completions > 0);
    const avgTimePerStep = completedSteps.length > 0 
      ? completedSteps.reduce((sum, m) => sum + m.totalTime, 0) / completedSteps.length
      : 0;
    
    // Step con más errores
    const stepsWithErrors = Object.values(analytics.stepMetrics).filter(m => m.errors > 0);
    const mostProblematicStep = stepsWithErrors.length > 0
      ? stepsWithErrors.reduce((max, step) => step.errors > max.errors ? step : max)
      : null;
    
    // Tasa de abandono por step
    const abandonmentRates = Object.values(analytics.stepMetrics).map(step => ({
      step: step.stepNumber,
      name: step.stepName,
      rate: step.visits > 0 ? (step.visits - step.completions) / step.visits : 0
    }));
    
    return {
      sessionTime: currentSessionTime,
      avgTimePerStep: Math.round(avgTimePerStep),
      completedSteps: completedSteps.length,
      totalErrors: analytics.errors.length,
      mostProblematicStep,
      abandonmentRates,
      events: analytics.events.length,
      currentStep: analytics.currentStep,
      isCompleted: analytics.isCompleted
    };
  }, [analytics]);

  // Exportar datos para análisis
  const exportAnalytics = useCallback(() => {
    const metrics = getMetrics();
    
    return {
      ...analytics,
      computed: metrics,
      exportTime: Date.now(),
      version: '1.0'
    };
  }, [analytics, getMetrics]);

  // Enviar analytics al servidor (simulado)
  const sendAnalytics = useCallback(async () => {
    const data = exportAnalytics();
    
    try {
      // En producción, enviar a endpoint de analytics
      console.log('📊 Sending analytics:', data);
      
      // Simular envío
      return { success: true };
    } catch (error) {
      console.error('Error sending analytics:', error);
      return { success: false, error };
    }
  }, [exportAnalytics]);

  // Limpiar analytics
  const clearAnalytics = useCallback(() => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    setAnalytics({
      sessionId: newSessionId,
      startTime: Date.now(),
      currentStep: 1,
      stepMetrics: {},
      events: [],
      errors: [],
      totalTime: 0,
      isCompleted: false
    });
    
    stepStartTime.current = Date.now();
    currentStepRef.current = 1;
  }, []);

  // Auto-envío de analytics cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      if (analytics.events.length > 0) {
        sendAnalytics();
      }
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [analytics.events.length, sendAnalytics]);

  // Envío al salir de la página
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (analytics.events.length > 0) {
        // Usar sendBeacon para envío confiable al cerrar
        const data = exportAnalytics();
        navigator.sendBeacon('/api/admin/analytics', JSON.stringify(data));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [analytics.events.length, exportAnalytics]);

  return {
    // Estado
    analytics,
    metrics: getMetrics(),
    
    // Funciones de tracking
    trackEvent,
    trackStepChange,
    trackError,
    trackValidation,
    trackAutoSave,
    trackUserAction,
    trackCompletion,
    
    // Utilidades
    exportAnalytics,
    sendAnalytics,
    clearAnalytics
  };
}