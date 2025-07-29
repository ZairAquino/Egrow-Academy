import { Metadata } from 'next';
import SimpleLayout from '@/components/layout/SimpleLayout';
import Hero from '@/components/layout/Hero';
import CompaniesMarquee from '@/components/ui/CompaniesMarquee';
import FeaturedCourses from '@/components/courses/FeaturedCourses';
import Newsletter from '@/components/ui/Newsletter';
import WhyChoose from '@/components/ui/WhyChoose';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'eGrow Academy - Cursos de Inteligencia Artificial | Líder en México y Latinoamérica',
  description: 'Aprende Inteligencia Artificial, Machine Learning y desarrollo web con los mejores cursos en línea. Certificaciones reconocidas y mentores expertos.',
  keywords: 'inteligencia artificial, machine learning, desarrollo web, cursos online, certificaciones, México, Latinoamérica',
  openGraph: {
    title: 'eGrow Academy - Cursos de Inteligencia Artificial',
    description: 'Aprende Inteligencia Artificial, Machine Learning y desarrollo web con los mejores cursos en línea.',
    type: 'website',
    images: ['/images/og-home.jpg'],
  },
};

export default function Home() {
  return (
    <SimpleLayout>
      <main className="main-content" style={{ paddingTop: '80px' }}>
        <Hero />
        <CompaniesMarquee />
        <FeaturedCourses />
        <WhyChoose />
        <Newsletter />
      </main>
      <Footer />
    </SimpleLayout>
  );
}