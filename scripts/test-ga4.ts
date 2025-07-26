#!/usr/bin/env node

/**
 * Script para verificar que Google Analytics 4 esté funcionando
 * en eGrow Academy
 */

import fs from 'fs';
import path from 'path';

console.log('🚀 Verificación de Google Analytics 4 - eGrow Academy\n');

// Verificar archivo .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ Archivo .env.local no encontrado');
  console.log('💡 Crea el archivo .env.local con tu ID de GA4');
  console.log('   NEXT_PUBLIC_GA_ID="G-RSHD1HL9R0"');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const gaIdMatch = envContent.match(/NEXT_PUBLIC_GA_ID="([^"]+)"/);

if (!gaIdMatch) {
  console.log('❌ NEXT_PUBLIC_GA_ID no encontrado en .env.local');
  console.log('💡 Agrega: NEXT_PUBLIC_GA_ID="G-RSHD1HL9R0"');
  process.exit(1);
}

const gaId = gaIdMatch[1];
console.log(`✅ ID de GA4 encontrado: ${gaId}`);

// Verificar que el ID tenga el formato correcto
if (!gaId.startsWith('G-')) {
  console.log('❌ Formato de ID incorrecto');
  console.log('💡 El ID debe comenzar con "G-"');
  process.exit(1);
}

console.log('✅ Formato de ID correcto');

// Verificar componentes de analytics
const analyticsPath = path.join(process.cwd(), 'src', 'components', 'seo', 'Analytics.tsx');
if (!fs.existsSync(analyticsPath)) {
  console.log('❌ Componente Analytics.tsx no encontrado');
  process.exit(1);
}

console.log('✅ Componente Analytics.tsx encontrado');

// Verificar hook de analytics
const hookPath = path.join(process.cwd(), 'src', 'hooks', 'useAnalytics.ts');
if (!fs.existsSync(hookPath)) {
  console.log('❌ Hook useAnalytics.ts no encontrado');
  process.exit(1);
}

console.log('✅ Hook useAnalytics.ts encontrado');

// Verificar que Analytics esté en layout
const layoutPath = path.join(process.cwd(), 'src', 'app', 'layout.tsx');
if (fs.existsSync(layoutPath)) {
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  if (layoutContent.includes('Analytics')) {
    console.log('✅ Componente Analytics incluido en layout');
  } else {
    console.log('⚠️  Componente Analytics no encontrado en layout');
  }
}

// Generar instrucciones de verificación
const verificationInstructions = `
## 🔍 Verificación Manual de GA4

### 1. Verificar en el Navegador
1. Abre https://egrow-academy.com
2. Abre DevTools (F12)
3. Ve a la pestaña "Console"
4. Busca mensajes de Google Analytics
5. No debe haber errores relacionados con GA4

### 2. Verificar en Google Analytics
1. Ve a https://analytics.google.com/
2. Selecciona tu propiedad "eGrow Academy Web"
3. Ve a "Informes" > "Tiempo real"
4. Deberías ver actividad en tiempo real

### 3. Verificar Eventos
1. En Google Analytics, ve a "Informes" > "Engagement" > "Events"
2. Deberías ver eventos como:
   - page_view
   - course_view
   - cta_click

### 4. Verificar en Google Tag Assistant
1. Instala la extensión "Google Tag Assistant Legacy"
2. Activa el modo de depuración
3. Navega por tu sitio
4. Verifica que GA4 esté funcionando

## 📊 Eventos que Deberías Ver

### Eventos Automáticos:
- page_view (automático)
- scroll (si está habilitado)
- click (enlaces externos)

### Eventos Personalizados:
- course_view (al ver un curso)
- cta_click (al hacer clic en CTA)
- user_register (al registrarse)
- user_login (al iniciar sesión)

## 🛠️ Comandos de Verificación

\`\`\`bash
# Verificar que el servidor esté corriendo
npm run dev

# En otra terminal, verificar analytics
node scripts/test-ga4.ts

# Verificar configuración SEO
npm run seo-analysis
\`\`\`

## 📝 Notas Importantes

- **Tiempo de propagación**: Los datos pueden tardar hasta 24-48 horas en aparecer
- **Modo de depuración**: Usa Google Tag Assistant para verificar en tiempo real
- **Privacidad**: Asegúrate de cumplir con GDPR/LGPD
- **Consentimiento**: Implementa banner de cookies si es necesario

## 🎯 Próximos Pasos

1. **Verificar en tiempo real**: Usa Google Analytics Real-Time
2. **Configurar conversiones**: Marca eventos importantes como conversiones
3. **Crear audiencias**: Configura segmentos de usuarios
4. **Configurar informes**: Crea informes personalizados
5. **Monitorear métricas**: Revisa métricas semanalmente

---

**ID de GA4 configurado**: ${gaId}
**Fecha de verificación**: ${new Date().toISOString()}
`;

// Guardar instrucciones
const instructionsPath = path.join(process.cwd(), 'docs', 'ga4-verification.md');
fs.writeFileSync(instructionsPath, verificationInstructions);
console.log('✅ Instrucciones de verificación guardadas: docs/ga4-verification.md');

console.log('\n🎉 Verificación de GA4 completada!');
console.log('\n📈 Próximos pasos:');
console.log('1. Ejecuta: npm run dev');
console.log('2. Abre https://egrow-academy.com');
console.log('3. Verifica en Google Analytics Real-Time');
console.log('4. Revisa docs/ga4-verification.md para más detalles');

// Verificar si el servidor está corriendo
console.log('\n🔍 Verificando si el servidor está corriendo...');
try {
  const { exec } = require('child_process');
  exec('netstat -an | findstr :3000', (error: any, stdout: string) => {
    if (stdout.includes('LISTENING')) {
      console.log('✅ Servidor corriendo en puerto 3000');
      console.log('🌐 Abre http://localhost:3000 para probar');
    } else {
      console.log('⚠️  Servidor no está corriendo');
      console.log('💡 Ejecuta: npm run dev');
    }
  });
} catch (error) {
  console.log('⚠️  No se pudo verificar el estado del servidor');
} 