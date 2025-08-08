"use client";

import React from 'react';

type Lesson = { id: string; moduleId: number; title: string; duration?: string; type?: string };

type Props = {
  lessons: Lesson[];
  expandedModules: Set<number>;
  toggleModuleExpansion: (moduleId: number) => void;
  getModuleProgress: (moduleId: number) => { completed: number; total: number; percentage: number };
  isModuleCompleted: (moduleId: number) => boolean;
  isLessonAccessible: (globalIndex: number) => boolean;
  isLessonCompleted: (lessonId: string) => boolean;
  currentLessonIndex: number;
  onSelectLesson: (globalIndex: number) => void;
  isEnrolled: boolean;
};

export default function CourseSidebar(props: Props) {
  return (
    <div className="course-sidebar">
      <div className="progress-section">
        <div className="progress-header">
          <h3>Progreso del Curso</h3>
          <span className="progress-percentage">
            {Math.round((props.lessons.filter(l => props.isLessonCompleted(l.id)).length / props.lessons.length) * 100)}%
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${(props.lessons.filter(l => props.isLessonCompleted(l.id)).length / props.lessons.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {props.isEnrolled ? (
        <div className="course-guidance">
          <p className="guidance-text">
            💡 <strong>Navegación Libre:</strong> Puedes navegar entre todas las lecciones. Para completar el curso, debes marcar como completadas todas las lecciones de todos los módulos.
          </p>
        </div>
      ) : null}

      <div className="lessons-list">
        {[1, 2, 3, 4, 5].map((moduleId) => {
          const moduleLessons = props.lessons.filter((lesson) => lesson.moduleId === moduleId);
          const moduleProgress = props.getModuleProgress(moduleId);
          const isModuleComplete = props.isModuleCompleted(moduleId);

          return (
            <div key={moduleId} className="module-group">
              <div
                className={`module-header ${isModuleComplete ? 'completed' : ''} ${props.expandedModules.has(moduleId) ? 'expanded' : ''}`}
                onClick={() => props.toggleModuleExpansion(moduleId)}
                style={{ cursor: 'pointer' }}
              >
                <div className="module-title">
                  <span className="module-icon">{isModuleComplete ? '✅' : '📚'}</span>
                  <span>MÓDULO {moduleId}</span>
                  <span className="expand-icon">{props.expandedModules.has(moduleId) ? '▼' : '▶'}</span>
                </div>
                <div className="module-progress">
                  <span className="progress-text">
                    {moduleProgress.completed}/{moduleProgress.total}
                  </span>
                  <div className="progress-bar-mini">
                    <div className="progress-fill-mini" style={{ width: `${moduleProgress.percentage}%` }}></div>
                  </div>
                </div>
              </div>

              {props.expandedModules.has(moduleId) ? (
                <div className="module-lessons">
                  {moduleLessons.map((lesson, index) => {
                    const globalIndex = props.lessons.findIndex((l) => l.id === lesson.id);
                    return (
                      <div
                        key={lesson.id}
                        className={`lesson-item ${globalIndex === props.currentLessonIndex ? 'active' : ''} ${props.isLessonCompleted(lesson.id) ? 'completed' : ''}`}
                        onClick={() => {
                          if (props.isLessonAccessible(globalIndex)) {
                            props.onSelectLesson(globalIndex);
                          }
                        }}
                      >
                        <div className="lesson-number">
                          {moduleId}.{index + 1}
                        </div>
                        <div className="lesson-content">
                          <h4>{lesson.title}</h4>
                          <div className="lesson-meta">
                            <span className="lesson-type">{lesson.type}</span>
                            <span className="lesson-duration">{lesson.duration}</span>
                          </div>
                        </div>
                        <div className="lesson-status">{props.isLessonCompleted(lesson.id) ? '✅' : '⏳'}</div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}


