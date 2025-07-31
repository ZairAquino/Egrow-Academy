#!/usr/bin/env tsx

import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

console.log('🔧 Arreglando errores críticos de TypeScript...');

// Fix para src/app/api/auth/login/route.ts
const loginRoutePath = join(process.cwd(), 'src/app/api/auth/login/route.ts');
try {
  let loginContent = readFileSync(loginRoutePath, 'utf8');
  
  // Fix undefined 'body' variable
  if (loginContent.includes('body.') && !loginContent.includes('const body')) {
    loginContent = loginContent.replace(
      'export async function POST(request: NextRequest) {',
      `export async function POST(request: NextRequest) {
  const body = await request.json();`
    );
    writeFileSync(loginRoutePath, loginContent);
    console.log('✅ Fixed login route body variable');
  }
} catch (error) {
  console.log('⚠️ Login route file not found or already fixed');
}

// Fix para src/lib/security.ts
const securityPath = join(process.cwd(), 'src/lib/security.ts');
try {
  let securityContent = readFileSync(securityPath, 'utf8');
  
  // Fix IP property access
  securityContent = securityContent.replace(
    /request\.ip/g,
    'request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"'
  );
  
  writeFileSync(securityPath, securityContent);
  console.log('✅ Fixed security.ts IP access');
} catch (error) {
  console.log('⚠️ Security file not found or already fixed');
}

// Fix para src/lib/analytics.ts
const analyticsPath = join(process.cwd(), 'src/lib/analytics.ts');
try {
  let analyticsContent = readFileSync(analyticsPath, 'utf8');
  
  // Add global declaration
  if (!analyticsContent.includes('declare global')) {
    const globalDeclaration = `
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

`;
    analyticsContent = globalDeclaration + analyticsContent;
    writeFileSync(analyticsPath, analyticsContent);
    console.log('✅ Fixed analytics.ts global types');
  }
} catch (error) {
  console.log('⚠️ Analytics file not found or already fixed');
}

console.log('🎉 Arreglo de errores críticos completado');
console.log('💡 Ejecuta: npm run typecheck para verificar los cambios');