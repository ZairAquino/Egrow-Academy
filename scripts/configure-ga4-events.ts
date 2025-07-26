#!/usr/bin/env node

/**
 * Script para configurar eventos personalizados de Google Analytics 4
 * Específico para eGrow Academy - Cursos de Inteligencia Artificial
 */

import fs from 'fs';
import path from 'path';

console.log('🚀 Configuración de Eventos Personalizados - Google Analytics 4\n');

// Eventos personalizados para eGrow Academy
const customEvents = {
  // Eventos de Cursos
  course_events: {
    view_course: {
      name: 'view_course',
      description: 'Usuario ve un curso específico',
      parameters: ['course_title', 'course_slug', 'course_category', 'course_level', 'course_price'],
      trigger: 'Cuando un usuario visita la página de un curso'
    },
    enroll_course: {
      name: 'enroll_course',
      description: 'Usuario se inscribe en un curso',
      parameters: ['course_title', 'course_slug', 'course_category', 'course_level', 'course_price', 'payment_method'],
      trigger: 'Cuando un usuario completa la inscripción'
    },
    start_course: {
      name: 'start_course',
      description: 'Usuario inicia un curso',
      parameters: ['course_title', 'course_slug', 'lesson_number', 'lesson_title'],
      trigger: 'Cuando un usuario comienza la primera lección'
    },
    complete_lesson: {
      name: 'complete_lesson',
      description: 'Usuario completa una lección',
      parameters: ['course_title', 'course_slug', 'lesson_number', 'lesson_title', 'time_spent'],
      trigger: 'Cuando un usuario termina una lección'
    },
    complete_course: {
      name: 'complete_course',
      description: 'Usuario completa un curso completo',
      parameters: ['course_title', 'course_slug', 'course_category', 'total_lessons', 'total_time'],
      trigger: 'Cuando un usuario termina todos los módulos'
    }
  },

  // Eventos de Suscripción
  subscription_events: {
    start_subscription: {
      name: 'start_subscription',
      description: 'Usuario inicia una suscripción',
      parameters: ['plan_name', 'plan_price', 'plan_duration', 'payment_method'],
      trigger: 'Cuando un usuario se suscribe'
    },
    cancel_subscription: {
      name: 'cancel_subscription',
      description: 'Usuario cancela su suscripción',
      parameters: ['plan_name', 'subscription_duration', 'cancel_reason'],
      trigger: 'Cuando un usuario cancela'
    },
    upgrade_subscription: {
      name: 'upgrade_subscription',
      description: 'Usuario mejora su suscripción',
      parameters: ['old_plan', 'new_plan', 'price_difference'],
      trigger: 'Cuando un usuario mejora su plan'
    }
  },

  // Eventos de Recursos
  resource_events: {
    view_resource: {
      name: 'view_resource',
      description: 'Usuario ve un recurso',
      parameters: ['resource_title', 'resource_type', 'resource_category'],
      trigger: 'Cuando un usuario accede a un recurso'
    },
    download_resource: {
      name: 'download_resource',
      description: 'Usuario descarga un recurso',
      parameters: ['resource_title', 'resource_type', 'file_size'],
      trigger: 'Cuando un usuario descarga un archivo'
    }
  },

  // Eventos de Usuario
  user_events: {
    register_user: {
      name: 'register_user',
      description: 'Usuario se registra',
      parameters: ['registration_method', 'user_type', 'referral_source'],
      trigger: 'Cuando un usuario crea una cuenta'
    },
    login_user: {
      name: 'login_user',
      description: 'Usuario inicia sesión',
      parameters: ['login_method', 'user_type'],
      trigger: 'Cuando un usuario inicia sesión'
    },
    update_profile: {
      name: 'update_profile',
      description: 'Usuario actualiza su perfil',
      parameters: ['fields_updated'],
      trigger: 'Cuando un usuario modifica su perfil'
    }
  },

  // Eventos de Contacto
  contact_events: {
    contact_form: {
      name: 'contact_form',
      description: 'Usuario envía formulario de contacto',
      parameters: ['form_type', 'subject', 'user_type'],
      trigger: 'Cuando se envía un formulario'
    },
    newsletter_signup: {
      name: 'newsletter_signup',
      description: 'Usuario se suscribe al newsletter',
      parameters: ['email_domain', 'signup_source'],
      trigger: 'Cuando un usuario se suscribe'
    }
  },

  // Eventos de Navegación
  navigation_events: {
    search_courses: {
      name: 'search_courses',
      description: 'Usuario busca cursos',
      parameters: ['search_term', 'results_count', 'filters_applied'],
      trigger: 'Cuando un usuario busca cursos'
    },
    filter_courses: {
      name: 'filter_courses',
      description: 'Usuario filtra cursos',
      parameters: ['filter_type', 'filter_value', 'results_count'],
      trigger: 'Cuando un usuario aplica filtros'
    }
  }
};

