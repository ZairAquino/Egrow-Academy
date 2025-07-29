import React, { useState } from 'react';
import UserProfile from '@/components/auth/UserProfile';
import Link from 'next/link';
import Image from 'next/image';
import ClientOnly from '@/components/ClientOnly';
import Sidebar from '@/components/layout/Sidebar';

interface NavbarProps {
  // Prop opcional para compatibilidad con páginas que aún la usen
  onToggleSidebar?: () => void;
  // Prop para ocultar el sidebar (usado en páginas como subscription)
  hideSidebar?: boolean;
}

const NavbarContent: React.FC<NavbarProps> = ({ hideSidebar = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               <nav className="w-full bg-white/61 backdrop-blur-sm border-b border-gray-200/61 fixed top-0 z-50 flex items-center justify-between px-4 py-2 shadow-sm">
             {/* Botón de sidebar - solo mostrar si no está oculto */}
             <div className="flex items-center">
               {!hideSidebar && (
                 <button
                   onClick={toggleSidebar}
                   className="navbar-menu-btn"
                   aria-label="Abrir menú"
                 >
                   <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                   </svg>
                 </button>
               )}
             </div>

                             {/* Logo centrado */}
         <Link href="/" className="navbar-logo flex justify-center items-center">
           <Image
             src="https://3o0p1lzj4n.ufs.sh/f/P2bnXUoat3Wf9BfN8GgLgae8NyBbzTISPo645dK2W0tprVHq"
             alt="eGrow Academy Logo"
             width={95}
             height={71}
             className="h-8 w-auto max-h-[71px] max-w-[95px]"
             priority
           />
         </Link>

       {/* Botón de suscripción y UserProfile */}
       <div className="flex items-center space-x-1">
         <Link
           href="/subscription"
           className="navbar-subscribe-btn"
         >
           Suscríbete
         </Link>
         <UserProfile />
       </div>
    </nav>
    
    {/* Sidebar - solo renderizar si no está oculto */}
    {!hideSidebar && <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />}
    </>
  );
};

const Navbar: React.FC<NavbarProps> = (props) => {
  return (
    <ClientOnly fallback={
               <nav className="w-full bg-white/61 backdrop-blur-sm border-b border-gray-200/61 fixed top-0 z-50 flex items-center justify-between px-4 py-2 shadow-sm">
        <div className="flex items-center">
          {!props.hideSidebar && (
            <div className="p-2 rounded-md">
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
            </div>
          )}
        </div>
        <div className="flex-1 flex justify-center">
          <div className="h-8 w-32 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 bg-gray-200 rounded-md w-20 h-8"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
      </nav>
    }>
      <NavbarContent {...props} />
    </ClientOnly>
  );
};

export default Navbar; 