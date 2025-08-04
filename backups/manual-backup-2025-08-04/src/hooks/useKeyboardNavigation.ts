'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface KeyboardNavigationOptions {
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onTab?: () => void;
  enabled?: boolean;
}

export const useKeyboardNavigation = (options: KeyboardNavigationOptions = {}) => {
  const {
    onEscape,
    onEnter,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onTab,
    enabled = true
  } = options;

  const router = useRouter();
  const elementRef = useRef<HTMLElement>(null);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        onEscape?.();
        break;
      
      case 'Enter':
        if (event.target === elementRef.current) {
          event.preventDefault();
          onEnter?.();
        }
        break;
      
      case 'ArrowUp':
        event.preventDefault();
        onArrowUp?.();
        break;
      
      case 'ArrowDown':
        event.preventDefault();
        onArrowDown?.();
        break;
      
      case 'ArrowLeft':
        event.preventDefault();
        onArrowLeft?.();
        break;
      
      case 'ArrowRight':
        event.preventDefault();
        onArrowRight?.();
        break;
      
      case 'Tab':
        onTab?.();
        break;
    }
  }, [enabled, onEscape, onEnter, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, onTab]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('keydown', handleKeyDown);
    element.setAttribute('tabindex', '0');
    element.setAttribute('role', 'button');

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return elementRef;
};

// Hook específico para navegación de menús
export const useMenuNavigation = (items: string[], onSelect?: (index: number) => void) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => (prev + 1) % items.length);
        break;
      
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => (prev - 1 + items.length) % items.length);
        break;
      
      case 'Enter':
        event.preventDefault();
        onSelect?.(selectedIndex);
        setIsOpen(false);
        break;
      
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        break;
    }
  }, [isOpen, items.length, selectedIndex, onSelect]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    selectedIndex,
    isOpen,
    setIsOpen,
    setSelectedIndex
  };
};

// Hook para navegación de formularios
export const useFormNavigation = (fields: string[], onSubmit?: () => void) => {
  const [currentField, setCurrentField] = useState(0);
  const fieldRefs = useRef<(HTMLInputElement | HTMLTextAreaElement | null)[]>([]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'Tab':
        event.preventDefault();
        const nextField = event.shiftKey ? currentField - 1 : currentField + 1;
        if (nextField >= 0 && nextField < fields.length) {
          setCurrentField(nextField);
          fieldRefs.current[nextField]?.focus();
        }
        break;
      
      case 'Enter':
        if (event.target === fieldRefs.current[currentField]) {
          event.preventDefault();
          const nextField = currentField + 1;
          if (nextField < fields.length) {
            setCurrentField(nextField);
            fieldRefs.current[nextField]?.focus();
          } else {
            onSubmit?.();
          }
        }
        break;
    }
  }, [currentField, fields.length, onSubmit]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    currentField,
    fieldRefs,
    setCurrentField
  };
};

// Hook para navegación de modales
export const useModalNavigation = (onClose?: () => void) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose?.();
    }
  }, [onClose]);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    modal.addEventListener('keydown', handleKeyDown);
    modal.setAttribute('tabindex', '0');
    modal.focus();

    return () => {
      modal.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return modalRef;
}; 