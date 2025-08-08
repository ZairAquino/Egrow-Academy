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
      <main>
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
    </>
  );
}


