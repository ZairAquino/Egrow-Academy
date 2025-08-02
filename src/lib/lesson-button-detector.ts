/**
 * Detector directo de botones de lecciones completadas
 * Intercepta clicks en botones específicos para disparar actualizaciones de rachas
 */

let isButtonDetectorInitialized = false;

export function initializeLessonButtonDetector() {
  if (isButtonDetectorInitialized || typeof window === 'undefined') return;
  
  console.log('🔘 Inicializando detector de botones de lecciones...');
  
  // Función para disparar actualización de rachas
  const triggerStreakUpdate = () => {
    console.log('🏆 [BUTTON-DETECTOR] Botón de lección completada clickeado!');
    
    // Esperar un poco para que se complete la llamada a la API
    setTimeout(() => {
      // Método 1: localStorage trigger
      localStorage.setItem('lessonCompleted', Date.now().toString());
      
      // Método 2: Evento personalizado
      window.dispatchEvent(new CustomEvent('lessonCompleted', {
        detail: { 
          timestamp: Date.now(), 
          source: 'button-click',
          type: 'lesson-completed'
        }
      }));
      
      // Método 3: Función global si existe
      if ((window as any).notifyLessonCompleted) {
        (window as any).notifyLessonCompleted();
      }
      
      // Método 4: Evento de storage manual
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'lessonCompleted',
        newValue: Date.now().toString(),
        storageArea: localStorage
      }));
      
      console.log('✅ [BUTTON-DETECTOR] Actualización de rachas disparada');
    }, 1500); // Esperar 1.5 segundos para asegurar que la API se completó
  };
  
  // Método 1: Observer de mutaciones para detectar nuevos botones
  const observeButtons = () => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              
              // Buscar botones de completar lección en el nuevo elemento
              const completeButtons = element.querySelectorAll('button');
              completeButtons.forEach(button => {
                const buttonText = button.textContent?.toLowerCase() || '';
                if (buttonText.includes('marcar como completada') || 
                    buttonText.includes('completar lección') ||
                    buttonText.includes('✅')) {
                  attachButtonListener(button);
                }
              });
            }
          });
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    return observer;
  };
  
  // Método 2: Event delegation en document
  const setupEventDelegation = () => {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      
      if (target.tagName === 'BUTTON') {
        const buttonText = target.textContent?.toLowerCase() || '';
        const buttonClasses = target.className.toLowerCase();
        
        // Detectar botones de completar lección por texto o clases
        if (buttonText.includes('marcar como completada') ||
            buttonText.includes('completar lección') ||
            buttonText.includes('✅') ||
            buttonClasses.includes('complete-lesson') ||
            buttonClasses.includes('mark-complete')) {
          
          console.log('🎯 [BUTTON-DETECTOR] Botón de completar detectado:', buttonText);
          triggerStreakUpdate();
        }
      }
    }, true); // Usar capture phase para interceptar antes
  };
  
  // Método 3: Interceptar clicks específicos por selector
  const interceptSpecificButtons = () => {
    // Buscar botones existentes cada 2 segundos
    setInterval(() => {
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
        const buttonText = button.textContent?.toLowerCase() || '';
        if ((buttonText.includes('marcar como completada') || 
             buttonText.includes('✅')) &&
            !button.hasAttribute('data-streak-listener')) {
          attachButtonListener(button);
        }
      });
    }, 2000);
  };
  
  // Función para agregar listener a un botón específico
  const attachButtonListener = (button: Element) => {
    if (button.hasAttribute('data-streak-listener')) return;
    
    button.setAttribute('data-streak-listener', 'true');
    button.addEventListener('click', () => {
      console.log('🎯 [BUTTON-LISTENER] Click directo en botón de completar');
      triggerStreakUpdate();
    });
    
    console.log('🔗 Listener agregado a botón de completar lección');
  };
  
  // Inicializar todos los métodos
  try {
    setupEventDelegation();
    observeButtons();
    interceptSpecificButtons();
    
    // Buscar botones existentes inmediatamente
    setTimeout(() => {
      const existingButtons = document.querySelectorAll('button');
      existingButtons.forEach(button => {
        const buttonText = button.textContent?.toLowerCase() || '';
        if (buttonText.includes('marcar como completada') || buttonText.includes('✅')) {
          attachButtonListener(button);
        }
      });
    }, 1000);
    
    isButtonDetectorInitialized = true;
    console.log('✅ Detector de botones de lecciones inicializado completamente');
    
  } catch (error) {
    console.error('❌ Error inicializando detector de botones:', error);
  }
}

// Función para testing manual
export function testButtonDetector() {
  console.log('🧪 Probando detector de botones...');
  
  // Simular click de botón
  setTimeout(() => {
    localStorage.setItem('lessonCompleted', Date.now().toString());
    window.dispatchEvent(new CustomEvent('lessonCompleted', {
      detail: { timestamp: Date.now(), source: 'manual-test' }
    }));
    console.log('✅ Test de detector de botones completado');
  }, 500);
}

// Hacer función de test disponible globalmente
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).testButtonDetector = testButtonDetector;
}