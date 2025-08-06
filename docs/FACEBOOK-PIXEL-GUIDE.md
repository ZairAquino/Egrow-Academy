# 📊 Guía de Facebook Pixel - eGrow Academy

## 🎯 **Resumen de Implementación**

Facebook Pixel ha sido implementado exitosamente en eGrow Academy con el ID: **1247652460159167**

### **✅ Estado Actual**
- ✅ **Script base** implementado en `src/app/layout.tsx`
- ✅ **Servicio de tracking** creado en `src/lib/facebook-pixel.ts`
- ✅ **Hook personalizado** disponible en `src/hooks/useFacebookPixel.ts`
- ✅ **Componentes de tracking** creados en `src/components/analytics/FacebookPixelTracker.tsx`
- ✅ **Sistema de analytics** implementado en `src/lib/facebook-analytics.ts`
- ✅ **Dashboard de estadísticas** disponible en `/admin/facebook-analytics`

---

## 🔗 **Links Importantes**

### **Página de Inicio**
- **URL:** `http://localhost:3000` (desarrollo)
- **URL:** `https://egrow-academy.com` (producción)
- **Tracking:** Implementado con eventos automáticos de PageView y ViewContent

### **Dashboard de Analytics**
- **URL:** `http://localhost:3000/admin/facebook-analytics`
- **Acceso:** Solo usuarios premium
- **Funcionalidades:** Estadísticas en tiempo real, exportación de datos, limpieza de datos

---

## 📊 **Cómo Medir Estadísticas**

### **1. Dashboard en Tiempo Real**
```bash
# Acceder al dashboard
http://localhost:3000/admin/facebook-analytics
```

**Métricas disponibles:**
- **Vistas de página:** Número total de pageviews
- **Visitantes únicos:** Usuarios únicos en las últimas 24 horas
- **Tasa de conversión:** Porcentaje de conversiones
- **Ingresos:** Revenue total generado
- **Páginas más visitadas:** Top 5 páginas
- **Funnel de conversión:** Journey completo del usuario
- **Eventos más frecuentes:** Top 10 eventos

### **2. Facebook Pixel Helper**
1. **Instalar extensión:** [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedjljlbpblpldbkeac)
2. **Navegar al sitio:** `http://localhost:3000`
3. **Verificar eventos:** La extensión mostrará todos los eventos enviados
4. **Validar datos:** Verificar que los parámetros sean correctos

### **3. Console del Navegador**
```javascript
// Abrir DevTools (F12) y ver logs
console.log('📊 [Facebook Pixel] Evento enviado: PageView', data);
console.log('📊 [Facebook Analytics] Evento enviado: ViewContent', data);
```

