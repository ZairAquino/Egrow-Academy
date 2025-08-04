'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonCardProps {
  className?: string;
  height?: string;
  width?: string;
  rounded?: boolean;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  className = '',
  height = 'h-48',
  width = 'w-full',
  rounded = true
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`bg-gray-200 animate-pulse ${height} ${width} ${rounded ? 'rounded-lg' : ''} ${className}`}
    />
  );
};

interface SkeletonTextProps {
  lines?: number;
  className?: string;
  lastLineWidth?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  className = '',
  lastLineWidth = 'w-3/4'
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-gray-200 h-4 rounded ${
            index === lines - 1 ? lastLineWidth : 'w-full'
          }`}
        />
      ))}
    </div>
  );
};

interface SkeletonCourseCardProps {
  className?: string;
}

export const SkeletonCourseCard: React.FC<SkeletonCourseCardProps> = ({ className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}
    >
      <SkeletonCard height="h-32" className="rounded-none" />
      <div className="p-4 space-y-3">
        <SkeletonText lines={2} />
        <div className="flex justify-between items-center">
          <div className="w-20 h-4 bg-gray-200 rounded" />
          <div className="w-16 h-4 bg-gray-200 rounded" />
        </div>
      </div>
    </motion.div>
  );
};

interface SkeletonGridProps {
  items: number;
  className?: string;
  SkeletonComponent?: React.ComponentType<any>;
}

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({
  items,
  className = '',
  SkeletonComponent = SkeletonCourseCard
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <SkeletonComponent key={index} />
      ))}
    </div>
  );
};

interface SkeletonNavbarProps {
  className?: string;
}

export const SkeletonNavbar: React.FC<SkeletonNavbarProps> = ({ className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`w-full bg-white/80 backdrop-blur-sm border-b border-gray-200/80 fixed top-0 z-50 flex items-center justify-between px-4 py-1 md:py-2 shadow-sm h-14 md:h-auto relative ${className}`}
    >
      <div className="flex items-center">
        <div className="w-6 h-6 bg-gray-300 rounded mr-4" />
        <div className="w-32 h-8 bg-gray-200 rounded" />
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="w-20 h-8 bg-gray-200 rounded" />
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
      </div>
    </motion.div>
  );
}; 