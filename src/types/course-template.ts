export type CourseTemplateV1Data = {
  title: string;
  shortDescription?: string;
  description?: string;
  thumbnail?: string;
  introVideo?: string;
  price: number;
  originalPrice?: number | null;
  isFree?: boolean;
  rating?: number;
  studentsCount?: number;
  objectivesLead?: string;
  learningGoals: string[];
  tools: string[];
  prerequisites: string[];
  modules: Array<{
    title: string;
    description?: string;
    lessons: Array<{
      title: string;
      duration?: number;
      isFree?: boolean;
      videoUrl?: string;
    }>;
  }>;
  instructor: { name: string; title?: string; image?: string; bio?: string };
  testimonials: Array<{ studentName: string; content: string; rating?: number; studentTitle?: string }>;
  sidebar?: { durationHours?: number; includes?: string[] };
};