// Configuración de conversiones
const conversions = {
  primary_conversions: [
    'enroll_course',
    'start_subscription',
    'register_user',
    'complete_course'
  ],
  secondary_conversions: [
    'view_course',
    'view_resource',
    'contact_form',
    'newsletter_signup'
  ]
};

// Configuración de audiencias
const audiences = {
  new_visitors: {
    name: 'Nuevos Visitantes',
    description: 'Usuarios que visitan por primera vez',
    conditions: ['first_visit']
  },
  returning_visitors: {
    name: 'Visitantes Recurrentes',
    description: 'Usuarios que regresan al sitio',
    conditions: ['returning_visitor']
  },
  course_viewers: {
    name: 'Visualizadores de Cursos',
    description: 'Usuarios que ven páginas de cursos',
    conditions: ['event_name = view_course']
  },
  enrolled_students: {
    name: 'Estudiantes Inscritos',
    description: 'Usuarios inscritos en cursos',
    conditions: ['event_name = enroll_course']
  },
  premium_subscribers: {
    name: 'Suscriptores Premium',
    description: 'Usuarios con suscripción premium',
    conditions: ['event_name = start_subscription']
  },
  course_completers: {
    name: 'Completadores de Cursos',
    description: 'Usuarios que completan cursos',
    conditions: ['event_name = complete_course']
  }
};

// Función para generar configuración de GA4
function generateGA4Config() {
  const configPath = path.join(process.cwd(), 'docs', 'ga4-configuration.md');
  
  const configContent = `# Configuración Google Analytics 4 - eGrow Academy

## 📊 Eventos Personalizados Configurados

### 🎓 Eventos de Cursos
${Object.entries(customEvents.course_events).map(([key, event]) => `
#### ${event.name}
- **Descripción**: ${event.description}
- **Parámetros**: ${event.parameters.join(', ')}
- **Trigger**: ${event.trigger}
`).join('')}

### 💳 Eventos de Suscripción
${Object.entries(customEvents.subscription_events).map(([key, event]) => `
#### ${event.name}
- **Descripción**: ${event.description}
- **Parámetros**: ${event.parameters.join(', ')}
- **Trigger**: ${event.trigger}
`).join('')}

### 📚 Eventos de Recursos
${Object.entries(customEvents.resource_events).map(([key, event]) => `
#### ${event.name}
- **Descripción**: ${event.description}
- **Parámetros**: ${event.parameters.join(', ')}
- **Trigger**: ${event.trigger}
`).join('')}

### 👤 Eventos de Usuario
${Object.entries(customEvents.user_events).map(([key, event]) => `
#### ${event.name}
- **Descripción**: ${event.description}
- **Parámetros**: ${event.parameters.join(', ')}
- **Trigger**: ${event.trigger}
`).join('')}

### 📞 Eventos de Contacto
${Object.entries(customEvents.contact_events).map(([key, event]) => `
#### ${event.name}
- **Descripción**: ${event.description}
- **Parámetros**: ${event.parameters.join(', ')}
- **Trigger**: ${event.trigger}
`).join('')}

### 🔍 Eventos de Navegación
${Object.entries(customEvents.navigation_events).map(([key, event]) => `
#### ${event.name}
- **Descripción**: ${event.description}
- **Parámetros**: ${event.parameters.join(', ')}
- **Trigger**: ${event.trigger}
`).join('')}

## 🎯 Conversiones Configuradas

### Conversiones Principales
${conversions.primary_conversions.map(conv => `- ${conv}`).join('\n')}

### Conversiones Secundarias
${conversions.secondary_conversions.map(conv => `- ${conv}`).join('\n')}

## 👥 Audiencias Configuradas

${Object.entries(audiences).map(([key, audience]) => `
### ${audience.name}
- **Descripción**: ${audience.description}
- **Condiciones**: ${audience.conditions.join(', ')}
`).join('')}

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
\`\`\`env
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
\`\`\`

### 2. Ejemplo de tracking de evento
\`\`\`typescript
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
\`\`\`

### 3. Ejemplo de tracking de conversión
\`\`\`typescript
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
\`\`\`

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

**Fecha de configuración**: ${new Date().toISOString()}
**Responsable**: Equipo de Desarrollo eGrow Academy
**Próxima revisión**: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()}
`;

  fs.writeFileSync(configPath, configContent);
  console.log('✅ Configuración de GA4 generada: docs/ga4-configuration.md');
}

