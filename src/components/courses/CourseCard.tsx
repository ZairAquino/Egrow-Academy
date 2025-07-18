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
      <div className="course-image relative">
        <img src={image} alt={title} className="w-full h-48 object-cover rounded-t-lg" />
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getAccessBadgeColor(course)}`}>
          {getAccessMessage(course)}
        </div>
      </div>
      <div className="course-content p-4">
        <span className="course-tag inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
          {tag}
        </span>
        <h3 className="course-title text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="course-description text-gray-600 text-sm mb-4 line-clamp-2">
          {description}
        </p>
        <div className="course-footer flex justify-between items-center text-xs text-gray-500">
          <span className="course-duration">{duration}</span>
          <span className="course-level">{level}</span>
        </div>
      </div>
    </>
  );

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className="course-card hover-lift bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transition-all duration-300">
        {CardContent}
      </a>
    );
  }

  return (
    <>
      <div
        className="course-card hover-lift cursor-pointer bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transition-all duration-300"
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