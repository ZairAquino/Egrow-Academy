# 🎯 Navegación por Categorías - eGrow Academy

## 📋 **Descripción General**

El sistema de navegación por categorías simplifica la búsqueda de cursos agrupándolos en categorías específicas y claras. Esto mejora significativamente la experiencia del usuario al facilitar la localización del contenido relevante.

## 🏗️ **Arquitectura del Sistema**

### **Componentes Principales**

1. **CategoryNavigation** (`src/components/ui/CategoryNavigation.tsx`)
   - Navegación visual por categorías
   - Diseño responsive y animado
   - Integración con URL parameters

2. **CategorySidebar** (`src/components/ui/CategoryNavigation.tsx`)
   - Versión compacta para sidebars
   - Navegación lateral optimizada
   - Ideal para layouts con sidebar

3. **Schema de Base de Datos** (`prisma/schema.prisma`)
   - Campo `category` en modelo Course
   - Enum `CourseCategory` con categorías específicas
   - Índices optimizados para filtros

## 📊 **Categorías Disponibles**

### **1. Habilidades Irremplazables** 🎯
- **Descripción**: Competencias que la IA no puede reemplazar
- **Enfoque**: Creatividad, pensamiento crítico, empatía
- **Color**: Azul (`bg-blue-500`)
- **Icono**: 🎯

### **2. IA para Emprender** 🚀
- **Descripción**: Herramientas de IA para crear negocios
- **Enfoque**: Monetización, automatización, emprendimiento
- **Color**: Púrpura (`bg-purple-500`)
- **Icono**: 🚀

### **3. Desarrollo Web** 💻
- **Descripción**: Crea sitios web y aplicaciones modernas
- **Enfoque**: React, Node.js, tecnologías web
- **Color**: Verde (`bg-green-500`)
- **Icono**: 💻

### **4. Marketing Digital** 📈
- **Descripción**: Estrategias para vender en internet
- **Enfoque**: SEO, SEM, redes sociales
- **Color**: Naranja (`bg-orange-500`)
- **Icono**: 📈

### **5. Productividad** ⚡
- **Descripción**: Optimiza tu tiempo y resultados
- **Enfoque**: Herramientas, técnicas, automatización
- **Color**: Amarillo (`bg-yellow-500`)
- **Icono**: ⚡

### **6. Finanzas Personales** 💰
- **Descripción**: Gestiona tu dinero de forma inteligente
- **Enfoque**: Inversiones, ahorro, presupuesto
- **Color**: Esmeralda (`bg-emerald-500`)
- **Icono**: 💰

### **7. Liderazgo** 👑
- **Descripción**: Desarrolla habilidades de liderazgo
- **Enfoque**: Gestión de equipos, comunicación
- **Color**: Rojo (`bg-red-500`)
- **Icono**: 👑

### **8. Innovación Tecnológica** 🔬
- **Descripción**: Las últimas tendencias en tecnología
- **Enfoque**: Blockchain, IoT, AR/VR
- **Color**: Índigo (`bg-indigo-500`)
- **Icono**: 🔬

## 🎨 **Componentes de UI**

### **CategoryNavigation**

```typescript
<CategoryNavigation
  activeCategory="IA_PARA_EMPRENDER"
  showCounts={true}
  layout="grid"
  onCategoryChange={(category) => {
    console.log('Categoría seleccionada:', category);
  }}
/>
```

**Props disponibles:**
- `activeCategory`: Categoría actualmente seleccionada
- `showCounts`: Mostrar número de cursos por categoría
- `layout`: 'grid' | 'list' | 'compact'
- `onCategoryChange`: Callback al cambiar categoría

### **CategorySidebar**

```typescript
<CategorySidebar
  activeCategory="DESARROLLO_WEB"
  onCategoryChange={(category) => {
    // Manejar cambio de categoría
  }}
/>
```

## 🔄 **Flujo de Funcionamiento**

### **1. Navegación por URL**

```typescript
// URL sin categoría
/courses

// URL con categoría específica
/courses?category=IA_PARA_EMPRENDER

// URL con múltiples parámetros
/courses?category=DESARROLLO_WEB&search=react
```

### **2. Filtrado de Cursos**

```typescript
const getFilteredCourses = () => {
  if (activeCategory === 'all') {
    return allCourses;
  } else {
    return courses.filter(course => course.category === activeCategory);
  }
};
```

### **3. Actualización de Estado**

```typescript
const handleCategoryChange = (category: string) => {
  // Limpiar búsqueda al cambiar categoría
  setSearchQuery('');
  setQuery('');
  
  // Actualizar URL
  const params = new URLSearchParams();
  if (category !== 'all') {
    params.set('category', category);
  }
  router.push(`/courses?${params.toString()}`);
};
```

## 📊 **Base de Datos**

### **Schema de Cursos**

```sql
ALTER TABLE courses ADD COLUMN category TEXT DEFAULT 'HABILIDADES_IRREMPLAZABLES';

-- Índice para optimizar filtros
CREATE INDEX idx_courses_category ON courses(category);
```

