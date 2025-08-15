'use client';

import { useCourseAccess } from '@/hooks/useCourseAccess';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useToast } from '@/contexts/ToastContext';
import SubscriptionModal from '@/components/payments/SubscriptionModal';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { motion } from 'framer-motion';

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
  priceId?: string;
  isAuthenticated?: boolean;
  onCourseClick?: (courseId: string) => void;
  showTopSalesBadge?: boolean;
  studentsCount?: number;
  likePercentage?: number;
  totalLikes?: number;
  formatNumber?: (num: number) => string;
}

export default function CourseCard({
  id, image, title, description, tag, duration, level, category, isFree, requiresAuth, link, priceId, isAuthenticated, onCourseClick, showTopSalesBadge = false, studentsCount = 0, likePercentage = 95, totalLikes = 0, formatNumber = (num: number) => num.toString()
}: CourseCardProps) {
  const {
    handleCourseAccess,
    showSubscriptionModal,
    closeSubscriptionModal,
    getAccessMessage,
    getAccessBadgeColor,
    canAccessCourse
  } = useCourseAccess();

  const { trackCourseView, trackCTAClick } = useAnalytics();
  const { showToast } = useToast();

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
        showToast(`Accediendo a ${title}...`, 'info', 1500);
        onCourseClick(id);
      } else {
        showToast('Este curso requiere suscripción premium', 'warning', 3000);
      }
    }
  };

  const CardContent = (
    <>
      <div className="course-image-container">
        <OptimizedImage 
          src={image} 
          alt={title} 
          width={400}
          height={250}
          className="course-image"
          priority={false}
        />
        {showTopSalesBadge && (
          <div className="course-badge top-sales">TOP VENTAS</div>
        )}
        <div className="course-badge eplus">e Plus</div>
      </div>
      
      <div className="course-content">
        <h3 className="course-title">
          {title}
        </h3>
        <p className="course-instructor">
          Un curso de eGrow Academy
        </p>
        <p className="course-description">
          {description}
        </p>
        
        <div className="course-metrics">
          <div className="metric">
            <span className="metric-icon">👥</span>
            <span className="metric-value">{formatNumber(studentsCount)}</span>
          </div>
          <div className="metric">
            <span className="metric-icon">👍</span>
            <span className="metric-value">{likePercentage}% ({formatNumber(totalLikes)})</span>
          </div>
        </div>
        
        <div className="course-pricing">
                                <div className="price-info">
                      </div>
          <button className="buy-button">
            Mas Informacion
          </button>
        </div>
      </div>
    </>
  );

  if (link) {
    return (
      <motion.a 
        href={link} 
        className="course-card-new"
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {CardContent}
      </motion.a>
    );
  }

  return (
    <>
      <motion.div
        className="course-card-new cursor-pointer"
        onClick={handleClick}
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {CardContent}
      </motion.div>
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={closeSubscriptionModal}
        courseTitle={title}
      />
    </>
  );
} 