import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Providers from "@/components/Providers";
import { baseSEOConfig, generateStructuredData } from "@/lib/seo-config";
import Analytics from "@/components/seo/Analytics";
import PerformanceOptimizer from "@/components/seo/PerformanceOptimizer";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
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
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateStructuredData('Organization', {})),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateStructuredData('WebSite', {})),
          }}
        />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/images/og-image.jpg" as="image" />
        <link rel="preload" href="/images/logo.png" as="image" />
        
        {/* DNS Prefetch for external domains */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body className={inter.className}>
        <Providers>
          {/* Main Content */}
          <main className="main-content">
            {children}
          </main>
        </Providers>

        {/* SEO Analytics and Performance Tracking */}
        <Analytics />
        <PerformanceOptimizer />
      </body>
    </html>
  );
}
