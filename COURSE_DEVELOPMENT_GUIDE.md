# Guía de Desarrollo de Cursos - eGrow Academy

## 🎯 Resumen
Esta guía establece los estándares y mejores prácticas para crear nuevos cursos en eGrow Academy, asegurando consistencia, funcionalidad y una experiencia de usuario óptima.

## 🛠️ Componentes Clave

### 1. CourseActionButton Component
**Ubicación:** `src/components/courses/CourseActionButton.tsx`

**Uso:**
```tsx
import CourseActionButton, { CourseProgressInfo } from '@/components/courses/CourseActionButton';

// Botón de inicio
<CourseActionButton
  courseSlug="tu-curso-slug"
  type="start"
  className="new-start-button"
/>

// Botón de continuar
<CourseActionButton
  courseSlug="tu-curso-slug"
  type="continue"
  className="new-continue-button"
/>

// Botón de reanudar
<CourseActionButton
  courseSlug="tu-curso-slug"
  type="resume"
  className="new-progress-button"
/>
```

**Tipos de botones:**
- `start`: "🎯 Comenzar Curso Gratis" (verde)
- `continue`: "🚀 Continuar con el curso" (azul)
- `resume`: "🔄 Continuar donde lo dejaste" (outline verde)

### 2. CourseProgressInfo Component
```tsx
<CourseProgressInfo
  currentLesson={currentLesson}
  totalLessons={courseData.lessons.length}
  completedLessons={completedLessons.length}
  progressPercentage={progressPercentage}
/>
```

## 📁 Estructura de Archivos

### Estructura para Nuevo Curso
```
src/app/curso/[slug]/
├── page.tsx              # Página principal del curso
├── contenido/
│   └── page.tsx          # Página de contenido/lecciones
└── leccion/
    └── [id]/
        └── page.tsx      # Página individual de lección
```

### Template Base
**Ubicación:** `templates/course-template/page.tsx`

**Pasos para crear un nuevo curso:**

1. **Copiar el template:**
   ```bash
   cp -r templates/course-template src/app/curso/[nuevo-curso-slug]
   ```

2. **Actualizar variables clave:**
   ```tsx
   const COURSE_SLUG = 'nuevo-curso-slug';
   const COURSE_TITLE = 'Título del Nuevo Curso';
   const COURSE_DESCRIPTION = 'Descripción detallada del curso...';
   ```

3. **Configurar datos del curso:**
   - Actualizar `courseData` object
   - Modificar información del instructor
   - Ajustar prerequisites y learning objectives
   - Definir lecciones en el array `lessons`

4. **Personalizar contenido:**
   - Actualizar imágenes (`courseData.image`, instructor image)
   - Modificar texto descriptivo
   - Ajustar herramientas y tecnologías

## 🔧 Funcionalidad de Redirección

### Problema Resuelto
**Antes:** Los botones de curso redirigían incorrectamente a `/courses` debido a validación de middleware.

**Solución implementada:**
1. **Middleware actualizado** (`src/middleware.ts`):
   - Solo valida el slug principal del curso
   - Permite subpáginas como `/contenido`, `/leccion/1`
   
2. **Redirección directa:**
   ```tsx
   const goToCourseContent = () => {
     const contentUrl = `/curso/${courseSlug}/contenido`;
     if (typeof window !== 'undefined') {
       window.location.href = contentUrl;
     }
   };
   ```

### Middleware Configuration
```typescript
// 5. Validar slugs de cursos
if (pathname.startsWith('/curso/')) {
  const pathParts = pathname.replace('/curso/', '').split('/');
  const courseSlug = pathParts[0]; // Solo validar el slug principal del curso
  
  // Solo validar si es la página principal del curso (no subpáginas como /contenido)
  if (pathParts.length === 1 && !urlUtils.validateCourseSlug(courseSlug)) {
    return NextResponse.redirect(new URL('/courses', request.url));
  }
}
```

## 📋 Checklist para Nuevo Curso

### ✅ Configuración Inicial
- [ ] Copiar template a nueva carpeta
- [ ] Actualizar `COURSE_SLUG`, `COURSE_TITLE`, `COURSE_DESCRIPTION`
- [ ] Configurar datos del instructor
- [ ] Definir prerequisites y learning objectives

### ✅ Contenido del Curso
- [ ] Crear array de lecciones con estructura correcta
- [ ] Actualizar duración total del curso
- [ ] Configurar herramientas y tecnologías
- [ ] Personalizar texto descriptivo

### ✅ Recursos Visuales
- [ ] Subir imagen principal del curso
- [ ] Configurar imagen del instructor
- [ ] Verificar preview video (si aplica)

### ✅ Funcionalidad
- [ ] Probar botones de inicio/continuar/reanudar
- [ ] Verificar redirección a `/contenido`
- [ ] Testear en modo autenticado y no autenticado
- [ ] Validar carga de progreso del usuario

### ✅ Páginas Adicionales
- [ ] Crear página de contenido (`/contenido/page.tsx`)
- [ ] Implementar páginas de lecciones individuales
- [ ] Configurar navegación entre lecciones

## 🎨 Estilos CSS

### Estilos Nuevos Requeridos
```css
.new-course-actions {
  margin-bottom: 2rem;
}

.progress-section-new {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.start-section-new {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
}
```

## 🚨 Problemas Comunes y Soluciones

### 1. Redirección a `/courses`
**Causa:** Middleware interceptando URLs no válidas
**Solución:** Verificar que el slug del curso cumple con el patrón: `^[a-z0-9-]+$`

### 2. Botones no funcionan
**Causa:** Referencia incorrecta al `courseSlug`
**Solución:** Verificar que el `courseSlug` en `CourseActionButton` coincide con la carpeta del curso

### 3. Progreso no carga
**Causa:** API endpoint no encuentra el curso
**Solución:** Asegurar que `courseData.id` coincide con el slug en la URL

## 📊 Cursos Aplicados (Con Fix)

### ✅ Completados
- [x] `monetiza-ia` - ✅ Fix aplicado y funcionando
- [x] `introduccion-llms` - ✅ Fix aplicado

### 🔄 Pendientes
- [ ] `fundamentos-ml`
- [ ] `computer-vision`
- [ ] `desarrollo-web-fullstack`

## 🔄 Proceso de Aplicación del Fix

Para aplicar el fix a cursos existentes:

1. **Importar componentes:**
   ```tsx
   import CourseActionButton, { CourseProgressInfo } from '@/components/courses/CourseActionButton';
   ```

2. **Eliminar función `handleEnrollClick`**

3. **Reemplazar sección de botones:**
   ```tsx
   <div className="new-course-actions">
     {completedLessons.length > 0 ? (
       <div className="progress-section-new">
         <CourseProgressInfo {...props} />
         <CourseActionButton courseSlug="curso-slug" type="continue" />
       </div>
     ) : (
       <div className="start-section-new">
         <CourseActionButton courseSlug="curso-slug" type="start" />
       </div>
     )}
   </div>
   ```

4. **Testear funcionalidad**

## 📞 Contacto y Soporte

Para dudas sobre implementación de cursos:
- Revisar esta guía primero
- Verificar el template en `templates/course-template/`
- Consultar implementación exitosa en `src/app/curso/monetiza-ia/`

---

**Última actualización:** Implementado fix de redirección y componentes reutilizables
**Estado:** Funcional y probado en producción