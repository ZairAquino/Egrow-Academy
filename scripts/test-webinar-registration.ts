import { PrismaClient } from '@prisma/client';
import { registerToWebinar } from '../src/lib/webinar';

const prisma = new PrismaClient();

async function testWebinarRegistration() {
  try {
    console.log('🧪 Probando registro completo de usuario a webinar...\n');

    // Obtener el primer webinar disponible
    const webinar = await prisma.webinar.findFirst({
      where: { isActive: true }
    });

    if (!webinar) {
      console.log('❌ No hay webinars activos para probar');
      return;
    }

    console.log(`📋 Webinar seleccionado: ${webinar.title}`);
    console.log(`📅 Fecha: ${webinar.dateTime}`);
    console.log(`👨‍💼 Ponente: ${webinar.hostName}\n`);

    // Datos de prueba del usuario (cambiar por datos reales)
    const testUserData = {
      webinarId: webinar.id,
      userId: null, // Usuario no logueado
      email: 'test@example.com', // CAMBIAR POR EMAIL REAL
      firstName: 'Juan',
      lastName: 'Pérez',
      phone: '+52 55 1234 5678',
      company: 'Mi Empresa',
      position: 'Desarrollador',
      questions: '¿Habrá material descargable después del webinar?'
    };

    console.log('👤 Datos de prueba del usuario:');
    console.log(`- Nombre: ${testUserData.firstName} ${testUserData.lastName}`);
    console.log(`- Email: ${testUserData.email}`);
    console.log(`- Empresa: ${testUserData.company}`);
    console.log(`- Cargo: ${testUserData.position}`);
    console.log(`- Pregunta: ${testUserData.questions}\n`);

    console.log('📝 Registrando usuario al webinar...');
    const result = await registerToWebinar(testUserData);

    if (result.success) {
      console.log('✅ Registro exitoso!');
      console.log(`📧 Mensaje: ${result.message}`);
      
      if (result.registration) {
        console.log('\n📊 Detalles del registro:');
        console.log(`- ID: ${result.registration.id}`);
        console.log(`- Email: ${result.registration.email}`);
        console.log(`- Confirmado: ${result.registration.isConfirmed ? 'Sí' : 'No'}`);
        console.log(`- Fecha de registro: ${result.registration.createdAt}`);
      }

      // Verificar que el registro se guardó en la base de datos
      const savedRegistration = await prisma.webinarRegistration.findFirst({
        where: {
          webinarId: webinar.id,
          email: testUserData.email
        }
      });

      if (savedRegistration) {
        console.log('\n💾 Registro guardado en la base de datos correctamente');
      } else {
        console.log('\n⚠️ El registro no se encontró en la base de datos');
      }

      // Verificar el conteo actualizado
      const updatedWebinar = await prisma.webinar.findUnique({
        where: { id: webinar.id },
        include: {
          registrations: {
            where: { isConfirmed: true }
          }
        }
      });

      if (updatedWebinar) {
        console.log(`\n👥 Cupos actualizados: ${updatedWebinar.registrations.length}/${updatedWebinar.maxAttendees}`);
      }

    } else {
      console.log('❌ Error en el registro:');
      console.log(`- Mensaje: ${result.message}`);
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Verificar si se proporcionó un email como argumento
const testEmail = process.argv[2];
if (testEmail) {
  console.log(`📧 Usando email de prueba: ${testEmail}`);
  // Aquí podrías actualizar el email en el script
}

testWebinarRegistration(); 