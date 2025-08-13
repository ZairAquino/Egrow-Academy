"use client";

import React from 'react';
import VideoPlayer from '@/components/courses/VideoPlayer';
import { CheckCircle, Play, Users, Star, Award, ChevronDown, ChevronUp, Lock, Clock } from 'lucide-react';
import { renderToolIcon, renderUiIcon } from '@/lib/tool-icons';

export interface CourseTemplateLesson {
  id?: string | number;
  order: number;
  title: string;
  duration?: number; // minutos
  isFree?: boolean;
  videoUrl?: string;
}

export interface CourseTemplateModule {
  id?: string | number;
  order: number;
  title: string;
  description?: string;
  lessons: CourseTemplateLesson[];
}

export interface CourseTemplateInstructor {
  name?: string;
  title?: string;
  image?: string;
  bio?: string;
}

export interface CourseTemplateData {
  // Hero/meta
  title: string;
  description?: string;
  category?: string;
  level?: string;
  language?: string;
  introVideo?: string;
  thumbnail?: string;

  // Stats/pricing
  totalDuration?: number;
  lessonsCount?: number;
  enrollmentCount?: number;
  isFree?: boolean;
  price?: number;
  originalPrice?: number | null;
  rating?: number;

  // Content
  learningGoals?: string[];
  objectivesLead?: string;
  modules?: CourseTemplateModule[];
  prerequisites?: string[];
  tools?: string[];
  testimonials?: Array<{ name?: string; text?: string; rating?: number; studentTitle?: string }>;

  instructor?: CourseTemplateInstructor;
}

interface Props {
  course: CourseTemplateData;
  onPrimaryAction?: () => void;
}

