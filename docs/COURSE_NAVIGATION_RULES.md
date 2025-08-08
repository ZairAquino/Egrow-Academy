# Reglas de Navegación de Cursos - Egrow Academy

## 📋 Regla Principal: Navegación Libre

**REGLA OBLIGATORIA**: En todos los cursos de la plataforma, los usuarios deben poder navegar libremente entre todas las lecciones sin restricciones de secuencia.

## 🎯 Implementación Técnica

### 1. Función `isLessonAccessible`
```typescript
const isLessonAccessible = (lessonIndex: number) => {
  // Permitir navegación libre: todas las lecciones son siempre accesibles
  return true;
};
```

### 2. Función `getLessonIcon` 
```typescript
const getLessonIcon = (lessonIndex: number) => {
  const lesson = courseData.lessons[lessonIndex];
  if (progress.completedLessons.includes(lesson.id)) {
    return '✅'; // Completada
  } else if (lessonIndex === progress.currentLesson) {
    return '▶️'; // Actual
  } else {
    return '📖'; // Disponible
  }
  // NO mostrar 🔒 (bloqueada)
};
```

### 3. Clases CSS de Lecciones
```typescript
// ✅ CORRECTO: Solo usar estas clases
className={`lesson-item ${
  globalIndex === progress.currentLesson ? 'active' : ''
} ${
  isLessonCompleted(lesson.id) ? 'completed' : ''
}`}

// ❌ INCORRECTO: No usar clase 'locked'
// ${!isLessonAccessible(globalIndex) ? 'locked' : ''}
```

### 4. Estilos CSS
```css
/* ✅ MANTENER estos estilos */
.lesson-item.active { /* lección actual */ }
.lesson-item.completed { /* lección completada */ }

/* ❌ ELIMINAR estos estilos */
.lesson-item.locked { /* NO USAR */ }
.lesson-item.locked:hover { /* NO USAR */ }
```

## 🔧 Archivos a Actualizar

Para cada nuevo curso, asegurarse de aplicar estas reglas en:

### Archivo de Contenido del Curso
- `src/app/curso/[slug]/contenido/page.tsx`

### Cambios Específicos:
1. **isLessonAccessible()** → Siempre return true
2. **getLessonIcon()** → Eliminar caso de 🔒
3. **className** → Remover lógica de 'locked'
4. **Estilos CSS** → Eliminar .lesson-item.locked

## 📚 Cursos Actualizados

- ✅ `vibe-coding-claude-cursor` - Navegación libre implementada
- ✅ `asistentes-virtuales-ia` - Navegación libre implementada
- ✅ `videos-profesionales-ia` - Navegación libre implementada
- ✅ `desarrollo-web-fullstack` - Navegación libre implementada
- ⚠️ `monetiza-ia` - Pendiente de actualizar

## 🎯 Beneficios de la Navegación Libre

1. **Mejor Experiencia de Usuario**: Los usuarios pueden saltar a temas específicos de su interés
2. **Flexibilidad de Aprendizaje**: Cada usuario puede seguir su propio ritmo y orden
3. **Acceso Directo**: Facilita la revisión de contenido específico
4. **Menos Fricción**: Elimina barreras artificiales en el proceso de aprendizaje

## ⚠️ Nota Importante

Esta regla debe aplicarse consistentemente en **TODOS** los cursos de la plataforma para mantener una experiencia uniforme.