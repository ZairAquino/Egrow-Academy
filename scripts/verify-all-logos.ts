import fs from 'fs';
import path from 'path';

console.log('🔍 VERIFICANDO LOGOS EN TODA LA PLATAFORMA');
console.log('==========================================');
console.log('');

const filesToCheck = [
  'src/components/layout/Hero.tsx',
  'src/components/layout/Sidebar.tsx',
  'src/components/layout/Footer.tsx',
  'src/app/subscription/page.tsx',
  'src/app/payment/success/page.tsx',
  'src/app/certificate/[courseId]/page.tsx',
  'src/app/login/page.tsx',
  'src/app/register/page.tsx',
  'src/app/verify-email/page.tsx'
];

let allUpdated = true;
let updatedCount = 0;

filesToCheck.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    
    if (content.includes('eGrowAcademylogo.png')) {
      console.log(`✅ ${filePath} - Logo actualizado`);
      updatedCount++;
    } else if (content.includes('eacademylogo.png')) {
      console.log(`⚠️  ${filePath} - Usa logo anterior (eacademylogo.png)`);
      allUpdated = false;
    } else if (content.includes('Logo2.png')) {
      console.log(`❌ ${filePath} - Usa logo muy anterior (Logo2.png)`);
      allUpdated = false;
    } else if (content.includes('🎓 eGrow Academy')) {
      console.log(`⚠️  ${filePath} - Usa emoji en lugar de logo`);
      allUpdated = false;
    } else {
      console.log(`ℹ️  ${filePath} - No tiene logo`);
    }
  } else {
    console.log(`❌ ${filePath} - Archivo no encontrado`);
    allUpdated = false;
  }
});

console.log('');
console.log('📊 RESUMEN:');
console.log('===========');
console.log(`Archivos verificados: ${filesToCheck.length}`);
console.log(`Archivos actualizados: ${updatedCount}`);
console.log(`Archivos pendientes: ${filesToCheck.length - updatedCount}`);

if (allUpdated) {
  console.log('');
  console.log('🎉 ¡TODOS LOS LOGOS ESTÁN ACTUALIZADOS!');
  console.log('========================================');
  console.log('');
  console.log('✅ El logo eGrowAcademylogo.png se aplicó en:');
  console.log('   • Hero (página principal)');
  console.log('   • Sidebar (menú lateral)');
  console.log('   • Footer (pie de página)');
  console.log('   • Páginas de autenticación (login, registro)');
  console.log('   • Páginas de pago y suscripción');
  console.log('   • Páginas de certificados');
  console.log('   • Páginas de verificación');
} else {
  console.log('');
  console.log('⚠️  HAY ARCHIVOS PENDIENTES DE ACTUALIZAR');
  console.log('=========================================');
  console.log('');
  console.log('Revisa los archivos marcados con ⚠️ o ❌ arriba');
}

console.log('');
console.log('🚀 PARA VER LOS CAMBIOS:');
console.log('------------------------');
console.log('1. Recarga todas las páginas del navegador (Ctrl+F5)');
console.log('2. Navega por diferentes secciones de la plataforma');
console.log('3. Verifica que el logo se ve consistente en todas partes');
console.log('4. Confirma que el tamaño es apropiado en cada contexto'); 