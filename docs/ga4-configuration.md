# Configuración Google Analytics 4 - eGrow Academy

## 📊 Eventos Personalizados Configurados

### 🎓 Eventos de Cursos

#### view_course
- **Descripción**: Usuario ve un curso específico
- **Parámetros**: course_title, course_slug, course_category, course_level, course_price
- **Trigger**: Cuando un usuario visita la página de un curso

#### enroll_course
- **Descripción**: Usuario se inscribe en un curso
- **Parámetros**: course_title, course_slug, course_category, course_level, course_price, payment_method
- **Trigger**: Cuando un usuario completa la inscripción

#### start_course
- **Descripción**: Usuario inicia un curso
- **Parámetros**: course_title, course_slug, lesson_number, lesson_title
- **Trigger**: Cuando un usuario comienza la primera lección

#### complete_lesson
- **Descripción**: Usuario completa una lección
- **Parámetros**: course_title, course_slug, lesson_number, lesson_title, time_spent
- **Trigger**: Cuando un usuario termina una lección

#### complete_course
- **Descripción**: Usuario completa un curso completo
- **Parámetros**: course_title, course_slug, course_category, total_lessons, total_time
- **Trigger**: Cuando un usuario termina todos los módulos


### 💳 Eventos de Suscripción

#### start_subscription
- **Descripción**: Usuario inicia una suscripción
- **Parámetros**: plan_name, plan_price, plan_duration, payment_method
- **Trigger**: Cuando un usuario se suscribe

#### cancel_subscription
- **Descripción**: Usuario cancela su suscripción
- **Parámetros**: plan_name, subscription_duration, cancel_reason
- **Trigger**: Cuando un usuario cancela

#### upgrade_subscription
- **Descripción**: Usuario mejora su suscripción
- **Parámetros**: old_plan, new_plan, price_difference
- **Trigger**: Cuando un usuario mejora su plan


### 📚 Eventos de Recursos

#### view_resource
- **Descripción**: Usuario ve un recurso
- **Parámetros**: resource_title, resource_type, resource_category
- **Trigger**: Cuando un usuario accede a un recurso

#### download_resource
- **Descripción**: Usuario descarga un recurso
- **Parámetros**: resource_title, resource_type, file_size
- **Trigger**: Cuando un usuario descarga un archivo


### 👤 Eventos de Usuario

#### register_user
- **Descripción**: Usuario se registra
- **Parámetros**: registration_method, user_type, referral_source
- **Trigger**: Cuando un usuario crea una cuenta

#### login_user
- **Descripción**: Usuario inicia sesión
- **Parámetros**: login_method, user_type
- **Trigger**: Cuando un usuario inicia sesión

#### update_profile
- **Descripción**: Usuario actualiza su perfil
- **Parámetros**: fields_updated
- **Trigger**: Cuando un usuario modifica su perfil


### 📞 Eventos de Contacto

#### contact_form
- **Descripción**: Usuario envía formulario de contacto
- **Parámetros**: form_type, subject, user_type
- **Trigger**: Cuando se envía un formulario

#### newsletter_signup
- **Descripción**: Usuario se suscribe al newsletter
- **Parámetros**: email_domain, signup_source
- **Trigger**: Cuando un usuario se suscribe


### 🔍 Eventos de Navegación

#### search_courses
- **Descripción**: Usuario busca cursos
- **Parámetros**: search_term, results_count, filters_applied
- **Trigger**: Cuando un usuario busca cursos

#### filter_courses
- **Descripción**: Usuario filtra cursos
- **Parámetros**: filter_type, filter_value, results_count
- **Trigger**: Cuando un usuario aplica filtros


## 🎯 Conversiones Configuradas

### Conversiones Principales
- enroll_course
- start_subscription
- register_user
- complete_course

### Conversiones Secundarias
- view_course
- view_resource
- contact_form
- newsletter_signup

## 👥 Audiencias Configuradas


### Nuevos Visitantes
- **Descripción**: Usuarios que visitan por primera vez
- **Condiciones**: first_visit

### Visitantes Recurrentes
- **Descripción**: Usuarios que regresan al sitio
- **Condiciones**: returning_visitor

