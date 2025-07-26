'use client';

import { generateBreadcrumbSchema } from '@/lib/schema-advanced';

interface BreadcrumbSchemaProps {
  breadcrumbs: Array<{
    name: string;
    url: string;
  }>;
}

export default function BreadcrumbSchema({ breadcrumbs }: BreadcrumbSchemaProps) {
  const schemaData = generateBreadcrumbSchema(breadcrumbs);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaData),
      }}
    />
  );
} 