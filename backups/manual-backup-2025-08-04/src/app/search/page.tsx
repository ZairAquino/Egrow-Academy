import { Suspense } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import SearchContent from '@/components/SearchContent';

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SearchContent />
    </Suspense>
  );
}