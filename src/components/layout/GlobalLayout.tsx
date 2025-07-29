'use client';

import { useState } from 'react';
import { ModernNavbar } from '@/components/ui/ModernNavbar';
import Sidebar from '@/components/layout/Sidebar';

interface GlobalLayoutProps {
  children: React.ReactNode;
}

export default function GlobalLayout({ children }: GlobalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* Modern Navbar - Global */}
      <ModernNavbar 
        onSidebarToggle={toggleSidebar} 
        isSidebarOpen={sidebarOpen} 
      />
      
      {/* Sidebar - Global */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} hideToggle={true} />
      
      {/* Main Content with proper spacing */}
      <div style={{ paddingTop: '80px' }}>
        {children}
      </div>
    </>
  );
}