'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Hero from '@/components/Hero';
import CompaniesMarquee from '@/components/CompaniesMarquee';
import FeaturedCourses from '@/components/FeaturedCourses';
import Newsletter from '@/components/Newsletter';
import WhyChoose from '@/components/WhyChoose';
import Footer from '@/components/Footer';

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
        <CompaniesMarquee />
        <FeaturedCourses />
        <WhyChoose />
        <Newsletter />
      </main>

      <Footer />
    </>
  );
}
