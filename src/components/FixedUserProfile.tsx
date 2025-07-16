'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import UserProfile from './UserProfile';

export default function FixedUserProfile() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 999999,
      background: 'rgba(0, 0, 0, 0.9)',
      backdropFilter: 'blur(15px)',
      borderRadius: '12px',
      padding: '8px',
      border: '2px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
      pointerEvents: 'auto'
    }}>
      <UserProfile />
    </div>,
    document.body
  );
}