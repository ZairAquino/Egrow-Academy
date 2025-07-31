'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, PlayCircle, Clock, Target, TrendingUp } from 'lucide-react';

interface ProgressData {
  current: number;
  total: number;
  percentage: number;
  label: string;
  type: 'course' | 'lesson' | 'streak' | 'milestone';
}

interface ProgressIndicatorProps {
  data: ProgressData;
  showAnimation?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const getProgressColor = (percentage: number) => {
  if (percentage >= 80) return 'text-green-500 bg-green-100';
  if (percentage >= 60) return 'text-blue-500 bg-blue-100';
  if (percentage >= 40) return 'text-yellow-500 bg-yellow-100';
  return 'text-gray-500 bg-gray-100';
};

const getProgressIcon = (type: ProgressData['type']) => {
  switch (type) {
    case 'course':
      return <Target className="w-4 h-4" />;
    case 'lesson':
      return <PlayCircle className="w-4 h-4" />;
    case 'streak':
      return <TrendingUp className="w-4 h-4" />;
    case 'milestone':
      return <CheckCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  data,
  showAnimation = true,
  size = 'md',
  className = '',
}) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (showAnimation) {
      const timer = setTimeout(() => {
        setAnimatedPercentage(data.percentage);
        
        if (data.percentage === 100) {
          setTimeout(() => setIsComplete(true), 500);
        }
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setAnimatedPercentage(data.percentage);
    }
  }, [data.percentage, showAnimation]);

  const sizeClasses = {
    sm: 'w-16 h-16 text-xs',
    md: 'w-24 h-24 text-sm',
    lg: 'w-32 h-32 text-base',
  };

  const strokeWidth = {
    sm: 4,
    md: 6,
    lg: 8,
  };

  const radius = {
    sm: 26,
    md: 42,
    lg: 56,
  };

  const circumference = 2 * Math.PI * radius[size];

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Círculo de progreso */}
      <svg className={`${sizeClasses[size]} transform -rotate-90`}>
        {/* Círculo de fondo */}
        <circle
          cx="50%"
          cy="50%"
          r={radius[size]}
          stroke="currentColor"
          strokeWidth={strokeWidth[size]}
          fill="transparent"
          className="text-gray-200"
        />
        
        {/* Círculo de progreso */}
        <motion.circle
          cx="50%"
          cy="50%"
          r={radius[size]}
          stroke="currentColor"
          strokeWidth={strokeWidth[size]}
          fill="transparent"
          strokeLinecap="round"
          className={`${getProgressColor(data.percentage).split(' ')[1]}`}
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: circumference - (animatedPercentage / 100) * circumference,
          }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>

      {/* Contenido central */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <AnimatePresence>
          {isComplete && data.percentage === 100 ? (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, ease: 'backOut' }}
              className="text-green-500"
            >
              <CheckCircle className={`${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-10 h-10'}`} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className={`font-bold ${getProgressColor(data.percentage).split(' ')[0]}`}>
                {Math.round(animatedPercentage)}%
              </div>
              <div className="text-xs text-gray-500 mt-1">{data.label}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Indicador de progreso numérico */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
        {data.current}/{data.total}
      </div>
    </div>
  );
};

// Componente para múltiples indicadores
interface ProgressGridProps {
  items: ProgressData[];
  columns?: number;
  className?: string;
}

export const ProgressGrid: React.FC<ProgressGridProps> = ({
  items,
  columns = 3,
  className = '',
}) => {
  return (
    <div className={`grid gap-6 ${className}`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex flex-col items-center"
        >
          <ProgressIndicator data={item} size="md" />
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              {getProgressIcon(item.type)}
              <span className="font-medium text-gray-700">{item.label}</span>
            </div>
            <div className="text-sm text-gray-500">
              {item.current} de {item.total} completados
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Componente de barra de progreso lineal
interface LinearProgressProps {
  percentage: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'blue' | 'green' | 'yellow' | 'purple';
  className?: string;
}

export const LinearProgress: React.FC<LinearProgressProps> = ({
  percentage,
  label,
  showPercentage = true,
  color = 'blue',
  className = '',
}) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm text-gray-500">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className={`h-2 rounded-full ${colorClasses[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}; 