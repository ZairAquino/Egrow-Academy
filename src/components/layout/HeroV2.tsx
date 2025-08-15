'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import SubscriptionButton from '@/components/payments/SubscriptionButton';
import DynamicLogo from '@/components/ui/DynamicLogo';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './HeroV2.module.css';

export default function HeroV2() {
  const { user } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [containerPadding, setContainerPadding] = useState('0 1rem');
  const [logoPosition, setLogoPosition] = useState('48%');
  
  // Función helper para obtener el transform de manera segura
  const getLogoTransform = () => {
    if (!isClient) return 'translateY(-50%)';
    return window.innerWidth > 768 ? 'translate(-50%, -50%)' : 'translateY(-50%)';
  };

  useEffect(() => {
    setIsClient(true);
    console.log('🚀 HeroV2 se está renderizando!');
    console.log('🔧 Variable de entorno HERO_V2:', process.env.NEXT_PUBLIC_HERO_V2);
    
    // Función para actualizar el padding del container según el tamaño de pantalla
    const updateContainerPadding = () => {
      if (window.innerWidth >= 1024) {
        setContainerPadding('0 2rem');
      } else if (window.innerWidth >= 640) {
        setContainerPadding('0 1.5rem');
      } else if (window.innerWidth >= 768) {
        setContainerPadding('0 1rem');
      } else {
        // En móviles (≤ 768px) sin padding para eliminar espacio entre banner y hero
        setContainerPadding('0');
      }
    };

    // Función para actualizar la posición del logo según el tamaño de pantalla
    const updateLogoPosition = () => {
      if (window.innerWidth <= 375) {
        setLogoPosition('30px');
      } else if (window.innerWidth <= 480) {
        setLogoPosition('40px');
      } else if (window.innerWidth <= 640) {
        setLogoPosition('50px');
      } else if (window.innerWidth <= 768) {
        setLogoPosition('60px');
      } else {
        // En desktop (>= 769px) mantener el logo centrado
        setLogoPosition('48%');
      }
    };

    // Actualizar al montar
    updateContainerPadding();
    updateLogoPosition();
    
    // Actualizar al cambiar el tamaño de la ventana
    window.addEventListener('resize', updateContainerPadding);
    window.addEventListener('resize', updateLogoPosition);
    
    return () => {
      window.removeEventListener('resize', updateContainerPadding);
      window.removeEventListener('resize', updateLogoPosition);
    };
  }, []);

  return (
    <section className={styles.heroV2}>
      {/* Imagen de fondo igual que en courses */}
      {isClient && (
        <img
          src="/images/background.png"
          alt="Header background"
          className={styles.heroV2Background}
          style={{
            width: '100%',
            height: '100%',
            minWidth: '320px',
            minHeight: '140px',
            maxWidth: '1200px',
            maxHeight: '550px',
            aspectRatio: '175/87',
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: -1
          }}
        />
      )}
      
      <div className={styles.heroV2Container}>
        <div 
          className="container" 
          style={{ 
            position: 'relative', 
            zIndex: 10,
            width: '100%',
            maxWidth: '1280px',
            margin: '0 auto',
            padding: containerPadding
          }}
        >
          <div className={styles.heroV2Grid}>
            {/* Columna izquierda - Texto y CTA */}
            <motion.div 
              className={styles.heroV2Left}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className={styles.heroV2ContentCard}>
                <h1 className={styles.heroV2Title}>
                  Domina la inteligencia artificial desde cero
                </h1>
                <p className={styles.heroV2Subtitle}>
                  Desarrolla habilidades irremplazables y consigue mejores oportunidades profesionales
                </p>
                <div className={styles.heroV2CTA}>
                                     {isClient && !user ? (
                     <div className="flex justify-center w-full">
                       <Link 
                         href="/login" 
                         className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                       >
                         Inicia Sesión para comenzar
                       </Link>
                     </div>
                   ) : isClient && user ? (
                     <div className="flex justify-center w-full">
                       <Link 
                         href="/my-courses" 
                         className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                       >
                         Mis cursos
                       </Link>
                     </div>
                  ) : (
                    <div className="flex justify-center w-full">
                      <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium text-sm rounded-md">
                        Cargando...
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Columna derecha - Imagen principal */}
            <motion.div
              className={styles.heroV2Right}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              {/* Imagen principal v-16.png */}
              <div className={styles.heroV2MainImage}>
                <motion.img
                  src="/images/v-16.png"
                  alt="Inteligencia Artificial - eGrow Academy"
                  className={styles.heroV2Image}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                />
              </div>
            </motion.div>
          </div>

          {/* Logo eGrow centrado igual que en courses */}
          <motion.div 
            className={styles.heroV2LogoCenter}
            style={{
              position: 'absolute',
              top: '50%',
              left: logoPosition,
              transform: getLogoTransform(),
              zIndex: 5
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            <div className={styles.logoAnimationWrapper}>
              <DynamicLogo 
                width={95}
                height={95}
                priority={true}
                className={styles.heroV2LogoImage}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
