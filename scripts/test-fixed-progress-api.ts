import fetch from 'node-fetch';

async function testFixedProgressAPI() {
  try {
    console.log('🔍 [TEST] Probando API de progreso corregida...\n');

    // Usar el token generado anteriormente
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWRhcXo3eG4wMDAwbGIwNGVkdTc3NjN5IiwiaWF0IjoxNzUzMTI1MDUxLCJleHAiOjE3NTMyMTE0NTF9.0bsktYZ7g1LOzfgupahSw8El2j2C21sBHN92vvcRABY';

    console.log('1️⃣ Probando API de progreso con token válido...');
    
    const progressResponse = await fetch('http://localhost:3000/api/courses/progress?courseId=desarrollo-web-fullstack', {
      method: 'GET',
      headers: {
        'Cookie': `auth-token=${token}`,
        'Content-Type': 'application/json',
      }
    });

    console.log('Status:', progressResponse.status);
    console.log('Status Text:', progressResponse.statusText);

    if (progressResponse.ok) {
      const progressData = await progressResponse.json();
      console.log('✅ Respuesta exitosa:');
      console.log(JSON.stringify(progressData, null, 2));
    } else {
      const errorText = await progressResponse.text();
      console.log('❌ Error en progreso:', errorText);
    }

    // También probar con el ID directo del curso
    console.log('\n2️⃣ Probando con ID directo del curso...');
    
    const progressResponse2 = await fetch('http://localhost:3000/api/courses/progress?courseId=cmddav1bv0001e5ko3o5dt2cv', {
      method: 'GET',
      headers: {
        'Cookie': `auth-token=${token}`,
        'Content-Type': 'application/json',
      }
    });

    console.log('Status (ID directo):', progressResponse2.status);
    console.log('Status Text (ID directo):', progressResponse2.statusText);

    if (progressResponse2.ok) {
      const progressData2 = await progressResponse2.json();
      console.log('✅ Respuesta exitosa (ID directo):');
      console.log(JSON.stringify(progressData2, null, 2));
    } else {
      const errorText2 = await progressResponse2.text();
      console.log('❌ Error en progreso (ID directo):', errorText2);
    }

  } catch (error) {
    console.error('💥 Error en test:', error);
  }
}

testFixedProgressAPI(); 