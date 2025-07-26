'use client';

import { generateOpenGraph, OpenGraphData } from '@/lib/open-graph-config';

interface DynamicOpenGraphProps {
  data: OpenGraphData;
}

export default function DynamicOpenGraph({ data }: DynamicOpenGraphProps) {
  const ogData = generateOpenGraph(data);

  return (
    <>
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={ogData['og:title']} />
      <meta property="og:description" content={ogData['og:description']} />
      <meta property="og:image" content={ogData['og:image']} />
      <meta property="og:url" content={ogData['og:url']} />
      <meta property="og:type" content={ogData['og:type']} />
      <meta property="og:site_name" content={ogData['og:site_name']} />
      <meta property="og:locale" content={ogData['og:locale']} />
      
      {/* Open Graph Image Meta Tags */}
      <meta property="og:image:width" content={ogData['og:image:width']} />
      <meta property="og:image:height" content={ogData['og:image:height']} />
      <meta property="og:image:alt" content={ogData['og:image:alt']} />
      <meta property="og:image:type" content={ogData['og:image:type']} />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={ogData['twitter:card']} />
      <meta name="twitter:site" content={ogData['twitter:site']} />
      <meta name="twitter:creator" content={ogData['twitter:creator']} />
      <meta name="twitter:title" content={ogData['twitter:title']} />
      <meta name="twitter:description" content={ogData['twitter:description']} />
      <meta name="twitter:image" content={ogData['twitter:image']} />
      
      {/* Article Meta Tags (si aplica) */}
      {ogData['article:published_time'] && (
        <meta property="article:published_time" content={ogData['article:published_time']} />
      )}
      {ogData['article:modified_time'] && (
        <meta property="article:modified_time" content={ogData['article:modified_time']} />
      )}
      {ogData['article:author'] && (
        <meta property="article:author" content={ogData['article:author']} />
      )}
      {ogData['article:section'] && (
        <meta property="article:section" content={ogData['article:section']} />
      )}
      {ogData['article:tag'] && (
        <meta property="article:tag" content={ogData['article:tag']} />
      )}
      
      {/* Product Meta Tags (para cursos) */}
      {ogData['product:price:amount'] && (
        <meta property="product:price:amount" content={ogData['product:price:amount']} />
      )}
      {ogData['product:price:currency'] && (
        <meta property="product:price:currency" content={ogData['product:price:currency']} />
      )}
      {ogData['product:availability'] && (
        <meta property="product:availability" content={ogData['product:availability']} />
      )}
      {ogData['product:rating:value'] && (
        <meta property="product:rating:value" content={ogData['product:rating:value']} />
      )}
      {ogData['product:rating:count'] && (
        <meta property="product:rating:count" content={ogData['product:rating:count']} />
      )}
      
      {/* Course Meta Tags */}
      {ogData['course:duration'] && (
        <meta property="course:duration" content={ogData['course:duration']} />
      )}
      {ogData['course:instructor'] && (
        <meta property="course:instructor" content={ogData['course:instructor']} />
      )}
      {ogData['course:level'] && (
        <meta property="course:level" content={ogData['course:level']} />
      )}
    </>
  );
} 