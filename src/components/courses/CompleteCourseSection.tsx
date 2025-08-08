"use client";

import React from 'react';

type Props = {
  isCourseCompleted: boolean;
  areAllLessonsCompleted: boolean;
  isSaving: boolean;
  completedCount: number;
  totalCount: number;
  onCompleteCourse: () => void;
};

export default function CompleteCourseSection(props: Props) {
  return (
    <div className="complete-course-section">
      {props.isCourseCompleted ? (
        <div className="course-completed-message">
          <div className="completion-badge">
            <span className="completion-icon">🏆</span>
            <span className="completion-text">¡Curso Completado!</span>
          </div>
          <p className="completion-info">
            Has completado exitosamente este curso. Puedes revisar el contenido cuando quieras.
          </p>
          <div className="completion-stats">
            <span>📊 Progreso: 100%</span>
            <span>
              ✅ Lecciones: {props.totalCount}/{props.totalCount}
            </span>
          </div>
        </div>
      ) : (
        <>
          <button
            className={`btn btn-complete-course ${!props.areAllLessonsCompleted ? 'disabled' : ''}`}
            onClick={props.onCompleteCourse}
            disabled={props.isSaving || !props.areAllLessonsCompleted}
          >
            {props.isSaving ? '🔄 Procesando...' : '🏆 Terminar Curso'}
          </button>
          <p className="complete-course-info">
            {props.areAllLessonsCompleted ? (
              '¡Felicidades! Has completado todas las lecciones. Puedes terminar el curso.'
            ) : (
              <>
                Completa todas las lecciones{' '}
                <strong>{props.completedCount}</strong>/<strong>{props.totalCount}</strong> para poder terminar el curso
              </>
            )}
          </p>
        </>
      )}
    </div>
  );
}


