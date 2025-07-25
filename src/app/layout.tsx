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
    default: "eGrow Academy - Plataforma Educativa",
    template: "%s | eGrow Academy"
  },
  description: "Plataforma educativa de inteligencia artificial y tecnología.",
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
          {/* Main Content */}
          <main className="main-content">
            {children}
          </main>
        </Providers>

      </body>
    </html>
  );
}
