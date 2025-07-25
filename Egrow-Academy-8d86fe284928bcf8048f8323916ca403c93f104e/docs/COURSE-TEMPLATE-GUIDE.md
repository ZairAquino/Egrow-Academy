# 🏆 Guía de Plantilla para Cursos - Botón "Terminar Curso"

Esta guía explica cómo implementar el botón "Terminar Curso" en nuevos cursos de eGrow Academy.

## 📋 Requisitos Previos

- Curso creado con estructura de carpetas: `/src/app/curso/[slug]/contenido/page.tsx`
- API de completado implementada: `/src/app/api/courses/complete-course/route.ts`
- Hook de progreso configurado: `useCourseProgress`

## 🔧 Implementación Paso a Paso

### 1. Añadir Función `handleCompleteCourse`

Después de la función `handleMarkLessonComplete`, añadir:

```typescript
const handleCompleteCourse = async () => {
  if (!isEnrolled) return;
  
  // Verificar si todas las lecciones están completadas
  const allLessonsCompleted = courseData.lessons.every(lesson => 
    progress.completedLessons.includes(lesson.id)
  );
  
  if (!allLessonsCompleted) {
    alert('Debes completar todas las lecciones antes de poder terminar el curso.');
    return;
  }
  
  setIsSaving(true);
  try {
    const response = await fetch('/api/courses/complete-course', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        courseSlug: 'TU-SLUG-DEL-CURSO' // Cambiar por el slug real
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Curso marcado como completado:', result);
      
      // Redirigir a la página de inicio del curso
      router.push('/curso/TU-SLUG-DEL-CURSO'); // Cambiar por el slug real
    } else {
      const error = await response.json();
      console.error('❌ Error al completar curso:', error);
      alert('Error al completar el curso. Por favor, intenta de nuevo.');
    }
  } catch (error) {
    console.error('❌ Error al completar curso:', error);
    alert('Error de conexión. Por favor, intenta de nuevo.');
  } finally {
    setIsSaving(false);
  }
};
```

### 2. Añadir Función `areAllLessonsCompleted`

Después de la función `getLessonStatus`, añadir:

```typescript
const areAllLessonsCompleted = () => {
  return courseData.lessons.every(lesson => 
    progress.completedLessons.includes(lesson.id)
  );
};
```

### 3. Añadir Función `isCourseCompleted`

Después de la función `isLessonAccessible`, añadir:

```typescript
const isCourseCompleted = () => {
  return progress.status === 'COMPLETED' || progress.progressPercentage === 100;
};
```

### 4. Añadir Botón en la Sección de Lecciones

Después del `</div>` de `lessons-list`, añadir:

```tsx
{/* Botón Terminar Curso */}
<div className="complete-course-section">
  {isCourseCompleted() ? (
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
        <span>✅ Lecciones: {courseData.lessons.length}/{courseData.lessons.length}</span>
      </div>
    </div>
  ) : (
    <>
      <button 
        className={`btn btn-complete-course ${!areAllLessonsCompleted() ? 'disabled' : ''}`}
        onClick={handleCompleteCourse}
        disabled={isSaving || !areAllLessonsCompleted()}
      >
        {isSaving ? '🔄 Procesando...' : '🏆 Terminar Curso'}
      </button>
      <p className="complete-course-info">
        {areAllLessonsCompleted() 
          ? '¡Felicidades! Has completado todas las lecciones. Puedes terminar el curso.'
          : `Completa todas las lecciones (${progress.completedLessons.length}/${courseData.lessons.length}) para poder terminar el curso`
        }
      </p>
    </>
  )}
</div>
```

### 5. Añadir Estilos CSS

Después del estilo `.lesson-status`, añadir:

```css
.complete-course-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e5e7eb;
  text-align: center;
}

.btn-complete-course {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-complete-course:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
}

.btn-complete-course:disabled,
.btn-complete-course.disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  background: linear-gradient(135deg, #9ca3af, #6b7280);
}

.btn-complete-course:disabled:hover,
.btn-complete-course.disabled:hover {
  background: linear-gradient(135deg, #9ca3af, #6b7280);
  transform: none;
  box-shadow: none;
}

.complete-course-info {
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: #6b7280;
  line-height: 1.4;
}

.course-completed-message {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  border-radius: 12px;
  border: 2px solid #22c55e;
}

.completion-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.completion-icon {
  font-size: 2rem;
}

.completion-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #16a34a;
}

.completion-info {
  font-size: 1rem;
  color: #374151;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.completion-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 500;
}

## 🎯 Variables a Personalizar

### En `handleCompleteCourse`:
- `courseSlug: 'TU-SLUG-DEL-CURSO'` - Cambiar por el slug real del curso
- `router.push('/curso/TU-SLUG-DEL-CURSO')` - Cambiar por la ruta real del curso

### Ejemplos de Slugs:
- `fundamentos-ml`
- `introduccion-llms`
- `computer-vision`
- `desarrollo-web-fullstack`

## ✅ Cursos Actualmente Implementados

- ✅ **Fundamentos de Machine Learning** (`fundamentos-ml`)
- ✅ **Introducción a LLMs** (`introduccion-llms`)
- ✅ **Computer Vision con Python** (`computer-vision`)
- ✅ **Desarrollo Web Fullstack** (`desarrollo-web-fullstack`)

## 🔍 Verificación

Para verificar que el botón funciona correctamente:

1. **Completar todas las lecciones** del curso
2. **Verificar que el botón se habilita** automáticamente
3. **Hacer clic en "Terminar Curso"**
4. **Confirmar redirección** a la página de inicio del curso
5. **Verificar en "Mis Cursos"** que aparece como completado

## 🚨 Notas Importantes

- El botón solo se habilita cuando **todas las lecciones están completadas**
- No hay confirmación adicional al hacer clic (flujo directo)
- La redirección es a la página de inicio del curso, no al login
- Los estilos son consistentes en todos los cursos
- El contador de progreso se actualiza automáticamente
- **Modo Review**: Una vez completado, el curso permite acceso a todas las lecciones para revisión
- **Progreso Preservado**: El estado completado se mantiene permanentemente
- **Sin Re-inicio**: No se puede volver a marcar lecciones como completadas en modo review

## 📝 Checklist para Nuevos Cursos

- [ ] Añadir función `handleCompleteCourse`
- [ ] Añadir función `areAllLessonsCompleted`
- [ ] Añadir función `isCourseCompleted`
- [ ] Añadir botón en la sección de lecciones
- [ ] Añadir estilos CSS
- [ ] Personalizar slug del curso
- [ ] Probar funcionalidad completa
- [ ] Verificar redirección correcta
- [ ] Probar modo review después de completar
- [ ] Verificar que no se puede re-marcar lecciones completadas 