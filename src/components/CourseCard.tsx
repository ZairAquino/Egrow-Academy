import Image from 'next/image';

interface CourseCardProps {
  image: string;
  title: string;
  description: string;
  tag: string;
  duration: string;
  level: string;
}

export default function CourseCard({ image, title, description, tag, duration, level }: CourseCardProps) {
  return (
    <div className="course-card hover-lift">
      <div className="course-image">
        <Image
          src={image}
          alt={title}
          width={400}
          height={250}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          priority={false}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="course-content">
        <span className="course-tag">{tag}</span>
        <h3 className="course-title">{title}</h3>
        <p className="course-description">{description}</p>
        <div className="course-footer">
          <span>{duration}</span>
          <span>{level}</span>
        </div>
      </div>
    </div>
  );
} 