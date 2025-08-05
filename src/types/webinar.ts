export interface Webinar {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  imageUrl?: string;
  videoUrl?: string;
  dateTime: Date;
  duration: number; // en minutos
  maxAttendees?: number;
  currentAttendees: number;
  isActive: boolean;
  isFree: boolean;
  price: number;
  category?: string;
  tags: string[];
  hostName?: string;
  hostBio?: string;
  zoomLink?: string;
  meetingId?: string;
  password?: string;
  recordingUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WebinarRegistration {
  id: string;
  webinarId: string;
  userId?: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  company?: string;
  position?: string;
  questions?: string;
  isConfirmed: boolean;
  reminderSent: boolean;
  attended: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWebinarData {
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  imageUrl?: string;
  videoUrl?: string;
  dateTime: string;
  duration: number;
  maxAttendees?: number;
  isFree: boolean;
  price: number;
  category?: string;
  tags: string[];
  hostName?: string;
  hostBio?: string;
  zoomLink?: string;
  meetingId?: string;
  password?: string;
}

export interface RegisterWebinarData {
  webinarId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  questions?: string;
  userId?: string;
}

export interface WebinarFormData {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  questions?: string;
}

export interface WebinarStats {
  totalRegistrations: number;
  confirmedRegistrations: number;
  attendedRegistrations: number;
  conversionRate: number;
} 