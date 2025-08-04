'use client';

import { generateAdvancedCourseSchema } from '@/lib/schema-advanced';

interface CourseSchemaProps {
  courseData: {
    title: string;
    description: string;
    slug: string;
    image?: string;
    level?: string;
    duration?: string;
    price?: number;
    startDate?: string;
    endDate?: string;
    maxStudents?: number;
    rating?: {
      average: number;
      count: number;
    };
    topics?: string[];
    keywords?: string[];
    prerequisites?: string[];
    skills?: string[];
    validFrom?: string;
    validThrough?: string;
  };
}

export default function CourseSchema({ courseData }: CourseSchemaProps) {
  const schemaData = generateAdvancedCourseSchema(courseData);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaData),
      }}
    />
  );
} 