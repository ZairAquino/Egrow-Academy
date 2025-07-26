# Configuración de Google Analytics 4 para eGrow Academy

## 🎯 Objetivo
Configurar Google Analytics 4 para rastrear el comportamiento de usuarios, conversiones y métricas clave para optimizar el SEO y el rendimiento del sitio.

## 📋 Pasos de Configuración

### 1. Crear Cuenta de Google Analytics

1. **Ir a Google Analytics**: https://analytics.google.com/
2. **Crear cuenta**:
   - Nombre de la cuenta: `eGrow Academy`
   - Propósito: Análisis web
3. **Crear propiedad**:
   - Nombre de la propiedad: `eGrow Academy Website`
   - Zona horaria: `America/Mexico_City`
   - Moneda: `MXN (Peso Mexicano)`
4. **Configurar flujo de datos**:
   - Plataforma: `Web`
   - URL del sitio: `https://egrow-academy.com`
   - Nombre del flujo: `eGrow Academy Web`

### 2. Obtener ID de Medición

1. En la configuración de la propiedad, copiar el **ID de medición** (formato: `G-XXXXXXXXXX`)
2. Este ID se usará en las variables de entorno

### 3. Configurar Variables de Entorno

Agregar al archivo `.env.local`:

```env
# Google Analytics 4
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
```

### 4. Eventos Personalizados a Configurar

#### Eventos de Cursos
- `course_view` - Cuando un usuario ve un curso
- `course_enroll` - Cuando un usuario se inscribe
- `course_complete` - Cuando un usuario completa un curso
- `lesson_view` - Cuando un usuario ve una lección
- `video_play` - Cuando se reproduce un video

#### Eventos de Conversión
- `subscription_start` - Cuando inicia una suscripción
- `payment_complete` - Cuando se completa un pago
- `free_trial_start` - Cuando inicia una prueba gratuita
- `download_resource` - Cuando descarga un recurso

#### Eventos de Usuario
- `user_register` - Cuando se registra un usuario
- `user_login` - Cuando inicia sesión
- `search_course` - Cuando busca un curso
- `contact_form_submit` - Cuando envía formulario de contacto

### 5. Configurar Conversiones

En Google Analytics 4:

1. **Ir a Configuración > Eventos**
2. **Marcar como conversión**:
   - `course_enroll`
   - `subscription_start`
   - `payment_complete`
   - `user_register`

### 6. Configurar Audiencias

#### Audiencia de Cursos Gratuitos
- Usuarios que han visto cursos gratuitos
- Usuarios que han descargado recursos gratuitos

#### Audiencia de Cursos Premium
- Usuarios con suscripción activa
- Usuarios que han completado cursos premium

#### Audiencia de Conversión
- Usuarios que han completado al menos una conversión
- Usuarios que han visto más de 3 cursos

### 7. Configurar Informes Personalizados

#### Informe de Rendimiento de Cursos
- Métricas: Usuarios, Sesiones, Tasa de rebote
- Dimensiones: Nombre del curso, Categoría
- Filtros: Evento = `course_view`

#### Informe de Conversiones
- Métricas: Conversiones, Valor de conversión
- Dimensiones: Fuente/Medio, Campaña
- Filtros: Evento de conversión

#### Informe de Usuarios por País
- Métricas: Usuarios activos, Sesiones
- Dimensiones: País, Ciudad
- Filtros: Región = México, Colombia, Argentina, etc.

### 8. Configurar Alertas

#### Alertas de Rendimiento
- Caída de tráfico > 20% en 24 horas
- Caída de conversiones > 15% en 24 horas
- Error 404 > 10 en 1 hora

#### Alertas de SEO
- Nuevas palabras clave en top 10
- Pérdida de posiciones importantes
- Aumento de tráfico orgánico > 50%

### 9. Integración con Google Search Console

1. **Conectar GA4 con GSC**:
   - En GA4: Configuración > Propiedades > Enlaces de Search Console
   - Agregar propiedad de Search Console
2. **Importar datos de búsqueda**:
   - Consultas de búsqueda
   - Páginas de aterrizaje
   - Posiciones en SERP

### 10. Configurar E-commerce (Opcional)

Si se implementa e-commerce:

```javascript
// Evento de compra
gtag('event', 'purchase', {
  transaction_id: 'T_12345',
  value: 999.00,
  currency: 'MXN',
  items: [{
    item_id: 'course_ai_basics',
    item_name: 'Curso Básico de IA',
    price: 999.00,
    quantity: 1
  }]
});
```

## 🔧 Verificación de Configuración

### 1. Verificar Instalación
```bash
# Ejecutar análisis SEO
npm run seo-analysis

# Verificar que GA4 esté cargando
# Abrir DevTools > Network > Filtrar por "google-analytics"
```

### 2. Verificar Eventos
1. Abrir Google Analytics 4
2. Ir a Informes > Tiempo real
3. Realizar acciones en el sitio
4. Verificar que los eventos aparezcan

### 3. Verificar Conversiones
1. Ir a Configuración > Eventos
2. Verificar que los eventos estén marcados como conversión
3. Ir a Informes > Adquisición > Conversiones

## 📊 Métricas Clave a Monitorear

### Métricas de Tráfico
- Usuarios activos diarios/mensuales
- Sesiones por usuario
- Tasa de rebote
- Duración de sesión

### Métricas de Conversión
- Tasa de conversión general
- Tasa de conversión por curso
- Valor promedio de conversión
- Tiempo hasta la conversión

### Métricas de SEO
- Tráfico orgánico
- Palabras clave principales
- Páginas más visitadas
- Tasa de rebote por página

## 🚀 Próximos Pasos

1. **Configurar Google Tag Manager** para gestión avanzada de tags
2. **Implementar eventos personalizados** en componentes específicos
3. **Configurar informes automatizados** por email
4. **Integrar con otras herramientas** (Hotjar, Facebook Pixel)
5. **Optimizar basado en datos** de GA4

## 📝 Notas Importantes

- **GDPR Compliance**: Asegurar que el tracking respete la privacidad
- **Consentimiento**: Implementar banner de cookies si es necesario
- **Backup**: Exportar configuraciones importantes
- **Documentación**: Mantener actualizada esta guía 