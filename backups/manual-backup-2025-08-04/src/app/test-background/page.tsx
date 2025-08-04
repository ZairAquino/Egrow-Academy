'use client';

import { useState, useEffect } from 'react';

export default function TestBackgroundPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      <h1 style={{ padding: '20px', background: '#f0f0f0' }}>
        Test - Video Background Final
      </h1>
      
      <section className="hero">
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
          </video>
        )}
        
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div className="hero-content">
            <h1 className="hero-title">
              Video Background Final
              <span className="block">Implementado en el Hero</span>
            </h1>
            <p className="hero-description">
              El video ahora está implementado directamente en el componente Hero.
              Cubre completamente las dimensiones del hero con las propiedades originales.
            </p>
            
            <div style={{ 
              marginTop: '20px', 
              padding: '10px', 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              <p><strong>Configuración Final:</strong></p>
                             <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
                 <li>Archivo: background.webm (8.6MB)</li>
                 <li>Formato: WebM (compatible moderno)</li>
                 <li>Posición: absolute, object-fit: cover</li>
                 <li>Z-index: -0.5 (solo overlay semitransparente)</li>
                 <li>Gradiente removido para mostrar solo el video</li>
                 <li>Contenido al frente (z-index: 10)</li>
                 <li>Renderizado: Solo en cliente (sin hidratación)</li>
               </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Test directo del video */}
      <div style={{ padding: '20px', background: '#f0f0f0', marginTop: '20px' }}>
        <h3>Test Directo del Video:</h3>
        {isClient && (
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            style={{ width: '100%', maxWidth: '400px', height: '200px', objectFit: 'cover' }}
          >
            <source src="/videos/background.webm" type="video/webm" />
            Tu navegador no soporta el elemento video.
          </video>
        )}
        <p>Si ves el video arriba, el archivo funciona. Si no, hay un problema con el archivo.</p>
      </div>
    </div>
  );
} 