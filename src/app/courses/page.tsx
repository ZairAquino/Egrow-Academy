import { Suspense } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CoursesContent from '@/components/CoursesContent';

export default function CoursesPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CoursesContent />
    </Suspense>
  );
}