### **Enum de Categorías**

```prisma
enum CourseCategory {
  HABILIDADES_IRREMPLAZABLES
  IA_PARA_EMPRENDER
  DESARROLLO_WEB
  MARKETING_DIGITAL
  PRODUCTIVIDAD
  FINANZAS_PERSONALES
  LIDERAZGO
  INNOVACION_TECNOLOGICA
}
```

## 🚀 **Configuración y Uso**

### **1. Migración de Base de Datos**

```bash
# Generar y aplicar migración
npx prisma migrate dev --name add_course_categories

# Actualizar cursos existentes
npm run update-courses-categories
```

### **2. Integración en Páginas**

```typescript
import { CategoryNavigation } from '@/components/ui/CategoryNavigation';

// En tu página de cursos
<CategoryNavigation
  activeCategory={searchParams.get('category') || 'all'}
  showCounts={true}
  layout="grid"
  onCategoryChange={handleCategoryChange}
/>
```

### **3. Filtrado de Cursos**

```typescript
// Obtener cursos por categoría
const getCoursesByCategory = async (category: string) => {
  const where = category === 'all' ? {} : { category };
  
  return await prisma.course.findMany({
    where: {
      ...where,
      status: 'PUBLISHED',
    },
    orderBy: { createdAt: 'desc' },
  });
};
```

## 🎨 **Características de la UI**

### **Diseño Responsive**

- **Desktop**: Grid de 4 columnas con descripciones completas
- **Tablet**: Grid de 2-3 columnas
- **Mobile**: Lista vertical compacta

### **Animaciones**

- **Hover effects**: Escalado suave al pasar el mouse
- **Transiciones**: Cambios de estado fluidos
- **Loading states**: Skeleton loaders durante carga

### **Accesibilidad**

- **Navegación por teclado**: Tab navigation
- **Screen readers**: ARIA labels apropiados
- **Contraste**: Colores con suficiente contraste

## 📈 **Métricas y Analytics**

### **Métricas de Navegación**

- **Categorías más visitadas**: Tracking de clics
- **Tiempo en categoría**: Engagement por categoría
- **Conversiones**: Cursos completados por categoría

### **Métricas de UX**

- **Tiempo de búsqueda**: Reducción en tiempo para encontrar cursos
- **Tasa de abandono**: Menos usuarios que abandonan sin encontrar contenido
- **Satisfacción**: Feedback de usuarios sobre la navegación

## 🔧 **APIs Disponibles**

### **GET /api/courses**

```typescript
// Parámetros
{
  category?: string,     // Filtrar por categoría
  search?: string,       // Búsqueda de texto
  difficulty?: string,   // Filtrar por dificultad
  limit?: number,        // Número de resultados
  offset?: number        // Paginación
}

// Respuesta
{
  courses: [
    {
      id: string,
      title: string,
      description: string,
      category: string,
      // ... otros campos
    }
  ],
  total: number,
  hasMore: boolean
}
```

## 🎯 **Beneficios del Sistema**

### **Para Usuarios**

1. **Navegación Intuitiva**: Encuentran contenido más rápido
2. **Descubrimiento**: Descubren categorías relevantes
3. **Personalización**: Pueden enfocarse en áreas específicas
4. **Claridad**: Entienden mejor el contenido disponible

### **Para la Plataforma**

1. **Mejor UX**: Reducción en tiempo de búsqueda
2. **Mayor Engagement**: Usuarios exploran más categorías
3. **Conversiones**: Más usuarios encuentran cursos relevantes
4. **Escalabilidad**: Fácil agregar nuevas categorías

## 🔮 **Futuras Mejoras**

### **Funcionalidades Avanzadas**

- **Categorías personalizadas**: Basadas en comportamiento del usuario
- **Filtros combinados**: Múltiples categorías simultáneamente
- **Búsqueda inteligente**: Sugerencias basadas en categorías
- **Recomendaciones**: Cursos relacionados por categoría

### **Analytics Avanzados**

- **Heatmaps**: Visualización de interacciones por categoría
- **A/B testing**: Diferentes layouts de navegación
- **Machine Learning**: Categorización automática de nuevos cursos
- **Personalización**: Categorías adaptadas al perfil del usuario

## 📝 **Mantenimiento**

### **Agregar Nueva Categoría**

1. **Actualizar enum** en `prisma/schema.prisma`
2. **Agregar datos** en `CategoryNavigation.tsx`
3. **Ejecutar migración**: `npx prisma migrate dev`
4. **Actualizar documentación**

### **Monitoreo**

- **Logs de navegación**: Tracking de clics por categoría
- **Performance**: Tiempo de carga de filtros
- **Errores**: Categorías sin cursos o problemas de filtrado

---

**Fecha de implementación:** 2025-01-30  
**Versión:** 1.0.0  
**Estado:** ✅ Completamente funcional  
**Próxima actualización:** Categorías personalizadas por usuario 