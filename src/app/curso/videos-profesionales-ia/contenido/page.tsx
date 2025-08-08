"use client";

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LessonActionButtons from '@/components/courses/LessonActionButtons';
import CourseSidebar from '@/components/courses/CourseSidebar';
import CompleteCourseSection from '@/components/courses/CompleteCourseSection';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import { useState } from 'react';

export default function ContenidoVideosProfesionalesIAPage() {
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());
  const { progress, markLessonComplete, setCurrentLesson } = useCourseProgress('videos-profesionales-ia', true);

  const courseData = {
    id: 'videos-profesionales-ia',
    title: 'Aprende a crear videos profesionales con IA',
    lessons: [
      { id: 'vpc-mod1-les1', moduleId: 1, title: '1.1 Introducción', duration: '15 min', type: 'video' },
      { id: 'vpc-mod1-les2', moduleId: 1, title: '1.2 Herramientas', duration: '12 min', type: 'video' },
      { id: 'vpc-mod1-les3', moduleId: 1, title: '1.3 Configuración', duration: '15 min', type: 'video' },
      { id: 'vpc-mod2-les1', moduleId: 2, title: '2.1 Guiones con IA', duration: '8 min', type: 'video' },
    ],
  };

  const isLessonCompleted = (lessonId: string) => progress.completedLessons.includes(lessonId);
  const getModuleProgress = (moduleId: number) => {
    const moduleLessons = courseData.lessons.filter((l) => l.moduleId === moduleId);
    const completed = moduleLessons.filter((l) => isLessonCompleted(l.id)).length;
    const total = moduleLessons.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  };
  const isModuleCompleted = (moduleId: number) => getModuleProgress(moduleId).completed === getModuleProgress(moduleId).total;
  const LAST_LESSONS_BY_MODULE: Record<number, string> = { 1: 'vpc-mod1-les3', 2: 'vpc-mod2-les1', 3: '', 4: '', 5: '' };
  const isLastLessonOfModule = (lessonId: string, moduleId: number) => LAST_LESSONS_BY_MODULE[moduleId] === lessonId;
  const canCompleteModuleWithPrerequisites = (moduleId: number) => getModuleProgress(moduleId).completed === getModuleProgress(moduleId).total;
  const getModuleTitle = (moduleId: number) => `MÓDULO ${moduleId}: Placeholder`;
  const isLessonAccessible = (globalIndex: number) => true;
  const handleCompleteCurrentLesson = async () => {
    const currentLesson = courseData.lessons[progress.currentLesson];
    await markLessonComplete(currentLesson.id);
  };
  const handleCompleteModule = async (moduleId: number) => {
    const lessons = courseData.lessons.filter((l) => l.moduleId === moduleId);
    for (const lesson of lessons) {
      if (!isLessonCompleted(lesson.id)) {
        await markLessonComplete(lesson.id);
      }
    }
  };
  const areAllLessonsCompleted = courseData.lessons.every((l) => isLessonCompleted(l.id));
  const isCourseCompleted = areAllLessonsCompleted;
  const handleCompleteCourse = async () => {
    for (const lesson of courseData.lessons) {
      if (!isLessonCompleted(lesson.id)) {
        await markLessonComplete(lesson.id);
      }
    }
  };
  const toggleModuleExpansion = (moduleId: number) => {
    const next = new Set(expandedModules);
    if (next.has(moduleId)) next.delete(moduleId);
    else next.add(moduleId);
    setExpandedModules(next);
  };

  return (
    <>
      <Navbar />
      <main className="main-content">
        {/* Header con breadcrumb y título */}
        <section className="course-header pt-14 md:pt-[95px]">
          <div className="container">
            <div className="course-header-content">
              <div className="course-breadcrumb">
                <div className="breadcrumb-container">
                  <a href="/" className="breadcrumb-item">
                    <span className="breadcrumb-icon">🏠</span>
                    <span className="breadcrumb-text">Inicio</span>
                  </a>
                  <span className="breadcrumb-separator">/</span>
                  <a href="/cursos-gratuitos" className="breadcrumb-item">
                    <span className="breadcrumb-icon">📚</span>
                    <span className="breadcrumb-text">Cursos Gratuitos</span>
                  </a>
                  <span className="breadcrumb-separator">/</span>
                  <a href="/curso/videos-profesionales-ia" className="breadcrumb-item">
                    <span className="breadcrumb-icon">🎬</span>
                    <span className="breadcrumb-text">Videos profesionales con IA</span>
                  </a>
                  <span className="breadcrumb-separator">/</span>
                  <span className="breadcrumb-item active">
                    <span className="breadcrumb-icon">📖</span>
                    <span className="breadcrumb-text">Contenido</span>
                  </span>
                </div>
              </div>
              <div className="header-main">
                <div className="header-content">
                  <h1 className="course-title">{courseData.title}</h1>
                  <p className="course-description">
                    Domina las herramientas de IA para crear contenido audiovisual profesional. Aprende a generar videos, editar con inteligencia artificial y optimizar para diferentes plataformas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contenido principal */}
        <section>
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                <LessonActionButtons
                  currentLessonId={courseData.lessons[progress.currentLesson]?.id}
                  currentModuleId={courseData.lessons[progress.currentLesson]?.moduleId}
                  isCurrentLessonCompleted={isLessonCompleted(courseData.lessons[progress.currentLesson]?.id)}
                  isModuleCompleted={isModuleCompleted}
                  isLastLessonOfModule={isLastLessonOfModule}
                  canCompleteModuleWithPrerequisites={canCompleteModuleWithPrerequisites}
                  getModuleTitle={getModuleTitle}
                  onCompleteModule={handleCompleteModule}
                  onCompleteLesson={handleCompleteCurrentLesson}
                />

                <CompleteCourseSection
                  isCourseCompleted={isCourseCompleted}
                  areAllLessonsCompleted={areAllLessonsCompleted}
                  isSaving={false}
                  completedCount={progress.completedLessons.length}
                  totalCount={courseData.lessons.length}
                  onCompleteCourse={handleCompleteCourse}
                />
              </div>

              <div>
                <CourseSidebar
                  lessons={courseData.lessons}
                  expandedModules={expandedModules}
                  toggleModuleExpansion={toggleModuleExpansion}
                  getModuleProgress={getModuleProgress}
                  isModuleCompleted={isModuleCompleted}
                  isLessonAccessible={isLessonAccessible}
                  isLessonCompleted={isLessonCompleted}
                  currentLessonIndex={progress.currentLesson}
                  onSelectLesson={(idx) => setCurrentLesson(idx)}
                  isEnrolled={true}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Estilos específicos recuperados del diseño anterior (resumen) */}
      <style jsx>{`
        .course-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 2rem 0; }
        .course-header .container { max-width: 1200px; margin: 0 auto; }
        .course-header-content { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
        .course-breadcrumb { margin-bottom: 2rem; font-size: 0.9rem; }
        .breadcrumb-container { display: flex; align-items: center; gap: .5rem; flex-wrap: wrap; }
        .breadcrumb-item { display: flex; align-items: center; gap: .5rem; color: rgba(255,255,255,.9); text-decoration: none; padding: .5rem .75rem; border-radius: 8px; transition: all .3s ease; background: rgba(255,255,255,.1); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,.2); }
        .breadcrumb-item:hover { color: #fff; background: rgba(255,255,255,.2); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,.1); }
        .breadcrumb-item.active { color: #fff; background: rgba(255,255,255,.25); border-color: rgba(255,255,255,.4); font-weight: 600; }
        .breadcrumb-icon { font-size: 1rem; }
        .breadcrumb-separator { color: rgba(255,255,255,.6); font-weight: 600; margin: 0 .25rem; }
        .header-main { display: flex; justify-content: flex-start; align-items: flex-start; gap: 2rem; }
        .header-content { display: flex; flex-direction: column; align-items: flex-start; gap: 1rem; text-align: left; width: 100%; }
        .course-title { font-size: 2rem; font-weight: 700; margin: 0; text-align: left; }
        .course-description { margin: 0; opacity: .95; }
        @media (max-width: 768px) { .header-main { flex-direction: column; gap: 1rem; } .course-title { font-size: 1.8rem; } }
      `}</style>
    </>
  );
}