### Visualizadores de Cursos
- **Descripción**: Usuarios que ven páginas de cursos
- **Condiciones**: event_name = view_course

### Estudiantes Inscritos
- **Descripción**: Usuarios inscritos en cursos
- **Condiciones**: event_name = enroll_course

### Suscriptores Premium
- **Descripción**: Usuarios con suscripción premium
- **Condiciones**: event_name = start_subscription

### Completadores de Cursos
- **Descripción**: Usuarios que completan cursos
- **Condiciones**: event_name = complete_course


## 📈 Métricas de Éxito

### Objetivos a 1 mes:
- **Usuarios únicos**: 1,000+
- **Sesiones**: 3,000+
- **Tasa de rebote**: < 40%
- **Tiempo en página**: > 3 minutos
- **Conversiones**: 50+ inscripciones

### Objetivos a 3 meses:
- **Usuarios únicos**: 5,000+
- **Sesiones**: 15,000+
- **Tasa de rebote**: < 35%
- **Tiempo en página**: > 4 minutos
- **Conversiones**: 200+ inscripciones

### Objetivos a 6 meses:
- **Usuarios únicos**: 15,000+
- **Sesiones**: 45,000+
- **Tasa de rebote**: < 30%
- **Tiempo en página**: > 5 minutos
- **Conversiones**: 500+ inscripciones

## 🛠️ Implementación en Código

### 1. Configurar variables de entorno
```env
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
```

### 2. Ejemplo de tracking de evento
```typescript
// En CourseCard.tsx
const handleCourseView = () => {
  if (window.gtag) {
    window.gtag('event', 'view_course', {
      course_title: course.title,
      course_slug: course.slug,
      course_category: course.category,
      course_level: course.level,
      course_price: course.price
    });
  }
};
```

### 3. Ejemplo de tracking de conversión
```typescript
// En enrollment process
const handleEnrollment = () => {
  if (window.gtag) {
    window.gtag('event', 'enroll_course', {
      course_title: course.title,
      course_slug: course.slug,
      course_category: course.category,
      course_level: course.level,
      course_price: course.price,
      payment_method: 'stripe'
    });
  }
};
```

## 📊 Reportes Recomendados

### 1. Reporte de Rendimiento de Cursos
- Métricas: views, enrollments, completions
- Dimensiones: course_title, course_category, course_level
- Filtros: date_range, user_type

### 2. Reporte de Conversiones
- Métricas: conversion_rate, revenue
- Dimensiones: source, medium, campaign
- Filtros: conversion_type

### 3. Reporte de Comportamiento de Usuario
- Métricas: session_duration, pages_per_session
- Dimensiones: user_type, device_category
- Filtros: user_segment

## 🔧 Configuración en Google Analytics

### 1. Crear Eventos Personalizados
1. Ir a Admin > Events
2. Hacer clic en "Create Event"
3. Configurar cada evento según la lista anterior

### 2. Configurar Conversiones
1. Ir a Admin > Conversions
2. Marcar eventos como conversiones
3. Configurar valores de conversión

### 3. Crear Audiencias
1. Ir a Admin > Audiences
2. Crear audiencias personalizadas
3. Configurar condiciones según la lista

### 4. Configurar Informes Personalizados
1. Ir a Explore
2. Crear informes personalizados
3. Configurar métricas y dimensiones

## 📝 Notas Importantes

- **Privacidad**: Cumplir con GDPR y LGPD
- **Consentimiento**: Implementar banner de cookies
- **Debugging**: Usar Google Analytics Debugger
- **Testing**: Verificar eventos en modo debug
- **Monitoreo**: Revisar métricas semanalmente

## 🎯 Próximos Pasos

1. **Configurar eventos en GA4**
2. **Implementar tracking en código**
3. **Configurar conversiones**
4. **Crear audiencias**
5. **Configurar informes**
6. **Monitorear métricas**

---

**Fecha de configuración**: 2025-07-26T15:30:25.593Z
**Responsable**: Equipo de Desarrollo eGrow Academy
**Próxima revisión**: 2025-08-25T15:30:25.594Z
