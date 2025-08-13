'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormSteps from './components/FormSteps';
import BasicInfo from './components/BasicInfo';
import InstructorInfo from './components/InstructorInfo';
import LearningGoals from './components/LearningGoals';
import ModulesLessons from './components/ModulesLessons';
import Testimonials from './components/Testimonials';
import PricingConfig from './components/PricingConfig';
import PreviewCourse from './components/PreviewCourse';
import { useCourseForm } from './hooks/useCourseForm';
import { useAutoSave } from './hooks/useAutoSave';

export default function CreateCoursePage() {
  const router = useRouter();
  const {
    formData,
    currentStep,
    isValid,
    errors,
    nextStep,
    prevStep,
    goToStep,
    updateField,
    updateModule,
    updateLesson,
    saveAsDraft,
    publishCourse,
    validateStep,
    isStepValid,
    resetForm
  } = useCourseForm();

  const {
    saveStatus,
    lastSaved,
    forceSave
  } = useAutoSave(formData, saveAsDraft);

  const handleBack = () => {
    if (currentStep === 1) {
      router.push('/admin');
    } else {
      prevStep();
    }
  };

  const handleNext = async () => {
    if (validateStep(currentStep)) {
      await forceSave(); // Guardar antes de continuar
      nextStep();
    }
  };

  const handlePublish = async () => {
    try {
      const result = await publishCourse();
      if (result.success) {
        router.push(`/curso/${result.course?.slug}?preview=true`);
      }
    } catch (error) {
      console.error('Error publicando curso:', error);
    }
  };

  const stepComponents = {
    1: <BasicInfo formData={formData} updateField={updateField} errors={errors} />,
    2: <InstructorInfo formData={formData} updateField={updateField} errors={errors} />,
    3: <LearningGoals formData={formData} updateField={updateField} errors={errors} />,
    4: <ModulesLessons formData={formData} updateModule={updateModule} updateLesson={updateLesson} errors={errors} />,
    5: <Testimonials formData={formData} updateField={updateField} errors={errors} />,
    6: <PricingConfig formData={formData} updateField={updateField} errors={errors} />,
    7: <PreviewCourse formData={formData} onPublish={handlePublish} errors={errors} />
  };

  const stepTitles = {
    1: 'Información Básica',
    2: 'Información del Instructor', 
    3: 'Objetivos y Contenido',
    4: 'Módulos y Lecciones',
    5: 'Testimonios y Reviews',
    6: 'Configuración de Precios',
    7: 'Preview y Publicación'
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo y título */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBack}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Crear Nuevo Curso</h1>
                  <p className="text-sm text-gray-500">Step {currentStep} de 7: {stepTitles[currentStep as keyof typeof stepTitles]}</p>
                </div>
              </div>

              {/* Auto-save status */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm">
                  {saveStatus === 'saving' && (
                    <div className="flex items-center text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      Guardando...
                    </div>
                  )}
                  {saveStatus === 'saved' && (
                    <div className="flex items-center text-green-600">
                      <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Guardado
                    </div>
                  )}
                  {saveStatus === 'error' && (
                    <div className="flex items-center text-red-600">
                      <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      Error al guardar
                    </div>
                  )}
                  {lastSaved && (
                    <span className="text-gray-500">
                      Último guardado: {lastSaved.toLocaleTimeString()}
                    </span>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex space-x-3">
                  <button
                    onClick={saveAsDraft}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Guardar Borrador
                  </button>
                  
                  {currentStep < 7 ? (
                    <button
                      onClick={handleNext}
                      disabled={!isValid}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continuar
                    </button>
                  ) : (
                    <button
                      onClick={handlePublish}
                      disabled={!isValid}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Publicar Curso
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar con navegación de steps */}
            <div className="lg:col-span-1">
              <FormSteps 
                currentStep={currentStep} 
                goToStep={goToStep}
                isStepValid={isStepValid}
                stepTitles={stepTitles}
              />
            </div>

            {/* Contenido del step actual */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  {stepComponents[currentStep as keyof typeof stepComponents]}
                </div>
              </div>

              {/* Navegación inferior */}
              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={handleBack}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {currentStep === 1 ? 'Salir' : 'Anterior'}
                </button>

                <div className="flex space-x-3">
                  <button
                    onClick={saveAsDraft}
                    className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Guardar Borrador
                  </button>
                  
                  {currentStep < 7 ? (
                    <button
                      onClick={handleNext}
                      disabled={!isValid}
                      className="flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continuar
                      <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={handlePublish}
                      disabled={!isValid}
                      className="flex items-center px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Publicar Curso
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}