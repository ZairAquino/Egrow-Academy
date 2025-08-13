"use client";

import React from 'react';
import VideoPlayer from '@/components/courses/VideoPlayer';
import { CheckCircle, Play, Users, Star, Award, ChevronDown, ChevronUp, Lock, Clock } from 'lucide-react';
import { renderToolIcon } from '@/lib/tool-icons';

export interface CourseTemplateLesson {
  id?: string | number;
  order: number;
  title: string;
  duration?: number; // minutos
  isFree?: boolean;
  videoUrl?: string;
}

export interface CourseTemplateModule {
  id?: string | number;
  order: number;
  title: string;
  description?: string;
  lessons: CourseTemplateLesson[];
}

export interface CourseTemplateInstructor {
  name?: string;
  title?: string;
  image?: string;
  bio?: string;
}

export interface CourseTemplateData {
  // Hero/meta
  title: string;
  description?: string;
  category?: string;
  level?: string;
  language?: string;
  introVideo?: string;
  thumbnail?: string;

  // Stats/pricing
  totalDuration?: number;
  lessonsCount?: number;
  enrollmentCount?: number;
  isFree?: boolean;
  price?: number;
  originalPrice?: number | null;
  rating?: number;

  // Content
  learningGoals?: string[];
  objectivesLead?: string;
  modules?: CourseTemplateModule[];
  prerequisites?: string[];
  tools?: string[];
  testimonials?: Array<{ name?: string; text?: string; rating?: number; studentTitle?: string }>;

  instructor?: CourseTemplateInstructor;
}

interface Props {
  course: CourseTemplateData;
  onPrimaryAction?: () => void;
}

