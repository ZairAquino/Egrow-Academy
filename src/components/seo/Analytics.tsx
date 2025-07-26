'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface AnalyticsProps {
  gaId?: string;
  gtmId?: string;
  facebookPixelId?: string;
  hotjarId?: string;
}

export default function Analytics({ 
  gaId, 
  gtmId, 
  facebookPixelId, 
  hotjarId 
}: AnalyticsProps) {
  const googleAnalyticsId = gaId || process.env.NEXT_PUBLIC_GA_ID;
  const googleTagManagerId = gtmId || process.env.NEXT_PUBLIC_GTM_ID;
  const fbPixelId = facebookPixelId || process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
  const hjId = hotjarId || process.env.NEXT_PUBLIC_HOTJAR_ID;

  useEffect(() => {
    // Google Analytics 4
    if (googleAnalyticsId && typeof window !== 'undefined') {
      window.gtag = window.gtag || function() {
        (window.gtag as any).q = (window.gtag as any).q || [];
        (window.gtag as any).q.push(arguments);
      };
      
      window.gtag('js', new Date());
      window.gtag('config', googleAnalyticsId, {
        page_title: document.title,
        page_location: window.location.href,
      });
    }

    // Facebook Pixel
    if (fbPixelId && typeof window !== 'undefined') {
      window.fbq = window.fbq || function() {
        (window.fbq as any).callMethod ? (window.fbq as any).callMethod.apply(window.fbq, arguments) : (window.fbq as any).queue.push(arguments);
      };
      
      if (!(window as any)._fbq) (window as any)._fbq = window.fbq;
      window.fbq('init', fbPixelId);
      window.fbq('track', 'PageView');
    }

    // Hotjar
    if (hjId && typeof window !== 'undefined') {
      (window as any).hjid = hjId;
      (window as any).hjsv = 6;
      
      const hotjarScript = document.createElement('script');
      hotjarScript.async = true;
      hotjarScript.src = `https://static.hotjar.com/c/hotjar-${hjId}.js?sv=6`;
      document.head.appendChild(hotjarScript);
    }
  }, [googleAnalyticsId, fbPixelId, hjId]);

  return (
    <>
      {/* Google Analytics */}
      {googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsId}', {
                page_title: document.title,
                page_location: window.location.href,
                custom_map: {
                  'custom_parameter_1': 'course_category',
                  'custom_parameter_2': 'course_level',
                  'custom_parameter_3': 'user_type'
                }
              });
            `}
          </Script>
        </>
      )}

      {/* Google Tag Manager */}
      {googleTagManagerId && (
        <>
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${googleTagManagerId}');
            `}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${googleTagManagerId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        </>
      )}

      {/* Facebook Pixel */}
      {fbPixelId && (
        <>
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${fbPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${fbPixelId}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      )}
    </>
  );
}

// Tipos para TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
    hjid?: string;
    hjsv?: number;
  }
} 