interface CourseCardProps {
  image: string;
  title: string;
  description: string;
  tag: string;
  duration: string;
  level: string;
  link?: string;
}

export default function CourseCard({ image, title, description, tag, duration, level, link }: CourseCardProps) {
  const CardContent = (
    <>
      <div className="course-image">
        <img
          src={image}
          alt={title}
        />
      </div>
      <div className="course-content">
        <span className="course-tag">{tag}</span>
        <h3 className="course-title">
          {title}
        </h3>
        <p className="course-description">
          {description}
        </p>
        <div className="course-footer">
          <span className="course-duration">{duration}</span>
          <span className="course-level">{level}</span>
        </div>
      </div>
    </>
  );

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className="course-card hover-lift">
        {CardContent}
      </a>
    );
  }

  return (
    <div className="course-card hover-lift">
      {CardContent}
    </div>
  );
} 