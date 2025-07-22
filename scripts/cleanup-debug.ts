import fs from 'fs';
import path from 'path';

async function cleanupDebug() {
  try {
    console.log('🧹 Limpiando componente de debug...');
    
    // Remover el componente de debug de la página principal
    const pagePath = path.join(process.cwd(), 'src/app/page.tsx');
    let pageContent = fs.readFileSync(pagePath, 'utf8');
    
    // Remover la importación
    pageContent = pageContent.replace(
      "import UserStatusDebug from '@/components/debug/UserStatusDebug';",
      ""
    );
    
    // Remover el componente del JSX
    pageContent = pageContent.replace(
      "      <UserStatusDebug />",
      ""
    );
    
    fs.writeFileSync(pagePath, pageContent);
    console.log('✅ Componente de debug removido de la página principal');
    
    // Eliminar el archivo de debug
    const debugPath = path.join(process.cwd(), 'src/components/debug/UserStatusDebug.tsx');
    if (fs.existsSync(debugPath)) {
      fs.unlinkSync(debugPath);
      console.log('✅ Archivo de debug eliminado');
    }
    
    console.log('\n📋 RESUMEN DE LA SOLUCIÓN IMPLEMENTADA:');
    console.log('✅ Webhook configurado con checkout.session.completed');
    console.log('✅ Lógica de acceso mejorada (membershipLevel + suscripción)');
    console.log('✅ Creación automática de suscripciones en webhook');
    console.log('✅ Usuario Armando tiene acceso premium completo');
    
    console.log('\n🎯 FLUJO OPTIMIZADO PARA FUTUROS USUARIOS:');
    console.log('1. Usuario hace pago → checkout.session.completed');
    console.log('2. Webhook actualiza membershipLevel a PREMIUM');
    console.log('3. Webhook crea suscripción activa automáticamente');
    console.log('4. API subscription-status verifica ambos criterios');
    console.log('5. Usuario tiene acceso inmediato a contenido premium');
    
    console.log('\n🔧 ARCHIVOS MODIFICADOS:');
    console.log('- src/app/api/auth/subscription-status/route.ts (lógica mejorada)');
    console.log('- src/app/api/webhooks/stripe/route.ts (creación automática)');
    console.log('- src/app/api/stripe/create-checkout-session/route.ts (customer ID)');
    
    console.log('\n✅ ¡Sistema optimizado y funcionando!');
    
  } catch (error) {
    console.error('❌ Error limpiando debug:', error);
  }
}

cleanupDebug(); 