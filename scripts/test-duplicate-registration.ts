import { registerToWebinar } from '../src/lib/webinar';
import { RegisterWebinarData } from '../src/types/webinar';

async function testDuplicateRegistration() {
  console.log('🧪 Probando validación de registros duplicados...');

  // Datos de prueba
  const testData: RegisterWebinarData = {
    webinarId: 'test-webinar-id',
    email: 'test@example.com',
    firstName: 'Juan',
    lastName: 'Pérez',
    phone: '+52 55 1234 5678',
    questions: '¿Habrá material descargable?'
  };

  try {
    // Primer registro
    console.log('📝 Intentando primer registro...');
    const firstResult = await registerToWebinar(testData);
    console.log('Primer resultado:', firstResult);

    // Segundo registro con el mismo email
    console.log('📝 Intentando segundo registro con el mismo email...');
    const secondResult = await registerToWebinar(testData);
    console.log('Segundo resultado:', secondResult);

    if (firstResult.success && !secondResult.success && secondResult.message.includes('Ya estás registrado')) {
      console.log('✅ Validación de duplicados funciona correctamente');
    } else {
      console.log('❌ Error en la validación de duplicados');
      console.log('Primer registro:', firstResult);
      console.log('Segundo registro:', secondResult);
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
}

testDuplicateRegistration().catch(console.error); 