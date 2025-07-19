'use client';

import { useCourseAccess } from '@/hooks/useCourseAccess';
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

  const course = { id, title, category, isFree, requiresAuth };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
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
          <span className="course-rating">4.8/5</span>
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