import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
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

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
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
    <html lang="es" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="google-site-verification" content="ppV50-xAiHZYc7B8SSMk9lJapqLgxMPvv0wDv" />
        
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
      <body className={inter.className}>
        <Providers>
          {children}
          
                  {/* Conversion Tracker */}
        <ConversionTracker />
      </Providers>

      {/* SEO Analytics */}
      <Analytics />
        
        {/* Google Analytics 4 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Inicializar GA4
              if (typeof window !== 'undefined') {
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'}', {
                  page_title: document.title,
                  page_location: window.location.href,
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
