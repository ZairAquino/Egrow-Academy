import fs from 'fs';
import path from 'path';

async function setupEnvironment() {
  try {
    console.log('🔧 Configurando variables de entorno...\n');

    const envPath = path.join(process.cwd(), '.env.local');
    const examplePath = path.join(process.cwd(), 'env.example');

    // Leer archivo de ejemplo
    const exampleContent = fs.readFileSync(examplePath, 'utf8');
    
    // Variables que necesitamos configurar
    const requiredVars = {
      JWT_SECRET: 'egrow-academy-jwt-secret-key-2024',
      NEXT_PUBLIC_BASE_URL: 'http://localhost:3001',
    };

    let envContent = '';
    
    // Si el archivo .env.local existe, leerlo
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
      console.log('📁 Archivo .env.local encontrado');
    } else {
      console.log('📁 Creando archivo .env.local');
    }

    // Verificar y agregar variables faltantes
    let updated = false;
    
    for (const [key, value] of Object.entries(requiredVars)) {
      if (!envContent.includes(`${key}=`)) {
        envContent += `\n# ${key}\n${key}="${value}"\n`;
        console.log(`✅ Agregada: ${key}`);
        updated = true;
      } else {
        console.log(`✅ Ya existe: ${key}`);
      }
    }

    // Escribir archivo actualizado
    if (updated) {
      fs.writeFileSync(envPath, envContent);
      console.log('\n📝 Archivo .env.local actualizado');
    } else {
      console.log('\n📝 No se requieren cambios');
    }

    // Mostrar variables importantes
    console.log('\n🔑 Variables de entorno configuradas:');
    console.log(`   JWT_SECRET: ${requiredVars.JWT_SECRET}`);
    console.log(`   NEXT_PUBLIC_BASE_URL: ${requiredVars.NEXT_PUBLIC_BASE_URL}`);

    console.log('\n⚠️  IMPORTANTE:');
    console.log('   - Reinicia el servidor para que los cambios tomen efecto');
    console.log('   - En producción, usa un JWT_SECRET más seguro');
    console.log('   - Configura las variables de Stripe cuando estés listo');

    console.log('\n🎉 Configuración completada!');

  } catch (error) {
    console.error('❌ Error configurando variables de entorno:', error);
  }
}

// Ejecutar configuración
setupEnvironment()
  .then(() => {
    console.log('✅ Configuración exitosa!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  }); 