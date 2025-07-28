// Lazy Loading Components using Next.js dynamic imports
import dynamic from 'next/dynamic';
import React from 'react';

const LoginForm = dynamic(() => import('@/components/auth/LoginForm'), {
  loading: () => React.createElement('div', null, 'Loading...'),
  ssr: false
});

const RegisterForm = dynamic(() => import('@/components/auth/RegisterForm'), {
  loading: () => React.createElement('div', null, 'Loading...'),
  ssr: false
});

const PaymentForm = dynamic(() => import('@/components/payments/PaymentForm'), {
  loading: () => React.createElement('div', null, 'Loading...'),
  ssr: false
});

const WelcomeModal = dynamic(() => import('@/components/ui/WelcomeModal'), {
  loading: () => React.createElement('div', null, 'Loading...'),
  ssr: false
});

export {
  LoginForm,
  RegisterForm,
  PaymentForm,
  WelcomeModal
};
