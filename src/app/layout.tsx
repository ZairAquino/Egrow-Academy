import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./critical.css";
import "./globals.css";
import "./premium-logo.css";

import Providers from "@/components/Providers";
import { baseSEOConfig, generateStructuredData } from "@/lib/seo-config";
import { generateEducationalOrganizationSchema } from "@/lib/schema-advanced";
import { openGraphConfigs } from "@/lib/open-graph-config";
import Analytics from "@/components/seo/Analytics";
import PromotionBannerWrapper from "@/components/PromotionBannerWrapper";
import ConversionTracker from "@/components/analytics/ConversionTracker";
import { initializeGA4 } from "@/lib/analytics";
import { NotificationSystem } from '@/components/ui/NotificationSystem';
import BehaviorTrackingWrapper from '@/components/BehaviorTrackingWrapper';
import StreakNotifications from '@/components/notifications/StreakNotifications';
import StreakSynchronizer from '@/components/streaks/StreakSynchronizer';
import StreakSystemInitializer from '@/components/streaks/StreakSystemInitializer';

const montserrat = Montserrat({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-montserrat',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
});

export const metadata: Metadata = baseSEOConfig;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#2563eb',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="google-site-verification" content="ppV50-xAiHZYc7B8SSMk9lJapqLgxMPvv0wDv" />
        
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/logofav.ico" />
        
        {/* Open Graph Meta Tags - Página Principal */}
        <meta property="og:title" content={openGraphConfigs.home.title} />
        <meta property="og:description" content={openGraphConfigs.home.description} />
        <meta property="og:image" content={openGraphConfigs.home.image} />
        <meta property="og:url" content="https://egrow-academy.com" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="eGrow Academy" />
        <meta property="og:locale" content="es_MX" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@egrowacademy" />
        <meta name="twitter:creator" content="@egrowacademy" />
        <meta name="twitter:title" content={openGraphConfigs.home.title} />
        <meta name="twitter:description" content={openGraphConfigs.home.description} />
        <meta name="twitter:image" content={openGraphConfigs.home.image} />
        
        {/* Structured Data - Schema.org Avanzado */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateEducationalOrganizationSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateStructuredData('WebSite', {})),
          }}
        />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/images/optimized/logop.webp" as="image" type="image/webp" />
        <link rel="preload" href="/images/eGrowAcademylogo.png" as="image" />
        
        {/* Preload video background for faster loading */}
        <link rel="preload" href="/videos/background.webm" as="video" type="video/webm" />
        
        {/* Preload critical CSS */}
        <link rel="preload" href="/styles/critical.css" as="style" />
        
        {/* DNS Prefetch for external domains */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body className={montserrat.className}>
        <Providers>
          <NotificationSystem>
            <BehaviorTrackingWrapper>
              {children}
            </BehaviorTrackingWrapper>
          </NotificationSystem>
          
          {/* Sistema de notificaciones de rachas */}
          <StreakNotifications />
          
          {/* Sistema completo de rachas */}
          <StreakSystemInitializer />
          <StreakSynchronizer />
          
          {/* Funciones de prueba para desarrollo */}
          {process.env.NODE_ENV === 'development' && (
            <script dangerouslySetInnerHTML={{
              __html: `
                if (typeof window !== 'undefined') {
                  window.addEventListener('load', () => {
                    console.log('🎯 Modo desarrollo: Funciones de prueba disponibles');
                    console.log('• testStreakNotifications.testAll() - Probar notificaciones');
                    console.log('• triggerLessonCompleted() - Simular lección completada');
                    console.log('• testButtonDetector() - Probar detector de botones');
                  });
                }
              `
            }} />
          )}
          
          {/* Google Analytics 4 */}
          {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
                  `,
                }}
              />
            </>
          )}
          
          {/* Conversion Tracker */}
          <ConversionTracker />
        </Providers>
      </body>
    </html>
  );
}

