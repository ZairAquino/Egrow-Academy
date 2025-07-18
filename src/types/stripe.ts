// Tipos para Stripe en eGrow Academy

export interface StripeCustomer {
  id: string;
  email: string;
  name?: string;
  metadata?: Record<string, string>;
  created: number;
}

export interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
  client_secret: string;
  metadata?: Record<string, string>;
  customer?: string;
  created: number;
}

export interface StripeSubscription {
  id: string;
  status: 'incomplete' | 'incomplete_expired' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid';
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  canceled_at?: number;
  ended_at?: number;
  trial_start?: number;
  trial_end?: number;
  customer: string;
  items: {
    data: Array<{
      id: string;
      price: {
        id: string;
        product: string;
        unit_amount: number;
        currency: string;
        recurring?: {
          interval: 'day' | 'week' | 'month' | 'year';
          interval_count: number;
        };
      };
    }>;
  };
  metadata?: Record<string, string>;
  latest_invoice?: {
    id: string;
    payment_intent?: {
      id: string;
      client_secret: string;
    };
  };
}

export interface StripeProduct {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  metadata?: Record<string, string>;
  created: number;
  default_price?: {
    id: string;
    unit_amount: number;
    currency: string;
    type: 'one_time' | 'recurring';
    recurring?: {
      interval: 'day' | 'week' | 'month' | 'year';
      interval_count: number;
    };
  };
}

export interface StripePrice {
  id: string;
  product: string;
  active: boolean;
  currency: string;
  type: 'one_time' | 'recurring';
  unit_amount: number;
  recurring?: {
    interval: 'day' | 'week' | 'month' | 'year';
    interval_count: number;
    trial_period_days?: number;
  };
  metadata?: Record<string, string>;
  created: number;
}

// Tipos para las respuestas de la API
export interface CreatePaymentIntentRequest {
  amount: number;
  currency?: string;
  courseId?: string;
  subscriptionId?: string;
  metadata?: Record<string, string>;
}

export interface CreateSubscriptionRequest {
  priceId: string;
  courseId?: string;
  trialPeriodDays?: number;
  metadata?: Record<string, string>;
}

export interface PaymentSuccessResponse {
  success: boolean;
  paymentIntentId: string;
  clientSecret: string;
  redirectUrl?: string;
}

export interface SubscriptionSuccessResponse {
  success: boolean;
  subscriptionId: string;
  clientSecret: string;
  redirectUrl?: string;
}

// Tipos para el estado de pagos en la aplicación
export interface PaymentStatus {
  id: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  amount: number;
  currency: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionStatus {
  id: string;
  status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  endedAt?: Date;
  trialStart?: Date;
  trialEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos para los webhooks de Stripe
export interface StripeWebhookEvent {
  id: string;
  object: 'event';
  api_version: string;
  created: number;
  data: {
    object: any;
  };
  livemode: boolean;
  pending_webhooks: number;
  request: {
    id?: string;
    idempotency_key?: string;
  };
  type: string;
}

export interface PaymentIntentSucceededEvent {
  id: string;
  object: 'payment_intent';
  amount: number;
  currency: string;
  status: 'succeeded';
  customer?: string;
  metadata?: Record<string, string>;
  created: number;
}

export interface SubscriptionUpdatedEvent {
  id: string;
  object: 'subscription';
  status: string;
  customer: string;
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  metadata?: Record<string, string>;
  created: number;
}

// Tipos para los errores de Stripe
export interface StripeError {
  type: string;
  code: string;
  message: string;
  param?: string;
  decline_code?: string;
  payment_intent?: {
    id: string;
    client_secret: string;
  };
}

// Tipos para la configuración de productos
export interface ProductConfig {
  name: string;
  description: string;
  prices: Array<{
    amount: number;
    currency: string;
    interval?: 'day' | 'week' | 'month' | 'year';
    intervalCount?: number;
    trialPeriodDays?: number;
  }>;
  metadata?: Record<string, string>;
}

// Tipos para el checkout
export interface CheckoutSession {
  id: string;
  url: string;
  status: 'open' | 'complete' | 'expired';
  payment_status: 'paid' | 'unpaid' | 'no_payment_required';
  customer?: string;
  metadata?: Record<string, string>;
  created: number;
  expires_at: number;
} 