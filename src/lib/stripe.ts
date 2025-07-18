import Stripe from 'stripe';

// Configuración de Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

// Configuración del cliente de Stripe para el frontend
export const getStripeClient = () => {
  return new Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!, {
    apiVersion: '2025-06-30.basil',
  });
};

// Tipos para los productos de Stripe
export interface StripeProduct {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  metadata?: Record<string, string>;
}

export interface StripePrice {
  id: string;
  productId: string;
  active: boolean;
  currency: string;
  type: 'one_time' | 'recurring';
  unitAmount?: number;
  interval?: 'day' | 'week' | 'month' | 'year';
  intervalCount?: number;
  trialPeriodDays?: number;
}

// Funciones para crear productos y precios
export const createStripeProduct = async (productData: {
  name: string;
  description?: string;
  metadata?: Record<string, string>;
}) => {
  try {
    const product = await stripe.products.create({
      name: productData.name,
      description: productData.description,
      metadata: productData.metadata,
    });
    return product;
  } catch (error) {
    console.error('Error creating Stripe product:', error);
    throw error;
  }
};

export const createStripePrice = async (priceData: {
  productId: string;
  unitAmount: number;
  currency?: string;
  type?: 'one_time' | 'recurring';
  interval?: 'day' | 'week' | 'month' | 'year';
  intervalCount?: number;
  trialPeriodDays?: number;
}) => {
  try {
    const price = await stripe.prices.create({
      product: priceData.productId,
      unit_amount: priceData.unitAmount,
      currency: priceData.currency || 'usd',
      recurring: priceData.type === 'recurring' ? {
        interval: priceData.interval || 'month',
        interval_count: priceData.intervalCount || 1,
        trial_period_days: priceData.trialPeriodDays,
      } : undefined,
    });
    return price;
  } catch (error) {
    console.error('Error creating Stripe price:', error);
    throw error;
  }
};

// Función para crear un PaymentIntent
export const createPaymentIntent = async (data: {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
  customerId?: string;
}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: data.amount,
      currency: data.currency || 'usd',
      metadata: data.metadata,
      customer: data.customerId,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

// Función para crear una suscripción
export const createSubscription = async (data: {
  customerId: string;
  priceId: string;
  metadata?: Record<string, string>;
  trialPeriodDays?: number;
}) => {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: data.customerId,
      items: [{ price: data.priceId }],
      metadata: data.metadata,
      trial_period_days: data.trialPeriodDays,
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });
    return subscription;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

// Función para crear o recuperar un cliente
export const createOrRetrieveCustomer = async (email: string, userId: string) => {
  try {
    // Buscar cliente existente por email
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      return existingCustomers.data[0];
    }

    // Crear nuevo cliente
    const customer = await stripe.customers.create({
      email: email,
      metadata: {
        userId: userId,
      },
    });

    return customer;
  } catch (error) {
    console.error('Error creating/retrieving customer:', error);
    throw error;
  }
};

// Función para cancelar una suscripción
export const cancelSubscription = async (subscriptionId: string, cancelAtPeriodEnd: boolean = true) => {
  try {
    if (cancelAtPeriodEnd) {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
      return subscription;
    } else {
      const subscription = await stripe.subscriptions.cancel(subscriptionId);
      return subscription;
    }
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};

// Función para recuperar una suscripción
export const retrieveSubscription = async (subscriptionId: string) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['latest_invoice', 'customer'],
    });
    return subscription;
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    throw error;
  }
};

// Función para listar productos
export const listProducts = async (active?: boolean) => {
  try {
    const products = await stripe.products.list({
      active: active,
      expand: ['data.default_price'],
    });
    return products;
  } catch (error) {
    console.error('Error listing products:', error);
    throw error;
  }
};

// Función para listar precios de un producto
export const listPrices = async (productId: string, active?: boolean) => {
  try {
    const prices = await stripe.prices.list({
      product: productId,
      active: active,
    });
    return prices;
  } catch (error) {
    console.error('Error listing prices:', error);
    throw error;
  }
};

export default stripe; 