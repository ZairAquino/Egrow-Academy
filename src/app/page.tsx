'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/Sidebar';
import Hero from '@/components/Hero';
import LoadingSpinner from '@/components/LoadingSpinner';

// Lazy load components for better performance
const CompaniesMarquee = dynamic(() => import('@/components/CompaniesMarquee'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

const FeaturedCourses = dynamic(() => import('@/components/FeaturedCourses'), {
  loading: () => <LoadingSpinner />,
  ssr: true
});

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Hero />
        
        <Suspense fallback={<LoadingSpinner />}>
          <CompaniesMarquee />
        </Suspense>
        
        <Suspense fallback={<LoadingSpinner />}>
          <FeaturedCourses />
        </Suspense>
      </main>
    </>
  );
}
