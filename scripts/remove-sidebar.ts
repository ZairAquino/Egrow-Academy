#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

const pagesToUpdate = [
  'src/app/cursos-gratuitos/page.tsx',
  'src/app/community/page.tsx',
  'src/app/contacto/page.tsx',
  'src/app/profile/page.tsx',
  'src/app/my-courses/page.tsx',
  'src/app/certificate/[courseId]/page.tsx',
  'src/app/resources/page.tsx',
  'src/app/resources/[slug]/page.tsx',
  'src/app/curso/monetiza-ia/page.tsx',
  'src/app/curso/monetiza-ia/contenido/page.tsx',
  'src/app/curso/introduccion-llms/page.tsx',
  'src/app/curso/introduccion-llms/contenido/page.tsx',
  'src/app/curso/fundamentos-ml/page.tsx',
  'src/app/curso/fundamentos-ml/contenido/page.tsx',
  'src/app/curso/desarrollo-web-fullstack/page.tsx',
  'src/app/curso/desarrollo-web-fullstack/contenido/page.tsx',
  'src/app/curso/computer-vision/page.tsx',
  'src/app/curso/computer-vision/contenido/page.tsx',
  'src/app/community/foro/page.tsx',
  'src/app/admin/lesson-video-upload/page.tsx',
  'src/app/admin/video-status/page.tsx',
  'src/app/admin/video-demo/page.tsx',
  'src/app/login/page.tsx',
  'src/app/register/page.tsx',
  'src/app/forgot-password/page.tsx',
  'src/app/reset-password/page.tsx'
];

function removeSidebarFromFile(filePath: string) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Quitar import de Sidebar
    if (content.includes("import Sidebar from '@/components/layout/Sidebar';")) {
      content = content.replace("import Sidebar from '@/components/layout/Sidebar';", '');
      modified = true;
    }

    // Quitar variables de sidebar
    if (content.includes("const [sidebarOpen, setSidebarOpen] = useState(false);")) {
      content = content.replace("const [sidebarOpen, setSidebarOpen] = useState(false);", '');
      modified = true;
    }

    // Quitar función toggleSidebar
    if (content.includes("const toggleSidebar = () => {")) {
      const toggleStart = content.indexOf("const toggleSidebar = () => {");
      const toggleEnd = content.indexOf("};", toggleStart) + 2;
      content = content.substring(0, toggleStart) + content.substring(toggleEnd);
      modified = true;
    }

    // Quitar componente Sidebar del JSX
    if (content.includes("<Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar}")) {
      content = content.replace(/<Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar}[^>]*\s*\/>/g, '');
      modified = true;
    }

    // Quitar onToggleSidebar del Navbar
    if (content.includes("onToggleSidebar={toggleSidebar}")) {
      content = content.replace("onToggleSidebar={toggleSidebar}", '');
      modified = true;
    }

    // Quitar sidebarOpen de las clases CSS
    if (content.includes("sidebarOpen ? 'sidebar-open' : ''")) {
      content = content.replace(/className=\{`[^`]*\$\{sidebarOpen \? 'sidebar-open' : ''\}[^`]*`\}/g, 'className="main-content pt-16"');
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Updated: ${filePath}`);
    } else {
      console.log(`⏭️  No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error);
  }
}

console.log('🚀 Removing Sidebar from all pages...\n');

pagesToUpdate.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    removeSidebarFromFile(filePath);
  } else {
    console.log(`⚠️  File not found: ${filePath}`);
  }
});

console.log('\n✅ Sidebar removal completed!'); 