### **4. Facebook Ads Manager**
1. **Ir a:** [Facebook Ads Manager](https://business.facebook.com/adsmanager)
2. **Seleccionar:** Tu cuenta de Facebook
3. **Ir a:** Eventos > Eventos personalizados
4. **Verificar:** Que los eventos lleguen correctamente

---

## 🚀 **Cómo Usar Facebook Pixel**

### **1. Uso Básico en Páginas**

```tsx
import FacebookPixelTracker from '@/components/analytics/FacebookPixelTracker';

export default function MiPagina() {
  return (
    <div>
      <h1>Mi Página</h1>
      
      {/* Tracking automático de PageView */}
      <FacebookPixelTracker 
        trackPageView={true}
        pageData={{
          content_name: 'Mi Página',
          content_category: 'Página',
          content_type: 'page'
        }}
      />
    </div>
  );
}
```

### **2. Tracking de Cursos**

```tsx
import { CourseTracker } from '@/components/analytics/FacebookPixelTracker';

export default function CursoPage({ curso }) {
  return (
    <div>
      <h1>{curso.nombre}</h1>
      
      {/* Tracking automático de visualización de curso */}
      <CourseTracker 
        courseId={curso.id}
        courseName={curso.nombre}
        courseValue={curso.precio}
      />
    </div>
  );
}
```

### **3. Tracking de Lecciones**

```tsx
import { LessonTracker } from '@/components/analytics/FacebookPixelTracker';

export default function LeccionPage({ leccion, progreso }) {
  return (
    <div>
      <h1>{leccion.nombre}</h1>
      
      {/* Tracking automático de lección completada */}
      <LessonTracker 
        courseId={leccion.cursoId}
        lessonId={leccion.id}
        lessonName={leccion.nombre}
        progressPercentage={progreso}
      />
    </div>
  );
}
```

### **4. Uso del Hook Personalizado**

```tsx
import { useFacebookPixel } from '@/hooks/useFacebookPixel';

export default function MiComponente() {
  const { 
    trackCourseView, 
    trackPurchase, 
    trackPremiumUpgrade,
    isUserLoggedIn 
  } = useFacebookPixel();

  const handleCourseClick = () => {
    trackCourseView({
      course_id: 'curso-123',
      course_name: 'Desarrollo Web Fullstack'
    });
  };

  const handlePurchase = () => {
    trackPurchase({
      course_id: 'curso-123',
      course_name: 'Desarrollo Web Fullstack',
      value: 99.99,
      currency: 'USD'
    });
  };

  const handlePremiumUpgrade = () => {
    trackPremiumUpgrade({
      plan_type: 'monthly',
      value: 29.99,
      currency: 'USD'
    });
  };

  return (
    <div>
      <button onClick={handleCourseClick}>Ver Curso</button>
      <button onClick={handlePurchase}>Comprar</button>
      <button onClick={handlePremiumUpgrade}>Upgrade Premium</button>
    </div>
  );
}
```

---

## 📊 **Eventos Disponibles**

### **Eventos de Autenticación**
```tsx
// Registro de usuario
trackRegistration(email?: string);

// Login de usuario
trackLogin();
```

### **Eventos de Cursos**
```tsx
// Visualización de curso
trackCourseView({ course_id, course_name });

// Lección completada
trackLessonComplete({ 
  course_id, 
  lesson_id, 
  lesson_name, 
  progress_percentage 
});

// Certificado obtenido
trackCertificateEarned({ 
  course_id, 
  course_name, 
  certificate_id 
});
```

### **Eventos de Membresía y Pagos**
```tsx
// Upgrade a premium
trackPremiumUpgrade({ 
  plan_type: 'monthly' | 'yearly',
  value: number,
  currency?: string 
});

// Compra de curso
trackPurchase({ 
  course_id, 
  course_name, 
  value: number,
  currency?: string 
});

// Agregar al carrito
trackAddToCart({ 
  course_id, 
  course_name, 
  value: number,
  currency?: string 
});
```

### **Eventos de Comunidad**
```tsx
// Unirse a comunidad
trackCommunityJoin('forum' | 'webinar' | 'event');

// Registrarse a webinar
trackWebinarRegistration({ 
  webinar_id, 
  webinar_name 
});
```

### **Eventos de Engagement**
```tsx
// Descargar recurso
trackResourceDownload({ 
  resource_id, 
  resource_name, 
  resource_type 
});

// Ver video
trackVideoWatch({ 
  video_id, 
  video_name, 
  course_id?, 
  watch_duration 
});
```

---

## 🎯 **Implementación en Páginas Específicas**

### **Página de Comunidad**
```tsx
// En src/app/community/page.tsx
import FacebookPixelTracker from '@/components/analytics/FacebookPixelTracker';

export default function CommunityPage() {
  return (
    <>
      <FacebookPixelTracker 
        trackPageView={true}
        pageData={{
          content_name: 'Comunidad eGrow',
          content_category: 'Comunidad',
          content_type: 'community_page'
        }}
        customEvents={[
          {
            event: 'ViewContent',
            data: {
              content_name: 'Comunidad eGrow',
              content_category: 'Community'
            }
          }
        ]}
      />
      
      {/* Resto del contenido */}
    </>
  );
}
```

### **Página de Cursos**
```tsx
// En cualquier página de curso
import { CourseTracker } from '@/components/analytics/FacebookPixelTracker';

export default function CursoPage({ curso }) {
  return (
    <>
      <CourseTracker 
        courseId={curso.id}
        courseName={curso.nombre}
        courseValue={curso.precio}
      />
      
      {/* Resto del contenido */}
    </>
  );
}
```

### **Página de Login/Registro**
```tsx
// En src/app/login/page.tsx o register/page.tsx
import FacebookPixelTracker from '@/components/analytics/FacebookPixelTracker';

export default function LoginPage() {
  return (
    <>
      <FacebookPixelTracker 
        trackPageView={true}
        trackUserLogin={true}
        pageData={{
          content_name: 'Login eGrow Academy',
          content_category: 'Autenticación',
          content_type: 'login_page'
        }}
      />
      
      {/* Resto del contenido */}
    </>
  );
}
```

---

## 🔧 **Configuración Avanzada**

### **Variables de Entorno**
```env
# En .env.local
NEXT_PUBLIC_FACEBOOK_PIXEL_ID="1247652460159167"
```

### **Eventos Personalizados**
```tsx
// Crear eventos personalizados
const { trackEvent } = useFacebookPixel();

trackEvent('CustomEvent', {
  content_name: 'Evento Personalizado',
  content_category: 'Custom',
  custom_parameters: {
    custom_param_1: 'valor1',
    custom_param_2: 'valor2'
  }
});
```

### **Funnel de Conversión**
```tsx
// Tracking de funnel completo
const { trackFunnel } = useFacebookPixel();

// Paso 1: Visualización
trackFunnel('view', {
  content_name: 'Curso de IA',
  content_category: 'Course'
});

// Paso 2: Interés
trackFunnel('interest', {
  content_name: 'Curso de IA',
  content_category: 'Course'
});

// Paso 3: Registro
trackFunnel('registration', {
  content_name: 'Curso de IA',
  content_category: 'Course'
});

// Paso 4: Compra
trackFunnel('purchase', {
  content_name: 'Curso de IA',
  content_category: 'Course',
  value: 99.99,
  currency: 'USD'
});
```

---

## 📈 **Audiencias Recomendadas**

### **Audiencia de Conversión**
- Usuarios que completan registro
- Usuarios que hacen login
- Usuarios que ven cursos específicos

### **Audiencia de Engagement**
- Usuarios que completan lecciones
- Usuarios que obtienen certificados
- Usuarios que participan en comunidad

### **Audiencia de Compra**
- Usuarios que agregan cursos al carrito
- Usuarios que hacen upgrade a premium
- Usuarios que compran cursos específicos

### **Audiencia de Retención**
- Usuarios que regresan regularmente
- Usuarios que completan múltiples cursos
- Usuarios que participan activamente

---

## 🧪 **Testing y Validación**

### **Verificar Implementación**
1. Abrir DevTools (F12)
2. Ir a la pestaña Network
3. Filtrar por "facebook"
4. Navegar por la página
5. Verificar que se envían eventos a Facebook

### **Facebook Pixel Helper**
1. Instalar extensión "Facebook Pixel Helper"
2. Navegar por el sitio
3. Verificar eventos en la extensión
4. Validar datos enviados

### **Console Logs**
```javascript
// Los eventos se loguean en la consola
console.log('📊 [Facebook Pixel] Evento enviado: PageView', data);
```

### **Dashboard de Analytics**
1. Ir a `/admin/facebook-analytics`
2. Ver métricas en tiempo real
3. Exportar datos para análisis
4. Verificar funnel de conversión

---

## 🚨 **Consideraciones de Privacidad**

### **GDPR Compliance**
- Los eventos solo se envían si el usuario está logueado
- No se envían datos personales sin consentimiento
- Se respeta la configuración de cookies del usuario

### **Configuración de Cookies**
- Verificar configuración en `src/app/politica-privacidad/page.tsx`
- Actualizar política de privacidad si es necesario
- Implementar banner de cookies si se requiere

---

## 📋 **Checklist de Implementación**

### **✅ Completado**
- [x] Script base implementado en layout.tsx
- [x] Servicio de tracking creado
- [x] Hook personalizado disponible
- [x] Componentes de tracking creados
- [x] Sistema de analytics implementado
- [x] Dashboard de estadísticas creado
- [x] Documentación completa

### **🔄 Pendiente de Implementar**
- [ ] Integrar en páginas específicas
- [ ] Configurar audiencias en Facebook Ads
- [ ] Implementar eventos en formularios
- [ ] Testing en producción
- [ ] Optimización de conversión

---

## 🎯 **Próximos Pasos**

1. **Implementar en páginas clave:**
   - Página principal ✅
   - Páginas de cursos
   - Páginas de login/registro
   - Páginas de pago

2. **Configurar audiencias en Facebook Ads:**
   - Crear audiencias personalizadas
   - Configurar campañas de retargeting
   - Optimizar para conversión

3. **Testing y optimización:**
   - Validar eventos en producción
   - Optimizar funnel de conversión
   - A/B testing de campañas

4. **Análisis y reporting:**
   - Configurar dashboard de Facebook Analytics
   - Crear reportes de conversión
   - Optimizar ROI de campañas

---

## 📞 **Soporte**

Para dudas o problemas con Facebook Pixel:
- Revisar logs en consola del navegador
- Verificar configuración en Facebook Ads Manager
- Consultar documentación oficial de Facebook Pixel
- Contactar al equipo de desarrollo 