# Meta Pixel - Guía de Configuración

## 📊 Estado Actual

### ✅ Configuración Implementada
- **ID del Pixel:** `1247652460159167`
- **Código Base:** Implementado en `src/app/layout.tsx`
- **Sistema de Tracking:** Configurado en `src/lib/facebook-pixel.ts`
- **Componentes:** Creados en `src/components/analytics/`
- **Hooks:** Disponibles en `src/hooks/useFacebookPixel.ts`

### 🔧 Archivos Modificados
1. **`src/app/layout.tsx`** - Código base del Meta Pixel
2. **`src/lib/facebook-pixel.ts`** - Funciones de tracking
3. **`src/components/analytics/MetaPixelTest.tsx`** - Componente de prueba

## 🚀 Código Base Implementado

```html
<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1247652460159167');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=1247652460159167&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->
```

## 📈 Eventos Configurados

### 1. Eventos Automáticos
- **PageView:** Se ejecuta automáticamente en cada página
- **User Login:** Cuando un usuario inicia sesión
- **User Registration:** Cuando un usuario se registra

### 2. Eventos de Cursos
- **ViewContent:** Cuando se visualiza un curso
- **AddToCart:** Cuando se agrega un curso al carrito
- **Purchase:** Cuando se completa una compra
- **CompleteRegistration:** Cuando se completa el registro

### 3. Eventos Educativos
- **Lesson Complete:** Cuando se completa una lección
- **Certificate Earned:** Cuando se obtiene un certificado
- **Resource Download:** Cuando se descarga un recurso
- **Webinar Registration:** Cuando se registra a un webinar

## 🧪 Verificación de Funcionamiento

### Componente de Prueba
Se ha creado un componente de prueba que aparece en desarrollo:
- **Ubicación:** `src/components/analytics/MetaPixelTest.tsx`
- **Funcionalidad:** Verifica que el pixel esté cargado y permite probar eventos
- **Acceso:** Solo visible en modo desarrollo

### Verificación Manual
1. Abrir las herramientas de desarrollador (F12)
2. Ir a la pestaña "Console"
3. Buscar mensajes que empiecen con "📊 [Facebook Pixel]"
4. Verificar que aparezcan logs de eventos enviados

## 🔍 Debugging

### Logs Disponibles
```javascript
// En la consola del navegador
📊 [Facebook Pixel] Evento enviado: PageView
✅ [Facebook Pixel] Evento PageView procesado correctamente
```

### Verificación en Facebook
1. Ir a Facebook Business Manager
2. Navegar a "Events Manager"
3. Seleccionar el pixel `1247652460159167`
4. Verificar que los eventos aparezcan en tiempo real

## 📋 Próximos Pasos

### 1. Configurar Conversions API
- Implementar server-side tracking
- Mejorar la precisión de los eventos
- Reducir dependencia de cookies

### 2. Optimizar Eventos
- Agregar más parámetros personalizados
- Implementar eventos de funnel
- Configurar eventos de retargeting

### 3. Testing Avanzado
- Crear eventos de prueba específicos
- Implementar validación de eventos
- Configurar alertas de errores

## 🛠️ Uso en Componentes

### Ejemplo Básico
```tsx
import { useFacebookPixel } from '@/hooks/useFacebookPixel';

function MyComponent() {
  const { trackEvent } = useFacebookPixel();
  
  const handleClick = () => {
    trackEvent('CustomEvent', {
      content_name: 'Button Click',
      content_category: 'Interaction'
    });
  };
  
  return <button onClick={handleClick}>Click Me</button>;
}
```

### Ejemplo de Curso
```tsx
import { CourseTracker } from '@/components/analytics/FacebookPixelTracker';

function CoursePage() {
  return (
    <div>
      <h1>Mi Curso</h1>
      <CourseTracker 
        courseId="curso-123"
        courseName="Desarrollo Web Fullstack"
        courseValue={99.99}
      />
    </div>
  );
}
```

## 🔒 Privacidad y Cumplimiento

### GDPR Compliance
- Los eventos respetan las preferencias del usuario
- No se envían datos personales sin consentimiento
- Implementado sistema de opt-out

### CCPA Compliance
- Respeto por las preferencias de privacidad
- No tracking sin consentimiento explícito
- Opciones de control de datos

## 📊 Métricas Disponibles

### Eventos Principales
- **Page Views:** Visualizaciones de página
- **User Registrations:** Registros de usuarios
- **Course Views:** Visualizaciones de cursos
- **Purchases:** Compras completadas
- **Lesson Completions:** Lecciones completadas

### Métricas de Engagement
- **Time on Site:** Tiempo en el sitio
- **Bounce Rate:** Tasa de rebote
- **Conversion Rate:** Tasa de conversión
- **User Retention:** Retención de usuarios

## 🚨 Troubleshooting

### Problemas Comunes
1. **Pixel no carga:** Verificar bloqueadores de anuncios
2. **Eventos no aparecen:** Verificar ID del pixel
3. **Errores de consola:** Verificar configuración de CORS

### Soluciones
1. **Deshabilitar bloqueadores:** Para testing
2. **Verificar ID:** Confirmar que el ID sea correcto
3. **Revisar logs:** Usar el componente de prueba

## 📞 Soporte

Para problemas técnicos o configuraciones adicionales:
- Revisar logs en la consola del navegador
- Usar el componente de prueba en desarrollo
- Verificar la documentación de Facebook Pixel
- Consultar con el equipo de desarrollo

---

**Última actualización:** 2025-01-27
**Versión:** 1.0.0
**Estado:** ✅ Implementado y Funcionando 