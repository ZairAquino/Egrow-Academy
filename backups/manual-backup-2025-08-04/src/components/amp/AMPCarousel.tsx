'use client';

import { ampComponents } from '@/lib/amp-config';
import { AMPCarouselImage } from './AMPImage';

interface CarouselItem {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
  link?: string;
}

interface AMPCarouselProps {
  items: CarouselItem[];
  width?: number;
  height?: number;
  type?: 'slides' | 'carousel';
  autoplay?: boolean;
  delay?: number;
  loop?: boolean;
  className?: string;
  showControls?: boolean;
  showIndicators?: boolean;
}

export default function AMPCarousel({
  items,
  width = ampComponents.ampCarousel.width,
  height = ampComponents.ampCarousel.height,
  type = ampComponents.ampCarousel.type,
  autoplay = ampComponents.ampCarousel.autoplay,
  delay = ampComponents.ampCarousel.delay,
  loop = ampComponents.ampCarousel.loop,
  className = '',
  showControls = true,
  showIndicators = true,
}: AMPCarouselProps) {
  return (
    <amp-carousel
      width={width}
      height={height}
      type={type}
      autoplay={autoplay}
      delay={delay}
      loop={loop}
      class={`amp-carousel ${className}`}
      controls={showControls}
      indicator={showIndicators}
    >
      {items.map((item) => (
        <div key={item.id} className="amp-carousel-item">
          {item.link ? (
            <a href={item.link} className="amp-carousel-link">
              <AMPCarouselImage
                src={item.src}
                alt={item.alt}
                width={width}
                height={height}
              />
              {(item.title || item.description) && (
                <div className="amp-carousel-content">
                  {item.title && <h3 className="amp-carousel-title">{item.title}</h3>}
                  {item.description && <p className="amp-carousel-description">{item.description}</p>}
                </div>
              )}
            </a>
          ) : (
            <>
              <AMPCarouselImage
                src={item.src}
                alt={item.alt}
                width={width}
                height={height}
              />
              {(item.title || item.description) && (
                <div className="amp-carousel-content">
                  {item.title && <h3 className="amp-carousel-title">{item.title}</h3>}
                  {item.description && <p className="amp-carousel-description">{item.description}</p>}
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </amp-carousel>
  );
}

// Componente para carrusel de cursos
export function AMPCourseCarousel({ courses }: { courses: any[] }) {
  const carouselItems: CarouselItem[] = courses.map((course) => ({
    id: course.id,
    src: course.image || '/images/placeholder-course.jpg',
    alt: course.title,
    title: course.title,
    description: course.shortDescription,
    link: `/curso/${course.slug}`,
  }));

  return (
    <AMPCarousel
      items={carouselItems}
      width={400}
      height={300}
      type="carousel"
      autoplay={false}
      className="amp-course-carousel"
    />
  );
}

// Componente para carrusel de testimonios
export function AMPTestimonialCarousel({ testimonials }: { testimonials: any[] }) {
  const carouselItems: CarouselItem[] = testimonials.map((testimonial) => ({
    id: testimonial.id,
    src: testimonial.avatar || '/images/placeholder-avatar.jpg',
    alt: testimonial.name,
    title: testimonial.name,
    description: testimonial.quote,
  }));

  return (
    <AMPCarousel
      items={carouselItems}
      width={600}
      height={200}
      type="slides"
      autoplay={true}
      delay={4000}
      className="amp-testimonial-carousel"
    />
  );
}

// Componente para carrusel de instructores
export function AMPInstructorCarousel({ instructors }: { instructors: any[] }) {
  const carouselItems: CarouselItem[] = instructors.map((instructor) => ({
    id: instructor.id,
    src: instructor.avatar || '/images/placeholder-instructor.jpg',
    alt: instructor.name,
    title: instructor.name,
    description: instructor.specialty,
    link: `/instructor/${instructor.slug}`,
  }));

  return (
    <AMPCarousel
      items={carouselItems}
      width={300}
      height={400}
      type="carousel"
      autoplay={false}
      className="amp-instructor-carousel"
    />
  );
} 