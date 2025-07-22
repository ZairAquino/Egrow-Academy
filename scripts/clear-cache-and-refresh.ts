import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function clearCacheAndRefresh() {
  try {
    console.log('🧹 Limpiando caché y forzando refresh...');
    
    // Verificar estado en BD
    const user = await prisma.user.findUnique({
      where: { email: 'Armando@gmail.com' },
      select: {
        email: true,
        membershipLevel: true,
        updatedAt: true
      }
    });
    
    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }
    
    console.log('📊 Estado en BD:', user.membershipLevel);
    console.log('📊 Última actualización:', user.updatedAt.toLocaleString());
    
    console.log('\n🎯 Pasos para limpiar caché:');
    console.log('1. Abre la consola del navegador (F12)');
    console.log('2. Ve a la pestaña "Application" o "Aplicación"');
    console.log('3. En el panel izquierdo, busca "Storage" o "Almacenamiento"');
    console.log('4. Haz clic derecho en "Local Storage" y "Session Storage"');
    console.log('5. Selecciona "Clear" o "Limpiar"');
    console.log('6. O ejecuta en la consola:');
    console.log('   localStorage.clear()');
    console.log('   sessionStorage.clear()');
    console.log('7. Recarga la página (Ctrl+Shift+R para hard refresh)');
    
    console.log('\n🔍 Alternativa más rápida:');
    console.log('1. Cierra sesión');
    console.log('2. Cierra el navegador completamente');
    console.log('3. Abre el navegador nuevamente');
    console.log('4. Ve a http://localhost:3000');
    console.log('5. Inicia sesión con Armando@gmail.com');
    
    console.log('\n✅ Después del refresh, verifica:');
    console.log('- El panel de debug muestra PREMIUM en verde');
    console.log('- Los cursos premium muestran "Premium" en lugar de "Requiere Premium"');
    console.log('- Puedes hacer clic en "Comenzar Curso"');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearCacheAndRefresh(); 