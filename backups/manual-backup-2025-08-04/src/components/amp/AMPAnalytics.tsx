'use client';

import { ampConfig, ampUtils } from '@/lib/amp-config';

interface AMPAnalyticsProps {
  pageType: string;
  pageData?: any;
  customEvents?: Record<string, any>;
  className?: string;
}

export default function AMPAnalytics({
  pageType,
  pageData,
  customEvents = {},
  className = '',
}: AMPAnalyticsProps) {
  if (!ampConfig.analyticsConfig.enabled) {
    return null;
  }

  // Configuración base de analytics
  const baseConfig = ampUtils.setupAMPAnalytics(pageType, pageData);

  // Configuración personalizada de eventos
  const customConfig = {
    ...JSON.parse(baseConfig),
    triggers: {
      ...JSON.parse(baseConfig).triggers,
      ...customEvents,
    },
  };

  return (
    <amp-analytics
      type="gtag"
      data-credentials="include"
      class={className}
    >
      <script
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(customConfig),
        }}
      />
    </amp-analytics>
  );
}

// Componente para analytics de página de curso
export function AMPCourseAnalytics({ course }: { course: any }) {
  const customEvents = {
    trackCourseView: {
      on: 'visible',
      request: 'event',
      vars: {
        event_category: 'course',
        event_action: 'view',
        event_label: course.title,
        course_id: course.id,
        course_category: course.category,
      },
    },
    trackCourseClick: {
      on: 'click',
      selector: '.amp-course-button',
      request: 'event',
      vars: {
        event_category: 'course',
        event_action: 'click',
        event_label: course.title,
        course_id: course.id,
      },
    },
    trackCourseEnrollment: {
      on: 'click',
      selector: '.amp-enroll-button',
      request: 'event',
      vars: {
        event_category: 'conversion',
        event_action: 'enroll',
        event_label: course.title,
        course_id: course.id,
        value: course.price,
      },
    },
  };

  return (
    <AMPAnalytics
      pageType="course"
      pageData={course}
      customEvents={customEvents}
    />
  );
}

// Componente para analytics de página de blog
export function AMPBlogAnalytics({ post }: { post: any }) {
  const customEvents = {
    trackBlogView: {
      on: 'visible',
      request: 'event',
      vars: {
        event_category: 'blog',
        event_action: 'view',
        event_label: post.title,
        post_id: post.id,
        post_category: post.category,
      },
    },
    trackBlogShare: {
      on: 'click',
      selector: '.amp-share-button',
      request: 'event',
      vars: {
        event_category: 'blog',
        event_action: 'share',
        event_label: post.title,
        post_id: post.id,
      },
    },
    trackBlogRead: {
      on: 'scroll',
      request: 'event',
      vars: {
        event_category: 'blog',
        event_action: 'read',
        event_label: post.title,
        post_id: post.id,
      },
    },
  };

  return (
    <AMPAnalytics
      pageType="blog"
      pageData={post}
      customEvents={customEvents}
    />
  );
}

// Componente para analytics de formulario de contacto
export function AMPContactAnalytics() {
  const customEvents = {
    trackFormView: {
      on: 'visible',
      request: 'event',
      vars: {
        event_category: 'contact',
        event_action: 'form_view',
        event_label: 'contact_form',
      },
    },
    trackFormSubmit: {
      on: 'submit',
      request: 'event',
      vars: {
        event_category: 'contact',
        event_action: 'form_submit',
        event_label: 'contact_form',
      },
    },
    trackFormError: {
      on: 'user-error',
      request: 'event',
      vars: {
        event_category: 'contact',
        event_action: 'form_error',
        event_label: 'contact_form',
      },
    },
  };

  return (
    <AMPAnalytics
      pageType="contact"
      customEvents={customEvents}
    />
  );
}

// Componente para analytics de página principal
export function AMPHomeAnalytics() {
  const customEvents = {
    trackHeroView: {
      on: 'visible',
      request: 'event',
      vars: {
        event_category: 'home',
        event_action: 'hero_view',
        event_label: 'hero_section',
      },
    },
    trackCourseBrowse: {
      on: 'click',
      selector: '.amp-browse-courses',
      request: 'event',
      vars: {
        event_category: 'home',
        event_action: 'browse_courses',
        event_label: 'course_browse',
      },
    },
    trackNewsletterSignup: {
      on: 'submit',
      selector: '.amp-newsletter-form',
      request: 'event',
      vars: {
        event_category: 'home',
        event_action: 'newsletter_signup',
        event_label: 'newsletter',
      },
    },
  };

  return (
    <AMPAnalytics
      pageType="home"
      customEvents={customEvents}
    />
  );
}

// Hook para tracking personalizado
export function useAMPTracking() {
  const trackEvent = (category: string, action: string, label?: string, value?: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  };

  const trackPageView = (title?: string, url?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_title: title || document.title,
        page_location: url || window.location.href,
      });
    }
  };

  const trackConversion = (value?: number, currency: string = 'MXN') => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL',
        value: value,
        currency: currency,
      });
    }
  };

  return {
    trackEvent,
    trackPageView,
    trackConversion,
  };
} 