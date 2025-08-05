"use client";

import React from 'react';
import WebinarRegistrationForm from './WebinarRegistrationForm';
import { Webinar } from '@/types/webinar';

interface WebinarRegistrationWrapperProps {
  webinar: Webinar;
}

export default function WebinarRegistrationWrapper({ webinar }: WebinarRegistrationWrapperProps) {
  const handleSuccess = () => {
    // Analytics tracking
    if (typeof window !== 'undefined') {
      // Track successful registration
      console.log('Webinar registration successful');
    }
  };

  const handleError = (message: string) => {
    // Mostrar error de manera amigable al usuario
    console.log('Registration error:', message);
    // Aquí podrías agregar un toast o notificación visual
  };

  return (
    <WebinarRegistrationForm 
      webinar={webinar}
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
} 