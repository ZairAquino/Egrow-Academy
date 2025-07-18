'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import FixedUserProfile from '@/components/auth/FixedUserProfile';
import Hero from '@/components/layout/Hero';
import CompaniesMarquee from '@/components/ui/CompaniesMarquee';
import FeaturedCourses from '@/components/courses/FeaturedCourses';
import Newsletter from '@/components/ui/Newsletter';
import WhyChoose from '@/components/ui/WhyChoose';
import Footer from '@/components/layout/Footer';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* UserProfile fijo en esquina superior derecha */}
      <FixedUserProfile />
      
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Hero />
        <CompaniesMarquee />
        <FeaturedCourses />
        <WhyChoose />
        <Newsletter />
      </main>

      <Footer />
    </>
  );
}