export default function CourseTemplateV1({ course, onPrimaryAction }: Props) {
  const [expandedModules, setExpandedModules] = React.useState<number[]>([]);
  const [showStickyNavbar, setShowStickyNavbar] = React.useState(false);
  const [stickyOpacity, setStickyOpacity] = React.useState(0);
  const stickyTriggerRef = React.useRef<HTMLDivElement | null>(null);
  const reviewsRef = React.useRef<HTMLElement | null>(null);
  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => (prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]));
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes || minutes <= 0) return '0min';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const totalDuration = course.totalDuration ||
    (course.modules || []).reduce((total, m) => total + (m.lessons || []).reduce((s, l) => s + (l.duration || 0), 0), 0);

  const lessonsCount = course.lessonsCount ||
    (course.modules || []).reduce((total, m) => total + (m.lessons?.length || 0), 0);

  React.useEffect(() => {
    const handleScroll = () => {
      const trigger = stickyTriggerRef.current;
      const reviewsEl = reviewsRef.current;
      if (!trigger) return;
      const passed = trigger.getBoundingClientRect().top <= 0;

      let opacity = 0;
      if (passed && reviewsEl) {
        const top = reviewsEl.getBoundingClientRect().top;
        const fadeStart = 240;
        const fadeEnd = 40;
        if (top <= fadeEnd) opacity = 0;
        else if (top < fadeStart) opacity = Math.max(0, Math.min(1, (top - fadeEnd) / (fadeStart - fadeEnd)));
        else opacity = 1;
      } else if (passed) {
        opacity = 1;
      }
      setStickyOpacity(opacity);
      setShowStickyNavbar(passed && opacity > 0.01);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true } as any);
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div>
      {showStickyNavbar && (
        <div className="sticky-course-navbar" style={{ opacity: stickyOpacity, transition: 'opacity 180ms ease-out' }}>
          <div className="sticky-navbar-content">
            <div className="sticky-course-info">
              <div className="sticky-video-thumbnail">
                {course.thumbnail && <img src={course.thumbnail} alt={course.title} />}
                <div className="sticky-play-icon">
                  <svg width="12" height="14" viewBox="0 0 20 24" fill="none"><path d="M0 2.4C0 1.07 1.34 0.16 2.5 0.83L18.5 11.43C19.66 12.1 19.66 13.9 18.5 14.57L2.5 23.17C1.34 23.84 0 22.93 0 21.6V2.4Z" fill="currentColor"/></svg>
                </div>
              </div>
              <div className="sticky-course-title">
                <h3>{course.title}</h3>
                <div className="sticky-course-rating"><span className="stars">★★★★★</span><span>{(course.rating || 4.8).toFixed(1)}</span></div>
              </div>
            </div>
            <div className="sticky-pricing">
              <div className="price-card-sticky">
                <div className="price-option highlight">
                  <div className="price-option-header"><h3 className="price-option-title">Acceso al curso</h3><div className="price-badges"><span className="price-badge plus">e Plus</span></div></div>
                  <div className="price-display"><div className="price-radio"><input type="radio" defaultChecked /><label></label></div><div className="price-main"><span className="price-currency">$</span><span className="price-amount">12</span><span className="price-cents">.49</span><span className="price-period">USD/mes</span></div></div>
                  <button className="price-cta primary" type="button" onClick={onPrimaryAction}>Empezar con e Plus</button>
                </div>
                <div className="price-option regular">
                  <div className="price-option-header"><h3 className="price-option-title">Acceso individual</h3></div>
                  <div className="price-display"><div className="price-radio"><input type="radio" /><label></label></div><div className="price-main"><span className="price-currency">$</span><span className="price-amount">{Math.trunc(course.price || 0)}</span><span className="price-cents">.{String(Math.round((((course.price || 0) % 1) * 100))).padStart(2,'0')}</span><span className="price-period">USD</span></div></div>
                  <button className="price-cta" type="button" onClick={onPrimaryAction}>Comprar este curso</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Hero replicado (estructura y clases de la referencia) */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-card">
            <div className="hero-grid">
              <div className="hero-left">
                <h1 className="hero-title-big">{course.title}</h1>
                {(() => {
                  const shortDesc = (course as any).shortDescription as string | undefined;
                  const desc = course.description as string | undefined;
                  const text = shortDesc && desc && shortDesc.trim() === desc.trim() ? shortDesc : (shortDesc || desc);
                  return text ? (<p className="hero-subtext">{text}</p>) : null;
                })()}
                <button className="hero-cta" onClick={onPrimaryAction}>
                  {course.isFree ? 'Acceder Gratis' : 'Iniciar Sesión para Comenzar'}
                </button>
              </div>
              <div className="hero-right">
                <div className="preview-box">
                  {course.introVideo ? (
                    <VideoPlayer videoUrl={course.introVideo} title={course.title} />
                  ) : course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="preview-video" />
                  ) : (
                    <div className="preview-video" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Play className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="hero-stats">
                  <div className="stars" aria-label="Calificación">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                  <span className="rating">{(course.rating || 4.8).toFixed(1)} <span className="muted">({(course as any).valoraciones || 0} valoraciones)</span></span>
                  <span className="dot" />
                  <span className="students"><Users className="inline-block w-4 h-4" /> {course.enrollmentCount || (course as any).studentsCount || 0} estudiantes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido principal replicado */}
      <section className="course-content">
        <div className="container">
          <div className="content-layout">
            {/* Main */}
            <div className="main-content-area desktop-content">
              {/* Descripción */}
              <div className="course-overview-card">
                <h2 className="desc-title">Descripción del Curso</h2>
                {(() => {
                  const shortDesc = (course as any).shortDescription as string | undefined;
                  const desc = course.description as string | undefined;
                  const text = shortDesc && desc && shortDesc.trim() === desc.trim() ? shortDesc : (shortDesc || desc);
                  return text ? (<p className="desc-lead">{text}</p>) : null;
                })()}
                <div className="desc-separator" />
                <div className="desc-body">
                  {(() => {
                    const shortDesc = (course as any).shortDescription as string | undefined;
                    const desc = course.description as string | undefined;
                    if (shortDesc && desc && shortDesc.trim() === desc.trim()) return null;
                    return desc ? (<p className="desc-paragraph">{desc}</p>) : null;
                  })()}
                </div>
              </div>

              {/* Trigger para sticky navbar */}
              <div ref={stickyTriggerRef} aria-hidden style={{ height: 1 }} />

              {/* Objetivos */}
              <div className="learning-objectives">
                <div className="objectives-header">
                  <span className="section-badge">Objetivos</span>
                  <h2 className="objectives-title">Lo que vas a conseguir con este curso</h2>
                  {course.objectivesLead && <p className="section-lead">{course.objectivesLead}</p>}
                </div>
                <div className="objectives-grid refined">
                  {(course.learningGoals || []).map((objective, index) => (
                    <div key={index} className="objective-card">
                      <div className="objective-index">{index + 1}</div>
                      <p className="objective-text">{objective}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Herramientas */}
              <div className="tools-section">
                <h2>Herramientas y Tecnologías</h2>
                <div className="tools-grid">
                  {(course.tools || []).map((tool, index) => (
                    <div key={index} className="tool-item">
                      <span className="tool-icon" aria-hidden>{renderToolIcon(tool)}</span>
                      <span className="tool-name">{tool}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contenido del Curso */}
              <div className="curriculum-section">
                <h2>Contenido del Curso</h2>
                <div className="curriculum-stats">
                  <div className="stat-item"><span className="stat-number">{lessonsCount}</span><span className="stat-label">Lecciones</span></div>
                  <div className="stat-item"><span className="stat-number">{totalDuration}</span><span className="stat-label">Minutos</span></div>
                </div>
                <div className="lessons-list">
                  <div className="lessons-grid timeline">
                    {(course.modules || []).map((module, idx) => (
                      <div key={module.id || idx} className="lesson-card">
                        <div className="lesson-header">
                          <div className="lesson-number">{idx + 1}</div>
                          <div className="lesson-status">○</div>
                        </div>
                        <div className="lesson-content">
                          <h4 className="lesson-title">{module.title}</h4>
                          {module.description && <p className="lesson-description">{module.description}</p>}
                          <div className="lesson-meta">
                            <span className="lesson-type">Módulo</span>
                            <span className="lesson-duration">{module.lessons?.reduce((s,l)=>s+(l.duration||0),0) || 0}min</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Instructor */}
              {course.instructor && (
                <div className="instructor-section presentation">
                  <h2 className="section-title">Tu Instructor</h2>
                  <div className="instructor-header">
                    {course.instructor.image ? (
                      <img src={course.instructor.image} alt={course.instructor.name} className="instructor-photo" />
                    ) : (
                      <div className="instructor-photo" />
                    )}
                    <div className="header-main">
                      <div className="name-row">
                        <h3 className="instructor-name">{course.instructor.name}</h3>
                      </div>
                      <div className="instructor-role">{course.instructor.title}</div>
                    </div>
                  </div>
                  {course.instructor.bio && (
                    <div className="instructor-description"><p>{course.instructor.bio}</p></div>
                  )}
                </div>
              )}

              {/* Prerrequisitos */}
              <div className="prerequisites-section">
                <h2>Prerrequisitos</h2>
                <ul className="prerequisites-list">
                  {(course.prerequisites || []).map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>

              {/* Opiniones */}
              <div className="reviews-section-main" ref={reviewsRef as any}>
                <h2 className="reviews-title">Opiniones</h2>
                <p className="reviews-subtitle">Lo que dicen nuestros estudiantes</p>
                <div className="reviews-stats-card">
                  <div className="stat"><span className="stat-value">{course.enrollmentCount || (course as any).studentsCount || 0}</span><span className="stat-label">Estudiantes</span></div>
                  <div className="stat"><span className="stat-value">{(course.testimonials || []).length}</span><span className="stat-label">Opiniones</span></div>
                  <div className="stat"><span className="stat-value stat-good">{Math.min(100, Math.round(((course.rating || 5) / 5) * 100))}%</span><span className="stat-label">Valoraciones positivas</span></div>
                </div>
                <div className="reviews-carousel">
                  <div className="review-grid2">
                    {(course.testimonials || []).slice(0,2).map((t: any, i: number) => {
                      const name = t.name || t.studentName || 'Estudiante';
                      const text = t.text || t.content || '';
                      return (
                        <div key={i} className="testimonial-card"><div className="testimonial-body"><p className="testimonial-text">{text}</p><div className="testimonial-author">- {name}</div></div></div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar replicado */}
            <div className="content-sidebar">
              <div className="price-card-scrollable">
                <div className="price-card">
                  <div className="price-option highlight">
                    <div className="price-option-header">
                      <h3 className="price-option-title">Acceso al curso</h3>
                      <div className="price-badges"><span className="price-badge plus">e Plus</span></div>
                    </div>
                    <div className="price-display">
                      <div className="price-radio"><input type="radio" defaultChecked /><label></label></div>
                      <div className="price-main"><span className="price-currency">$</span><span className="price-amount">12</span><span className="price-cents">.49</span><span className="price-period">USD/mes</span></div>
                    </div>
                    <div className="price-discount"><span className="discount-text">Accede a todos los cursos de eGrow Academy mientras mantengas tu suscripción.</span></div>
                    <button className="price-cta primary" type="button" onClick={onPrimaryAction}>Empezar con e Plus</button>
                    <div className="price-benefits">
                      <div className="benefit-item"><span className="benefit-icon">✓</span><span className="benefit-text">Acceso ilimitado a todos los cursos de la plataforma</span></div>
                      <div className="benefit-item"><span className="benefit-icon">✓</span><span className="benefit-text">Actualizaciones continuas y nuevo contenido</span></div>
                    </div>
                  </div>

                  <div className="price-option regular">
                      <div className="price-option-header"><h3 className="price-option-title">Acceso individual</h3></div>
                      <div className="price-display">
                        <div className="price-radio"><input type="radio" /><label></label></div>
                        <div className="price-main">
                          <span className="price-currency">$</span>
                          <span className="price-amount">{Math.trunc(course.price || 0)}</span>
                          <span className="price-cents">.{String(Math.round((((course.price || 0) % 1) * 100))).padStart(2,'0')}</span>
                          <span className="price-period">USD</span>
                        </div>
                      </div>
                      <div className="price-description"><span className="description-text">Pago único para este curso. Acceso permanente al contenido del curso.</span></div>
                      <button className="price-cta" type="button" onClick={onPrimaryAction}>Comprar este curso</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cursos que también te pueden interesar */}
      <section className="featured-courses-section">
        <div className="container">
          <div className="featured-courses-header">
            <h2>Cursos que también te pueden interesar</h2>
            <p>Expande tus conocimientos con estos cursos populares</p>
          </div>
          <div className="courses-grid">
            <a className="course-card" href="/curso/videos-profesionales-ia">
              <div className="course-image-wrapper">
                <img src="/images/15.png" alt="Videos Profesionales con IA" className="course-image" />
                <span className="course-badge eplus">e Plus</span>
              </div>
              <div className="course-content">
                <h3 className="course-title">Videos Profesionales con IA</h3>
                <p className="course-description">Crea videos de alta calidad usando herramientas de inteligencia artificial</p>
                <div className="course-meta">
                  <span className="course-duration" style={{ display:'inline-flex', alignItems:'center', gap:'0.375rem' }}>
                    <span className="icon" style={{ display:'inline-flex' }}>{renderUiIcon('duracion')}</span>
                    <span>6 horas</span>
                  </span>
                  <span className="course-level" style={{ display:'inline-flex', alignItems:'center', gap:'0.375rem' }}>
                    <span className="icon" style={{ display:'inline-flex' }}>{renderUiIcon('nivel')}</span>
                    <span>Intermedio</span>
                  </span>
                </div>
                <button className="course-btn" type="button">Ver Curso</button>
              </div>
            </a>
            <a className="course-card" href="/curso/vibe-coding-claude-cursor">
              <div className="course-image-wrapper">
                <img src="/images/16.png" alt="Vibe Coding con Claude & Cursor" className="course-image" />
                <span className="course-badge eplus">e Plus</span>
              </div>
              <div className="course-content">
                <h3 className="course-title">Vibe Coding con Claude & Cursor</h3>
                <p className="course-description">Aprende a programar con IA usando Claude y Cursor de manera eficiente</p>
                <div className="course-meta">
                  <span className="course-duration" style={{ display:'inline-flex', alignItems:'center', gap:'0.375rem' }}>
                    <span className="icon" style={{ display:'inline-flex' }}>{renderUiIcon('duracion')}</span>
                    <span>5 horas</span>
                  </span>
                  <span className="course-level" style={{ display:'inline-flex', alignItems:'center', gap:'0.375rem' }}>
                    <span className="icon" style={{ display:'inline-flex' }}>{renderUiIcon('nivel')}</span>
                    <span>Intermedio</span>
                  </span>
                </div>
                <button className="course-btn" type="button">Ver Curso</button>
              </div>
            </a>
            <a className="course-card" href="/curso/vibe-coding-claude-cursor">
              <div className="course-image-wrapper">
                <img src="/images/17.png" alt="Vibe Coding con Claude Code" className="course-image" />
                <span className="course-badge eplus">e Plus</span>
              </div>
              <div className="course-content">
                <h3 className="course-title">Vibe Coding con Claude Code</h3>
                <p className="course-description">Aprende a programar de forma eficiente utilizando Claude Code y herramientas de IA</p>
                <div className="course-meta">
                  <span className="course-duration" style={{ display:'inline-flex', alignItems:'center', gap:'0.375rem' }}>
                    <span className="icon" style={{ display:'inline-flex' }}>{renderUiIcon('duracion')}</span>
                    <span>5 horas</span>
                  </span>
                  <span className="course-level" style={{ display:'inline-flex', alignItems:'center', gap:'0.375rem' }}>
                    <span className="icon" style={{ display:'inline-flex' }}>{renderUiIcon('nivel')}</span>
                    <span>Intermedio</span>
                  </span>
                </div>
                <button className="course-btn" type="button">Ver Curso</button>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="container">
          <h2 className="faq-title">Preguntas frecuentes</h2>
          <div className="faq-list">
            <details className="faq-item"><summary className="faq-question">¿Qué incluye la Suscripción Premium de eGrow Academy?</summary><div className="faq-answer">Acceso a todos los cursos actuales y futuros mientras mantengas tu suscripción, actualizaciones permanentes, plantillas descargables, soporte prioritario por email y certificado digital al completar los cursos compatibles.</div></details>
            <details className="faq-item"><summary className="faq-question">¿Cuándo empiezan y cuándo acaban los cursos?</summary><div className="faq-answer">Comienzan cuando tú quieras. Son 100% a tu ritmo, con acceso bajo demanda desde cualquier dispositivo. Puedes pausar y retomar sin perder tu progreso.</div></details>
            <details className="faq-item"><summary className="faq-question">¿Obtengo certificado digital?</summary><div className="faq-answer">Sí. Al completar el contenido marcado como obligatorio en cada curso podrás descargar un certificado digital con tu nombre desde tu perfil.</div></details>
            <details className="faq-item"><summary className="faq-question">¿Necesito experiencia previa o equipo especial?</summary><div className="faq-answer">No. Los cursos están pensados para principiantes. Solo requieres una computadora con internet. Recomendamos auriculares y micrófono básico para mejores resultados.</div></details>
            <details className="faq-item"><summary className="faq-question">¿Puedo usar comercialmente las voces generadas con ElevenLabs?</summary><div className="faq-answer">Sí, siempre que cuentes con la licencia adecuada y permisos de uso de voz cuando corresponda. En el curso incluimos una guía práctica de buenas prácticas y ética.</div></details>
            <details className="faq-item"><summary className="faq-question">¿Cómo obtengo soporte si me trabo?</summary><div className="faq-answer">Desde tu cuenta puedes abrir un ticket de soporte o escribirnos a soporte@egrow-academy.com. También encontrarás guías rápidas y preguntas frecuentes dentro de cada módulo.</div></details>
          </div>
        </div>
      </section>

      {/* Pricing planes */}
      <section className="pricing-section">
        <div className="container">
          <div className="pricing-header"><h2 className="pricing-title">Elige tu Plan de Suscripción</h2><p className="pricing-subtitle">Desbloquea todo el potencial de eGrow Academy con acceso ilimitado a nuestros cursos especializados</p></div>
          <div className="pricing-grid">
            <div className="pricing-card"><div className="pricing-card-content"><div className="pricing-header-card"><h3 className="pricing-plan-name">Plan Gratuito</h3><div className="pricing-plan-price">$0<span className="pricing-interval">/mes</span></div></div><ul className="pricing-features"><li className="pricing-feature"><span className="pricing-feature-icon">✓</span><span className="pricing-feature-text">Acceso a cursos públicos gratuitos</span></li><li className="pricing-feature"><span className="pricing-feature-icon">✓</span><span className="pricing-feature-text">Sistema básico de rachas</span></li><li className="pricing-feature"><span className="pricing-feature-icon">✓</span><span className="pricing-feature-text">Comunidad básica</span></li><li className="pricing-feature"><span className="pricing-feature-icon">✓</span><span className="pricing-feature-text">Soporte por email estándar</span></li><li className="pricing-feature not-included"><span className="pricing-feature-icon not-included-icon">✕</span><span className="pricing-feature-text not-included-text">Acceso a cursos especializados premium</span></li><li className="pricing-feature not-included"><span className="pricing-feature-icon not-included-icon">✕</span><span className="pricing-feature-text not-included-text">Certificados de finalización</span></li><li className="pricing-feature not-included"><span className="pricing-feature-icon not-included-icon">✕</span><span className="pricing-feature-text not-included-text">Badge visible en navbar</span></li><li className="pricing-feature not-included"><span className="pricing-feature-icon not-included-icon">✕</span><span className="pricing-feature-text not-included-text">Personalización de badges y rachas</span></li></ul><button className="pricing-button secondary">Registrarse Gratis</button></div></div>
            <div className="pricing-card popular"><div className="pricing-popular-badge"><span style={{ display:'inline-flex', alignItems:'center', gap:'0.25rem' }}><span style={{ width:18, height:18, display:'inline-block' }} /><span>Más Popular</span></span></div><div className="pricing-card-content"><div className="pricing-header-card"><h3 className="pricing-plan-name">Plan Mensual</h3><div className="pricing-plan-price">$12.49<span className="pricing-interval">/mes</span></div></div><ul className="pricing-features"><li className="pricing-feature"><span className="pricing-feature-icon">✓</span><span className="pricing-feature-text">Acceso a todos los cursos especializados</span></li><li className="pricing-feature"><span className="pricing-feature-icon">✓</span><span className="pricing-feature-text">Contenido actualizado mensualmente</span></li><li className="pricing-feature"><span className="pricing-feature-icon">✓</span><span className="pricing-feature-text">Certificados de finalización</span></li><li className="pricing-feature"><span className="pricing-feature-icon">✓</span><span className="pricing-feature-text">Sistema completo de rachas</span></li><li className="pricing-feature"><span className="pricing-feature-icon">✓</span><span className="pricing-feature-text">Badge visible en navbar</span></li><li className="pricing-feature"><span className="pricing-feature-icon">✓</span><span className="pricing-feature-text">Personalización de badges y rachas</span></li><li className="pricing-feature"><span className="pricing-feature-icon">✓</span><span className="pricing-feature-text">Soporte técnico prioritario</span></li><li className="pricing-feature"><span className="pricing-feature-icon">✓</span><span className="pricing-feature-text">Acceso a la comunidad exclusiva</span></li></ul><button className="pricing-button primary">Suscribirse por $12.49</button></div></div>
            <div className="pricing-card popular yearly-popular"><div className="pricing-popular-badge yearly-badge"><span style={{ display:'inline-flex', alignItems:'center', gap:'0.25rem' }}><span style={{ width:18, height:18, display:'inline-block' }} /><span>Ahorra Más</span></span></div><div className="pricing-card-content"><div className="pricing-header-card"><h3 className="pricing-plan-name">Plan Anual</h3><div className="pricing-plan-price">$149.99<span className="pricing-interval">/año</span></div><p className="pricing-monthly-price">$12.50/mes facturado anualmente</p></div><ul className="pricing-features"><li className="pricing-feature"><span className="pricing-feature-icon">✓</span><span className="pricing-feature-text">Todo lo del plan mensual</span></li><li className="pricing-feature"><span className="pricing-feature-icon">✓</span><span className="pricing-feature-text">2 meses gratis</span></li><li className="pricing-feature"><span className="pricing-feature-icon">✓</span><span className="pricing-feature-text">Personalización completa de badges y rachas</span></li><li className="pricing-feature"><span className="pricing-feature-icon">✓</span><span className="pricing-feature-text">Badge visible en barra de navegación</span></li><li className="pricing-feature"><span className="pricing-feature-icon">✓</span><span className="pricing-feature-text">Acceso anticipado a nuevos cursos</span></li><li className="pricing-feature"><span className="pricing-feature-icon">✓</span><span className="pricing-feature-text">Mentorías grupales mensuales</span></li><li className="pricing-feature"><span className="pricing-feature-icon">✓</span><span className="pricing-feature-text">Recursos premium adicionales</span></li><li className="pricing-feature"><span className="pricing-feature-icon">✓</span><span className="pricing-feature-text">Garantía de satisfacción de 30 días</span></li></ul><button className="pricing-button primary">Suscribirse por $149.99</button></div></div>
          </div>
        </div>
      </section>
    </div>
  );
}



