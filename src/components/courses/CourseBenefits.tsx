'use client';

import {
  IconUsers,
  IconDeviceDesktop,
  IconThumbUp,
  IconBulb,
  IconUser,
  IconWorld,
  IconCertificate,
  IconCheck
} from '@tabler/icons-react';
import Image from 'next/image';

export default function CourseBenefits() {
  const benefits = [
    {
      icon: <IconUsers size={32} color="#6c757d" />,
      title: "Flexibilidad total de aprendizaje",
      description: "Accede a tu contenido cuando quieras, desde cualquier dispositivo. Sin presiones de tiempo, avanza según tu disponibilidad y ritmo personal."
    },
    {
      icon: <IconDeviceDesktop size={32} color="#6c757d" />,
      title: "Contenido audiovisual premium",
      description: "Contenido audiovisual de máxima calidad con explicaciones paso a paso. Reproduce las lecciones cuantas veces necesites hasta dominar cada concepto."
    },
    {
      icon: <IconThumbUp size={32} color="#6c757d" />,
      title: "Instructores certificados en IA",
      description: "Nuestros expertos combinan experiencia práctica con conocimientos teóricos avanzados en inteligencia artificial y tecnologías emergentes."
    },
    {
      icon: <IconBulb size={32} color="#6c757d" />,
      title: "Colabora y crece en comunidad",
      description: "Interactúa con otros estudiantes, resuelve dudas colectivamente y comparte tus proyectos para recibir feedback constructivo."
    },
    {
      icon: <IconUser size={32} color="#6c757d" />,
      title: "Metodología probada y efectiva",
      description: "Cada instructor aplica técnicas pedagógicas innovadoras que garantizan la comprensión y retención del conocimiento."
    },
    {
      icon: <IconWorld size={32} color="#6c757d" />,
      title: "Red global de innovadores",
      description: "Únete a una comunidad internacional de profesionales y entusiastas que están transformando el futuro con inteligencia artificial."
    },
    {
      icon: <IconCertificate size={32} color="#6c757d" />,
      title: "Certificación profesional ePlus",
      description: "Como miembro ePlus, recibe certificados digitales verificables que acreditan tu dominio en cada tecnología aprendida.",
      badge: "ePlus"
    },
    {
      icon: <IconCheck size={32} color="#6c757d" />,
      title: "Contenido exclusivo y actualizado",
      description: "Cada curso es desarrollado internamente con las últimas tendencias y herramientas del mercado, asegurando relevancia y actualidad."
    }
  ];

  return (
    <section className="course-benefits-section">
      <div className="container">
        <div className="section-header">
                                    <h2 className="section-title">
                            Descubre lo que aprenderás con{' '}
                            <span className="logo-inline">
                              <Image
                                src="/images/eGrowAcademylogo.png"
                                alt="eGrow Academy"
                                width={200}
                                height={60}
                                className="egrow-logo"
                              />
                            </span>
                          </h2>
        </div>
        
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <div className="benefit-icon-wrapper">
                {benefit.icon}
              </div>
              <div className="benefit-content">
                <div className="benefit-title-container">
                  <h3 className="benefit-title">{benefit.title}</h3>
                  {benefit.badge && (
                    <span className="benefit-badge">{benefit.badge}</span>
                  )}
                </div>
                <p className="benefit-description">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
