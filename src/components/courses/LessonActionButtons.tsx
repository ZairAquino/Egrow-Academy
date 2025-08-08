"use client";

import React from 'react';

type Props = {
  currentLessonId: string;
  currentModuleId: number;
  isCurrentLessonCompleted: boolean;
  isModuleCompleted: (moduleId: number) => boolean;
  isLastLessonOfModule: (lessonId: string, moduleId: number) => boolean;
  canCompleteModuleWithPrerequisites: (moduleId: number) => boolean;
  getModuleTitle: (moduleId: number) => string;
  onCompleteModule: (moduleId: number) => void;
  onCompleteLesson: () => void;
};

export default function LessonActionButtons(props: Props) {
  const isModuleAlreadyCompleted = props.isModuleCompleted(props.currentModuleId);
  if (isModuleAlreadyCompleted) return null;

  const isLastLesson = props.isLastLessonOfModule(props.currentLessonId, props.currentModuleId);
  if (isLastLesson) {
    const canComplete = props.canCompleteModuleWithPrerequisites(props.currentModuleId);
    return (
      <button
        className={`btn btn-large ${canComplete ? 'btn-success' : 'btn-secondary'}`}
        onClick={() => props.onCompleteModule(props.currentModuleId)}
        disabled={!canComplete}
        style={{ fontSize: '1.1em', padding: '12px 24px', opacity: canComplete ? 1 : 0.6, cursor: canComplete ? 'pointer' : 'not-allowed' }}
        title={canComplete ? 'Completar módulo' : 'Completa todas las lecciones anteriores del módulo primero'}
      >
        🏆 Completar {props.getModuleTitle(props.currentModuleId).split(':')[0]}
      </button>
    );
  }

  return props.isCurrentLessonCompleted ? null : (
    <button className="btn btn-primary" onClick={props.onCompleteLesson}>
      ✅ Completar Lección
    </button>
  );
}


