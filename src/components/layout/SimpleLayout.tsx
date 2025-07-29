'use client';

import { useState } from 'react';
import { ModernNavbar } from '@/components/ui/ModernNavbar';
import Sidebar from '@/components/layout/Sidebar';
import { ReactNode } from 'react';

interface SimpleLayoutProps {
  children: ReactNode;
}

export default function SimpleLayout({ children }: SimpleLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <ModernNavbar 
        onSidebarToggle={toggleSidebar}
        isSidebarOpen={sidebarOpen}
      />

      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} hideToggle={true} />
      
      {children}
    </>
  );
} 