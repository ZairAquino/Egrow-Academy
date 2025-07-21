import jwt from 'jsonwebtoken';

function checkJWTConfig() {
  try {
    console.log('🔍 [JWT] Verificando configuración de JWT...\n');

    const jwtSecret = process.env.JWT_SECRET;
    console.log('JWT_SECRET configurado:', !!jwtSecret);
    if (jwtSecret) {
      console.log('JWT_SECRET length:', jwtSecret.length);
      console.log('JWT_SECRET preview:', jwtSecret.substring(0, 10) + '...');
    } else {
      console.log('❌ JWT_SECRET no está configurado');
      console.log('💡 Usando valor por defecto: your-secret-key');
    }

    const userId = 'cmdaqz7xn0000lb04edu7763y';
    const secret = jwtSecret || 'your-secret-key';

    console.log('\n1️⃣ Generando token...');
    const token = jwt.sign({ userId }, secret, { expiresIn: '24h' });
    console.log('✅ Token generado:', token.substring(0, 50) + '...');

    console.log('\n2️⃣ Verificando token...');
    try {
      const decoded = jwt.verify(token, secret) as { userId: string };
      console.log('✅ Token verificado exitosamente');
      console.log('User ID decodificado:', decoded.userId);
    } catch (error) {
      console.log('❌ Error verificando token:', error);
    }

    console.log('\n3️⃣ Probando con token anterior...');
    const oldToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWRhcXo3eG4wMDAwbGIwNGVkdTc3NjN5IiwiaWF0IjoxNzUzMTI1MDUxLCJleHAiOjE3NTMyMTE0NTF9.0bsktYZ7g1LOzfgupahSw8El2j2C21sBHN92vvcRABY';
    
    try {
      const decodedOld = jwt.verify(oldToken, secret) as { userId: string };
      console.log('✅ Token anterior verificado exitosamente');
      console.log('User ID decodificado:', decodedOld.userId);
    } catch (error) {
      console.log('❌ Error verificando token anterior:', error);
    }

  } catch (error) {
    console.error('💥 Error en verificación JWT:', error);
  }
}

checkJWTConfig(); 