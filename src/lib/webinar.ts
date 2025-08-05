import { prisma } from '@/lib/prisma';
import { Webinar, WebinarRegistration, CreateWebinarData, RegisterWebinarData } from '@/types/webinar';

/**
 * Obtiene un webinar por su slug
 */
export async function getWebinarBySlug(slug: string): Promise<Webinar | null> {
  try {
    const webinar = await prisma.webinar.findUnique({
      where: { slug },
      include: {
        registrations: {
          where: { isConfirmed: true },
          select: { id: true }
        }
      }
    });

    if (!webinar) return null;

    return {
      ...webinar,
      price: Number(webinar.price),
      currentAttendees: webinar.registrations.length,
      dateTime: webinar.dateTime,
      createdAt: webinar.createdAt,
      updatedAt: webinar.updatedAt
    };
  } catch (error) {
    console.error('Error getting webinar by slug:', error);
    return null;
  }
}

/**
 * Obtiene todos los webinars activos
 */
export async function getActiveWebinars(): Promise<Webinar[]> {
  try {
    const webinars = await prisma.webinar.findMany({
      where: { 
        isActive: true
      },
      orderBy: { dateTime: 'asc' },
      include: {
        registrations: {
          where: { isConfirmed: true },
          select: { id: true }
        }
      }
    });

    return webinars.map(webinar => ({
      ...webinar,
      price: Number(webinar.price),
      currentAttendees: webinar.registrations.length,
      dateTime: webinar.dateTime,
      createdAt: webinar.createdAt,
      updatedAt: webinar.updatedAt
    }));
  } catch (error) {
    console.error('Error getting active webinars:', error);
    return [];
  }
}

/**
 * Obtiene los webinars próximos (futuros)
 */
export async function getUpcomingWebinars(): Promise<Webinar[]> {
  try {
    const now = new Date();
    const webinars = await prisma.webinar.findMany({
      where: { 
        isActive: true,
        dateTime: {
          gt: now
        }
      },
      orderBy: { dateTime: 'asc' },
      include: {
        registrations: {
          where: { isConfirmed: true },
          select: { id: true }
        }
      }
    });

    return webinars.map(webinar => ({
      ...webinar,
      price: Number(webinar.price),
      currentAttendees: webinar.registrations.length,
      dateTime: webinar.dateTime,
      createdAt: webinar.createdAt,
      updatedAt: webinar.updatedAt
    }));
  } catch (error) {
    console.error('Error getting upcoming webinars:', error);
    return [];
  }
}

/**
 * Obtiene los webinars pasados
 */
export async function getPastWebinars(): Promise<Webinar[]> {
  try {
    const now = new Date();
    const webinars = await prisma.webinar.findMany({
      where: { 
        isActive: true,
        dateTime: {
          lt: now
        }
      },
      orderBy: { dateTime: 'desc' },
      include: {
        registrations: {
          where: { isConfirmed: true },
          select: { id: true }
        }
      }
    });

    return webinars.map(webinar => ({
      ...webinar,
      price: Number(webinar.price),
      currentAttendees: webinar.registrations.length,
      dateTime: webinar.dateTime,
      createdAt: webinar.createdAt,
      updatedAt: webinar.updatedAt
    }));
  } catch (error) {
    console.error('Error getting past webinars:', error);
    return [];
  }
}

/**
 * Obtiene los webinars destacados (los 3 más próximos)
 */
export async function getFeaturedWebinars(): Promise<Webinar[]> {
  try {
    const now = new Date();
    const webinars = await prisma.webinar.findMany({
      where: { 
        isActive: true,
        dateTime: {
          gt: now
        }
      },
      orderBy: { dateTime: 'asc' },
      take: 3,
      include: {
        registrations: {
          where: { isConfirmed: true },
          select: { id: true }
        }
      }
    });

    return webinars.map(webinar => ({
      ...webinar,
      price: Number(webinar.price),
      currentAttendees: webinar.registrations.length,
      dateTime: webinar.dateTime,
      createdAt: webinar.createdAt,
      updatedAt: webinar.updatedAt
    }));
  } catch (error) {
    console.error('Error getting featured webinars:', error);
    return [];
  }
}

/**
 * Registra un usuario a un webinar
 */
