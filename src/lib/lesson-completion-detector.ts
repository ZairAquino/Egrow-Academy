/**
 * Sistema de detección de lecciones completadas
 * Intercepta las llamadas a la API y detecta cuando se completan lecciones
 */

let isInitialized = false;

export function initializeLessonCompletionDetector() {
  if (isInitialized || typeof window === 'undefined') return;
  
  console.log('🔍 Inicializando detector de lecciones completadas...');
  
  // Interceptar fetch globalmente
  const originalFetch = window.fetch;
  
  window.fetch = async function(...args: Parameters<typeof fetch>): Promise<Response> {
    const result = await originalFetch.apply(this, args);
    
    // Verificar si es una llamada a la API de progreso
    const url = args[0] as string;
    if (typeof url === 'string' && url.includes('/api/courses/progress')) {
      const method = args[1]?.method;
      
      if (method === 'POST') {
        try {
          // Clonar la respuesta para poder leerla sin afectar el stream original
          const clonedResponse = result.clone();
          const responseData = await clonedResponse.json();
          
          // Si se completó una lección
          if (responseData.lessonCompleted === true) {
            console.log('🏆 [DETECTOR] Lección completada detectada!');
            
            // Disparar evento personalizado
            setTimeout(() => {
              // Usar múltiples métodos para asegurar que la actualización suceda
              
              // 1. localStorage trigger
              localStorage.setItem('lessonCompleted', Date.now().toString());
              
              // 2. Evento personalizado
              window.dispatchEvent(new CustomEvent('lessonCompleted', {
                detail: { timestamp: Date.now() }
              }));
              
              // 3. Función global si existe
              if ((window as any).notifyLessonCompleted) {
                (window as any).notifyLessonCompleted();
              }
              
              // 4. Disparar evento de storage manualmente para el mismo window
              window.dispatchEvent(new StorageEvent('storage', {
                key: 'lessonCompleted',
                newValue: Date.now().toString(),
                storageArea: localStorage
              }));
              
            }, 500);
          }
        } catch (error) {
          console.error('Error al procesar respuesta de lección:', error);
        }
      }
    }
    
    return result;
  };
  
  isInitialized = true;
  console.log('✅ Detector de lecciones completadas inicializado');
}

// Función para trigger manual (para testing)
export function triggerLessonCompleted() {
  console.log('🧪 [TEST] Disparando lección completada manualmente...');
  
  localStorage.setItem('lessonCompleted', Date.now().toString());
  
  window.dispatchEvent(new CustomEvent('lessonCompleted', {
    detail: { timestamp: Date.now(), manual: true }
  }));
  
  if ((window as any).notifyLessonCompleted) {
    (window as any).notifyLessonCompleted();
  }
}

// Hacer la función de test disponible globalmente en desarrollo
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).triggerLessonCompleted = triggerLessonCompleted;
}