# 🎯 Sistema de Recomendaciones - eGrow Academy

## 📋 **Descripción General**

El sistema de recomendaciones de eGrow Academy utiliza inteligencia artificial y análisis de comportamiento para proporcionar recomendaciones personalizadas de cursos, recursos y contenido a los usuarios.

## 🏗️ **Arquitectura del Sistema**

### **Componentes Principales**

1. **UserBehaviorTracker** (`src/lib/user-behavior.ts`)
   - Registra acciones del usuario
   - Analiza patrones de comportamiento
   - Gestiona preferencias de usuario

2. **RecommendationEngine** (`src/lib/recommendation-engine.ts`)
   - Genera recomendaciones personalizadas
   - Calcula scores de relevancia
   - Combina múltiples fuentes de datos

3. **API Endpoints** (`src/app/api/recommendations/route.ts`)
   - GET: Obtener recomendaciones
   - POST: Registrar comportamiento

4. **UI Components** (`src/components/ui/RecommendationsSection.tsx`)
   - Muestra recomendaciones en la interfaz
   - Tracking de interacciones
   - Diseño responsive

## 📊 **Base de Datos**

### **Tablas Nuevas**

```sql
-- Tracking de comportamiento del usuario
CREATE TABLE user_behaviors (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  target_id TEXT,
  target_type TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Preferencias del usuario
CREATE TABLE user_preferences (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  interests TEXT[],
  skill_level TEXT,
  learning_goals TEXT[],
  preferred_topics TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Recomendaciones generadas
CREATE TABLE recommendations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  target_id TEXT NOT NULL,
  target_type TEXT NOT NULL,
  score FLOAT NOT NULL,
  reason TEXT NOT NULL,
  is_viewed BOOLEAN DEFAULT FALSE,
  is_clicked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);
```

## 🔄 **Flujo de Funcionamiento**

### **1. Tracking de Comportamiento**
```typescript
// Ejemplo de tracking automático
useBehaviorTracking(); // Hook que trackea navegación automáticamente

// Tracking manual
trackBehavior({
  action: 'view_course',
  targetId: 'monetiza-ia',
  targetType: 'course',
  metadata: { duration: 30 }
});
```

### **2. Análisis de Comportamiento**
```typescript
// El sistema analiza:
- Cursos vistos recientemente
- Lecciones completadas
- Búsquedas realizadas
- Recursos descargados
- Tiempo de navegación
- Patrones de interacción
```

### **3. Generación de Recomendaciones**
```typescript
// Algoritmo de recomendación:
1. Análisis de comportamiento del usuario
2. Identificación de intereses y nivel de habilidad
3. Búsqueda de contenido similar
4. Cálculo de scores de relevancia
5. Combinación de múltiples fuentes
6. Eliminación de duplicados
7. Ordenamiento por relevancia
```

## 🎯 **Tipos de Recomendaciones**

### **1. Basadas en Comportamiento**
- **Cursos vistos recientemente** → Cursos similares
- **Lecciones completadas** → Próximos pasos lógicos
- **Búsquedas** → Contenido relacionado

### **2. Basadas en Nivel de Habilidad**
- **Principiante** → Cursos introductorios
- **Intermedio** → Cursos de especialización
- **Avanzado** → Cursos avanzados y proyectos

### **3. Basadas en Preferencias Explícitas**
- **Intereses declarados** → Contenido específico
- **Objetivos de aprendizaje** → Cursos alineados
- **Temas preferidos** → Recursos relacionados

### **4. Recomendaciones de Recursos**
- **Basadas en descargas previas** → Recursos similares
- **Relacionados con cursos** → Material complementario
- **Tendencias populares** → Contenido viral

## 📈 **Métricas y Analytics**

### **Métricas de Comportamiento**
- Total de acciones registradas
- Distribución por tipo de acción
- Patrones temporales
- Intereses emergentes

### **Métricas de Recomendaciones**
- Tasa de visualización
- Tasa de clics
- Score promedio de relevancia
- Conversiones generadas

### **Métricas de Engagement**
- Tiempo en página
- Profundidad de navegación
- Retorno de usuarios
- Completación de cursos

