import { sendWebinarConfirmationEmail } from '../src/lib/email/webinar-email-service';
import { Webinar, WebinarRegistration } from '../src/types/webinar';

async function testWebinarEmail() {
  console.log('🧪 Probando envío de email de webinar...');

  // Datos de prueba
  const testWebinar: Webinar = {
    id: 'test-webinar-id',
    title: 'Monetiza con IA: Estrategias Prácticas para 2024',
    slug: 'monetiza-con-ia-2024',
    description: 'Aprende a generar ingresos con IA en este webinar gratuito.',
    dateTime: new Date('2025-08-15T13:00:00Z'),
    duration: 90,
    maxAttendees: 100,
    currentAttendees: 5,
    isActive: true,
    isFree: true,
    price: 0,
    tags: ['IA', 'Monetización', 'Emprendimiento'],
    hostName: 'Carlos Rodríguez',
    zoomLink: 'https://meet.google.com/abc-defg-hij',
    meetingId: 'abc-defg-hij',
    password: '123456',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const testRegistration: WebinarRegistration = {
    id: 'test-registration-id',
    webinarId: 'test-webinar-id',
    email: 'solismartinezluisdavid@gmail.com',
    firstName: 'Luis David',
    lastName: 'Solís Martínez',
    phone: '+52 55 1234 5678',
    questions: '¿Habrá material descargable?',
    isConfirmed: true,
    reminderSent: false,
    attended: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  try {
    console.log('📧 Enviando email de prueba...');
    const result = await sendWebinarConfirmationEmail(testWebinar, testRegistration);
    
    if (result) {
      console.log('✅ Email enviado exitosamente');
    } else {
      console.log('❌ Error al enviar email');
    }
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
}

testWebinarEmail().catch(console.error); 