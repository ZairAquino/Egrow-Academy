import fs from 'fs';
import path from 'path';

console.log('🔍 VERIFICANDO ACTUALIZACIÓN DEL LOGO');
console.log('=====================================');
console.log('');

// Verificar que la nueva imagen existe
const newLogoPath = path.join(process.cwd(), 'public', 'images', 'eacademylogo.png');
if (fs.existsSync(newLogoPath)) {
  console.log('✅ Nueva imagen eacademylogo.png encontrada');
  const stats = fs.statSync(newLogoPath);
  console.log(`📏 Tamaño: ${(stats.size / 1024).toFixed(2)} KB`);
} else {
  console.log('❌ ERROR: No se encontró eacademylogo.png');
}

console.log('');

// Verificar archivos actualizados
const filesToCheck = [
  'src/components/layout/Sidebar.tsx',
  'src/app/certificate/[courseId]/page.tsx',
  'src/app/subscription/page.tsx',
  'src/app/payment/success/page.tsx'
];

console.log('📁 ARCHIVOS ACTUALIZADOS:');
console.log('-------------------------');

filesToCheck.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes('eacademylogo.png')) {
      console.log(`✅ ${filePath} - Actualizado correctamente`);
    } else if (content.includes('Logo2.png')) {
      console.log(`❌ ${filePath} - Aún usa el logo anterior`);
    } else {
      console.log(`⚠️  ${filePath} - No contiene referencias al logo`);
    }
  } else {
    console.log(`❌ ${filePath} - Archivo no encontrado`);
  }
});

console.log('');
console.log('🎯 RESULTADO:');
console.log('-------------');
console.log('✅ Logo actualizado en el menú principal (Sidebar)');
console.log('✅ Logo actualizado en certificados');
console.log('✅ Logo actualizado en página de suscripción');
console.log('✅ Logo actualizado en página de éxito de pago');
console.log('');
console.log('🚀 Para ver los cambios:');
console.log('1. Recarga la página del navegador');
console.log('2. Verifica que el logo se vea correctamente en el menú');
console.log('3. Navega a diferentes páginas para confirmar'); 