export default function CourseTemplateV1({ course, onPrimaryAction }: Props) {
  const [expandedModules, setExpandedModules] = React.useState<number[]>([]);
  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => (prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]));
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes || minutes <= 0) return '0min';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const totalDuration = course.totalDuration ||
    (course.modules || []).reduce((total, m) => total + (m.lessons || []).reduce((s, l) => s + (l.duration || 0), 0), 0);

  const lessonsCount = course.lessonsCount ||
    (course.modules || []).reduce((total, m) => total + (m.lessons?.length || 0), 0);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gray-50">
        <div className="container mx-auto px-6 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Izquierda: título y CTA */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-gray-900 mb-6">
                {course.title}
              </h1>
              {course.description && (
                <p className="text-base lg:text-lg text-gray-700 mb-6 max-w-2xl">{course.description}</p>
              )}
              <button
                onClick={onPrimaryAction}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                {course.isFree ? 'Acceder Gratis' : 'Iniciar Sesión para Comenzar'}
              </button>
            </div>

            {/* Derecha: preview + stats */}
            <div className="w-full">
              <div className="rounded-xl overflow-hidden shadow-xl bg-black/5">
                {course.introVideo ? (
                  <VideoPlayer videoUrl={course.introVideo} title={course.title} />
                ) : course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full" />
                ) : (
                  <div className="aspect-video flex items-center justify-center bg-gray-100">
                    <Play className="w-10 h-10 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-6 text-gray-700 mt-3">
                <div className="flex items-center gap-1 text-blue-600">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4" />
                  ))}
                </div>
                <span className="text-sm">{(course.rating || 4.8).toFixed(1)} ({course.enrollmentCount || 0} valoraciones)</span>
                <span className="text-sm flex items-center gap-1">
                  <Users className="w-4 h-4" /> {course.enrollmentCount || 0} estudiantes
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Descripción del Curso */}
              {course.description && (
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-14 h-[2px] bg-blue-600" />
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Descripción</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Descripción del Curso</h2>
                  <p className="text-gray-700 leading-relaxed">{course.description}</p>
                </div>
              )}

              {/* Objetivos */}
              {course.learningGoals && course.learningGoals.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-14 h-[2px] bg-blue-600" />
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Objetivos</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-6">Lo que vas a conseguir con este curso</h2>
                  {course.objectivesLead && (
                    <p className="text-gray-600 mb-6">{course.objectivesLead}</p>
                  )}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {course.learningGoals.map((goal, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-md border border-gray-100">
                        <span className="w-6 h-6 flex items-center justify-center text-blue-600 font-semibold border border-blue-200 rounded-full mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-gray-700">{goal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Herramientas */}
              {course.tools && course.tools.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h2 className="text-2xl font-bold mb-6">Herramientas y Tecnologías</h2>
                  <div className="flex flex-wrap gap-3">
                    {course.tools.map((tool, i) => (
                      <div key={i} className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                        {renderToolIcon(tool)}
                        <span className="text-gray-700">{tool}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contenido del curso */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Contenido del Curso</h2>
                <div className="text-sm text-gray-600 mb-4">
                  {(course.modules?.length || 0)} módulos • {lessonsCount} lecciones • {formatDuration(totalDuration)}
                </div>
                <div className="space-y-4">
                  {(course.modules || []).map((module, idx) => (
                    <div key={module.id || idx} className="border rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleModule((module.id as number) || idx)}
                        className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition"
                      >
                        <div className="text-left">
                          <h3 className="font-semibold">Módulo {module.order}: {module.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {(module.lessons?.length || 0)} lecciones • {formatDuration(module.lessons?.reduce((s, l) => s + (l.duration || 0), 0))}
                          </p>
                        </div>
                        {expandedModules.includes(((module.id as number) || idx)) ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      {expandedModules.includes(((module.id as number) || idx)) && (
                        <div className="px-6 py-4 space-y-3 bg-white">
                          {module.description && (
                            <p className="text-gray-600 text-sm mb-2">{module.description}</p>
                          )}
                          {(module.lessons || []).map((lesson, lidx) => (
                            <div key={lesson.id || lidx} className="flex items-center justify-between py-2">
                              <div className="flex items-center gap-3">
                                {lesson.isFree ? (
                                  <Play className="w-4 h-4 text-blue-600" />
                                ) : (
                                  <Lock className="w-4 h-4 text-gray-400" />
                                )}
                                <span className="text-gray-700">{lesson.order}. {lesson.title}</span>
                                {lesson.isFree && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Gratis</span>
                                )}
                              </div>
                              <span className="text-sm text-gray-500">{lesson.duration || 0}min</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tu Instructor */}
              {course.instructor && (
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h2 className="text-2xl font-bold mb-6">Tu Instructor</h2>
                  <div className="flex items-center gap-4 mb-4">
                    {course.instructor.image ? (
                      <img src={course.instructor.image} alt={course.instructor.name} className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-xl font-semibold">{course.instructor.name?.[0] || 'I'}</span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{course.instructor.name}</p>
                      <p className="text-sm text-gray-600">{course.instructor.title}</p>
                    </div>
                  </div>
                  {course.instructor.bio && (<p className="text-sm text-gray-700">{course.instructor.bio}</p>)}
                </div>
              )}

              {/* Requisitos */}
              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h2 className="text-2xl font-bold mb-6">Requisitos</h2>
                  <ul className="space-y-3">
                    {course.prerequisites.map((req, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-blue-600 mt-1">•</span>
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Testimonios */}
              {course.testimonials && course.testimonials.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h2 className="text-2xl font-bold mb-6">Opiniones</h2>
                  <div className="space-y-6">
                    {course.testimonials.map((t, i) => (
                      <div key={i} className="border-l-4 border-blue-600 pl-6">
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} className={`w-4 h-4 ${j < (t.rating || 5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <p className="text-gray-700 mb-3">{t.text}</p>
                        <div className="text-sm">
                          <p className="font-semibold">{t.name}</p>
                          {t.studentTitle && <p className="text-gray-600">{t.studentTitle}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="mb-6">
                    {course.isFree ? (
                      <div className="text-3xl font-bold text-green-600">GRATIS</div>
                    ) : (
                      <>
                        <div className="text-3xl font-bold">
                          ${course.price || 0}
                          {course.originalPrice && course.originalPrice > (course.price || 0) && (
                            <span className="text-lg text-gray-500 line-through ml-2">${course.originalPrice}</span>
                          )}
                        </div>
                        {course.originalPrice && course.originalPrice > (course.price || 0) && (
                          <div className="text-green-600 text-sm mt-1">
                            {Math.round((((course.originalPrice || 0) - (course.price || 0)) / (course.originalPrice || 1)) * 100)}% de descuento
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <button onClick={onPrimaryAction} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                    {course.isFree ? 'Acceder Gratis' : 'Inscribirme ahora'}
                  </button>
                  <div className="mt-6 space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-700"><CheckCircle className="w-4 h-4 text-green-500" /><span>Acceso de por vida</span></div>
                    <div className="flex items-center gap-2 text-gray-700"><CheckCircle className="w-4 h-4 text-green-500" /><span>Certificado de finalización</span></div>
                    <div className="flex items-center gap-2 text-gray-700"><CheckCircle className="w-4 h-4 text-green-500" /><span>Actualizaciones incluidas</span></div>
                    {totalDuration > 0 && (
                      <div className="flex items-center gap-2 text-gray-700"><Clock className="w-4 h-4 text-gray-600" /><span>{formatDuration(totalDuration)} de contenido</span></div>
                    )}
                  </div>
                </div>

                {/* Acceso individual */}
                {!course.isFree && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="font-semibold mb-2">Acceso individual</h3>
                    <p className="text-sm text-gray-600 mb-4">Pago único para este curso. Acceso permanente al contenido.</p>
                    <button onClick={onPrimaryAction} className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition">
                      Comprar este curso
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


