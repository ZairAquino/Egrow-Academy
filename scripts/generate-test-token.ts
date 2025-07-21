import jwt from 'jsonwebtoken';

function generateTestToken() {
  try {
    console.log('🔍 [TOKEN] Generando token de prueba...\n');

    const userId = 'cmdaqz7xn0000lb04edu7763y';
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

    // Generar token
    const token = jwt.sign({ userId }, jwtSecret, { expiresIn: '24h' });
    
    console.log('✅ Token generado exitosamente');
    console.log('User ID:', userId);
    console.log('Token:', token);
    console.log('\n📋 Para usar en el navegador:');
    console.log('1. Abre las herramientas de desarrollador (F12)');
    console.log('2. Ve a la pestaña Application/Storage > Cookies');
    console.log('3. Busca la cookie "auth-token"');
    console.log('4. Reemplaza su valor con el token generado arriba');
    console.log('\n🔗 O usa este comando en la consola del navegador:');
    console.log(`document.cookie = "auth-token=${token}; path=/";`);

  } catch (error) {
    console.error('💥 Error generando token:', error);
  }
}

generateTestToken(); 