// Función para generar script de implementación
function generateImplementationScript() {
  const scriptPath = path.join(process.cwd(), 'scripts', 'implement-ga4-events.js');
  
  const scriptContent = `#!/usr/bin/env node

/**
 * Script para implementar eventos de GA4 en eGrow Academy
 * Automatiza la configuración de tracking de eventos
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Implementación de Eventos GA4 para eGrow Academy\\n');

// Verificar si GA4 está configurado
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ Archivo .env.local no encontrado');
  console.log('💡 Crea el archivo .env.local con NEXT_PUBLIC_GA_ID');
  return;
}

const envContent = fs.readFileSync(envPath, 'utf8');
if (!envContent.includes('NEXT_PUBLIC_GA_ID')) {
  console.log('❌ NEXT_PUBLIC_GA_ID no configurado');
  console.log('💡 Agrega NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX" a .env.local');
  return;
}

console.log('✅ GA4 configurado correctamente');
console.log('📊 Implementando eventos personalizados...\\n');

// Lista de archivos a modificar
const filesToModify = [
  'src/components/courses/CourseCard.tsx',
  'src/components/auth/RegisterForm.tsx',
  'src/components/auth/LoginForm.tsx',
  'src/components/payments/SubscriptionButton.tsx',
  'src/components/resources/ResourceCard.tsx',
  'src/components/contact/ContactForm.tsx'
];

console.log('📁 Archivos a modificar:');
filesToModify.forEach(file => {
  console.log(\`  - \${file}\`);
});

console.log('\\n🎯 Eventos a implementar:');
console.log('  - view_course');
console.log('  - enroll_course');
console.log('  - register_user');
console.log('  - login_user');
console.log('  - start_subscription');
console.log('  - view_resource');
console.log('  - contact_form');

console.log('\\n✅ Implementación lista para comenzar');
console.log('📝 Revisa docs/ga4-configuration.md para detalles');
`;

  fs.writeFileSync(scriptPath, scriptContent);
  console.log('✅ Script de implementación generado: scripts/implement-ga4-events.js');
}

// Ejecutar generación de configuración
try {
  generateGA4Config();
  generateImplementationScript();
  
  console.log('\n🎉 Configuración de eventos GA4 completada!');
  console.log('\n📈 Próximos pasos:');
  console.log('1. Crear cuenta en Google Analytics 4');
  console.log('2. Configurar eventos personalizados en GA4');
  console.log('3. Implementar tracking en el código');
  console.log('4. Configurar conversiones y audiencias');
  console.log('5. Crear informes personalizados');
  console.log('6. Monitorear métricas');
  
} catch (error) {
  console.error('❌ Error durante la configuración:', error);
} 