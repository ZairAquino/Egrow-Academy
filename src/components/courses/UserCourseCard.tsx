'use client';

import Link from 'next/link';
import Image from 'next/image';

interface UserCourseCardProps {
  id: string;
  title: string;
  slug: string;
  imageUrl?: string;
}

export default function UserCourseCard({ id, title, slug, imageUrl }: UserCourseCardProps) {
  return (
    <div className="user-course-card">
      <div className="course-image">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            width={300}
            height={180}
            className="course-img"
          />
        ) : (
          <div className="course-placeholder">
            <span>📚</span>
          </div>
        )}
      </div>

      <div className="course-content">
        <h3 className="course-title">{title}</h3>
        
        <Link 
          href={`/curso/${slug}`}
          className="course-button"
        >
          Ir a curso
        </Link>
      </div>

      <style jsx>{`
        .user-course-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          overflow: hidden;
          border: 1px solid #f3f4f6;
          min-width: 280px;
          flex: 0 0 280px;
        }

        .user-course-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
        }

        .course-image {
          position: relative;
          height: 180px;
          overflow: hidden;
        }

        .course-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .course-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          color: white;
        }

        .course-content {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .course-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
          line-height: 1.4;
          text-align: center;
        }

        .course-button {
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          border-radius: 8px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          text-align: center;
          transition: all 0.3s ease;
          border: none;
          font-size: 0.875rem;
        }

        .course-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        @media (max-width: 768px) {
          .user-course-card {
            min-width: 260px;
            flex: 0 0 260px;
          }
          
          .course-title {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
