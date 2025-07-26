// Lazy Loading Components
import { lazy, Suspense } from 'react';

const LoginForm = lazy(() => import('@/components/auth/LoginForm'));
const RegisterForm = lazy(() => import('@/components/auth/RegisterForm'));
const PaymentForm = lazy(() => import('@/components/payments/PaymentForm'));
const WelcomeModal = lazy(() => import('@/components/ui/WelcomeModal'));

// Usage example:
// <Suspense fallback={<div>Loading...</div>}>
//   <ComponentName />
// </Suspense>

export {
  LoginForm,
  RegisterForm,
  PaymentForm,
  WelcomeModal
};