export async function registerToWebinar(data: RegisterWebinarData): Promise<{ success: boolean; message: string; registration?: WebinarRegistration }> {
  try {
    // Verificar si el webinar existe y está activo
    const webinar = await prisma.webinar.findUnique({
      where: { id: data.webinarId },
      include: { registrations: true }
    });

    if (!webinar) {
      return { success: false, message: 'Webinar no encontrado' };
    }

    if (!webinar.isActive) {
      return { success: false, message: 'Este webinar no está disponible' };
    }

    // Verificar si ya está registrado
    const existingRegistration = await prisma.webinarRegistration.findUnique({
      where: {
        webinarId_email: {
          webinarId: data.webinarId,
          email: data.email
        }
      }
    });

    if (existingRegistration) {
      return { success: false, message: 'Ya hay un registro con este correo' };
    }

    // Verificar cupos si hay límite
    if (webinar.maxAttendees && webinar.registrations.length >= webinar.maxAttendees) {
      return { success: false, message: 'Este webinar ya no tiene cupos disponibles' };
    }

    // Crear el registro
    const registration = await prisma.webinarRegistration.create({
      data: {
        webinarId: data.webinarId,
        userId: data.userId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        questions: data.questions,
        isConfirmed: true // Auto-confirmar por ahora
      }
    });

    // Enviar email de confirmación
    try {
      console.log('📧 Intentando enviar email de confirmación a:', registration.email);
      const { sendWebinarConfirmationEmail } = await import('./email/webinar-email-service');
      const emailResult = await sendWebinarConfirmationEmail(webinar, registration);
      console.log('📧 Resultado del envío de email:', emailResult);
    } catch (emailError) {
      console.error('⚠️ Error enviando email de confirmación:', emailError);
      // No fallar el registro si el email falla
    }

    return {
      success: true,
      message: 'Registro exitoso al webinar. Revisa tu email para la confirmación.',
      registration: {
        ...registration,
        createdAt: registration.createdAt,
        updatedAt: registration.updatedAt
      }
    };
  } catch (error) {
    console.error('Error registering to webinar:', error);
    return { success: false, message: 'Error al registrar al webinar' };
  }
}

/**
 * Crea un nuevo webinar
 */
export async function createWebinar(data: CreateWebinarData): Promise<{ success: boolean; message: string; webinar?: Webinar }> {
  try {
    const webinar = await prisma.webinar.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        shortDescription: data.shortDescription,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        dateTime: new Date(data.dateTime),
        duration: data.duration,
        maxAttendees: data.maxAttendees,
        isFree: data.isFree,
        price: data.price,
        category: data.category,
        tags: data.tags,
        hostName: data.hostName,
        hostBio: data.hostBio,
        zoomLink: data.zoomLink,
        meetingId: data.meetingId,
        password: data.password
      }
    });

    return {
      success: true,
      message: 'Webinar creado exitosamente',
      webinar: {
        ...webinar,
        price: Number(webinar.price),
        dateTime: webinar.dateTime,
        createdAt: webinar.createdAt,
        updatedAt: webinar.updatedAt
      }
    };
  } catch (error) {
    console.error('Error creating webinar:', error);
    return { success: false, message: 'Error al crear el webinar' };
  }
}

/**
 * Obtiene las estadísticas de un webinar
 */
export async function getWebinarStats(webinarId: string) {
  try {
    const [totalRegistrations, confirmedRegistrations, attendedRegistrations] = await Promise.all([
      prisma.webinarRegistration.count({ where: { webinarId } }),
      prisma.webinarRegistration.count({ where: { webinarId, isConfirmed: true } }),
      prisma.webinarRegistration.count({ where: { webinarId, attended: true } })
    ]);

    const conversionRate = totalRegistrations > 0 ? (confirmedRegistrations / totalRegistrations) * 100 : 0;

    return {
      totalRegistrations,
      confirmedRegistrations,
      attendedRegistrations,
      conversionRate: Math.round(conversionRate * 100) / 100
    };
  } catch (error) {
    console.error('Error getting webinar stats:', error);
    return {
      totalRegistrations: 0,
      confirmedRegistrations: 0,
      attendedRegistrations: 0,
      conversionRate: 0
    };
  }
}

/**
 * Genera un slug único para un webinar
 */
export function generateWebinarSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .replace(/^-+|-+$/g, '');
}

/**
 * Formatea la fecha del webinar
 */
export function formatWebinarDate(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Mexico_City'
  }).format(date);
}

/**
 * Calcula el tiempo restante hasta el webinar
 */
export function getTimeUntilWebinar(date: Date): { days: number; hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const diff = date.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
} 