import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Providers from "@/components/Providers";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "eGrow-academy - Aprende IA de los mejores expertos del mundo",
    template: "%s | eGrow-academy"
  },
  description: "Domina el aprendizaje automático e inteligencia artificial con cursos diseñados por expertos de clase mundial. Comienza tu viaje en IA hoy mismo.",
  keywords: ["IA", "Inteligencia Artificial", "Machine Learning", "Cursos", "Educación", "Tecnología"],
  authors: [{ name: "eGrow Academy" }],
  creator: "eGrow Academy",
  publisher: "eGrow Academy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://egrow-academy.com'),
  alternates: {
    canonical: '/',
  },

  openGraph: {
    title: "eGrow-academy - Aprende IA de los mejores expertos del mundo",
    description: "Domina el aprendizaje automático e inteligencia artificial con cursos diseñados por expertos de clase mundial.",
    url: 'https://egrow-academy.com',
    siteName: 'eGrow Academy',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'eGrow Academy - Cursos de IA',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "eGrow-academy - Aprende IA de los mejores expertos del mundo",
    description: "Domina el aprendizaje automático e inteligencia artificial con cursos diseñados por expertos de clase mundial.",
    images: ['/images/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

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
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>

      </body>
    </html>
  );
}