## 🚀 **Configuración y Uso**

### **1. Migración de Base de Datos**
```bash
# Generar y aplicar migración
npx prisma migrate dev --name add_recommendations_system

# Configurar datos de prueba
npm run setup-recommendations
```

### **2. Integración en Componentes**
```typescript
// En cualquier página
import { RecommendationsSection } from '@/components/ui/RecommendationsSection';

<RecommendationsSection 
  title="Recomendado para ti"
  limit={6}
  showReason={true}
/>
```

### **3. Tracking Manual**
```typescript
import { useBehaviorTracking } from '@/hooks/useBehaviorTracking';

const { trackBehavior } = useBehaviorTracking();

// Trackear acción específica
trackBehavior({
  action: 'enroll_course',
  targetId: 'course-id',
  targetType: 'course'
});
```

## 🔧 **APIs Disponibles**

### **GET /api/recommendations**
```typescript
// Parámetros
{
  limit?: number,      // Número de recomendaciones (default: 6)
  refresh?: boolean    // Forzar regeneración (default: false)
}

// Respuesta
{
  recommendations: [
    {
      id: string,
      type: 'course' | 'resource' | 'event',
      title: string,
      description: string,
      image?: string,
      score: number,
      reason: string,
      url: string
    }
  ]
}
```

### **POST /api/recommendations**
```typescript
// Body
{
  action: string,
  targetId?: string,
  targetType?: string,
  metadata?: object
}

// Respuesta
{
  success: boolean
}
```

## 🎨 **Características de la UI**

### **Componente RecommendationsSection**
- **Diseño responsive** con grid adaptativo
- **Animaciones suaves** con Framer Motion
- **Loading states** con skeleton loaders
- **Error handling** con mensajes amigables
- **Tracking automático** de clics
- **Scores visuales** con colores dinámicos

### **Características Visuales**
- **Cards modernas** con hover effects
- **Iconos por tipo** (📚 cursos, 📖 recursos, 🎯 eventos)
- **Scores de relevancia** (0-100%)
- **Razones de recomendación** personalizadas
- **Imágenes optimizadas** con fallbacks

## 📊 **Optimización y Performance**

### **Caching**
- **Recomendaciones cacheadas** por 7 días
- **Análisis de comportamiento** en background
- **Generación asíncrona** sin bloquear UI

### **Performance**
- **Lazy loading** de componentes
- **Paginación inteligente** de resultados
- **Debouncing** en tracking de eventos
- **Optimización de queries** con índices

### **Escalabilidad**
- **Arquitectura modular** para fácil extensión
- **Algoritmos configurables** por tipo de contenido
- **Sistema de plugins** para nuevos tipos de recomendación

## 🔮 **Futuras Mejoras**

### **Algoritmos Avanzados**
- **Machine Learning** para predicciones más precisas
- **Collaborative Filtering** basado en usuarios similares
- **Content-Based Filtering** con análisis semántico
- **Hybrid Recommendations** combinando múltiples enfoques

### **Personalización Avanzada**
- **Preferencias dinámicas** que se adaptan al tiempo
- **Contextual recommendations** basadas en momento del día
- **Seasonal recommendations** para contenido temporal
- **A/B testing** de algoritmos de recomendación

### **Integración con IA**
- **ChatGPT integration** para recomendaciones conversacionales
- **Natural language processing** para entender intenciones
- **Predictive analytics** para anticipar necesidades
- **Automated content tagging** para mejor categorización

## 📝 **Mantenimiento**

### **Monitoreo**
- **Logs detallados** de comportamiento
- **Métricas de performance** en tiempo real
- **Alertas automáticas** para anomalías
- **Dashboard de analytics** para insights

### **Limpieza de Datos**
- **Expiración automática** de recomendaciones antiguas
- **Limpieza de datos** de comportamiento obsoleto
- **Optimización de índices** periódica
- **Backup automático** de datos críticos

---

**Fecha de implementación:** 2025-01-30  
**Versión:** 1.0.0  
**Estado:** ✅ Completamente funcional  
**Próxima actualización:** Machine Learning integration 