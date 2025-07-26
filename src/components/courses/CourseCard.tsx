'use client';

import { useCourseAccess } from '@/hooks/useCourseAccess';
import { useAnalytics } from '@/hooks/useAnalytics';
import SubscriptionModal from '@/components/payments/SubscriptionModal';

interface CourseCardProps {
  id: string;
  image: string;
  title: string;
  description: string;
  tag: string;
  duration: string;
  level: string;
  category: string;
  isFree: boolean;
  requiresAuth: boolean;
  link?: string;
  onCourseClick?: (courseId: string) => void;
}

export default function CourseCard({
  id, image, title, description, tag, duration, level, category, isFree, requiresAuth, link, onCourseClick
}: CourseCardProps) {
  const {
    handleCourseAccess,
    showSubscriptionModal,
    closeSubscriptionModal,
    getAccessMessage,
    getAccessBadgeColor
  } = useCourseAccess();

  const { trackCourseView, trackCTAClick } = useAnalytics();

  const course = { id, title, category, isFree, requiresAuth };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Track course view
    trackCourseView({
      course_id: id,
      course_name: title,
      course_category: category,
      course_level: level,
      course_price: isFree ? 0 : undefined,
    });

    // Track CTA click
    trackCTAClick({
      cta_type: isFree ? 'enroll' : 'subscribe',
      cta_text: 'Ver Curso',
      cta_location: 'course_card',
      user_type: 'free', // TODO: Get from auth context
    });

    if (onCourseClick) {
      if (handleCourseAccess(course)) {
        onCourseClick(id);
      }
    }
  };

  const CardContent = (
    <>
      <div className="course-image-new">
        <img src={image} alt={title} />
        <span className="course-type-badge">{getAccessMessage(course)}</span>
      </div>
      <div className="course-content-new">
        <div className="course-meta">
          <span className="course-instructor">eGrow Academy</span>
        </div>
        <h3 className="course-title-new">
          {title}
        </h3>
        <p className="course-description-new">
          {description}
        </p>
        <div className="course-link">
          Ver Curso →
        </div>
      </div>
    </>
  );

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className="course-card-new">
        {CardContent}
      </a>
    );
  }

  return (
    <>
      <div
        className="course-card-new cursor-pointer"
        onClick={handleClick}
      >
        {CardContent}
      </div>
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={closeSubscriptionModal}
        courseTitle={title}
      />
    </>
  );
} 