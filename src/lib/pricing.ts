export type CurrencyCode = 'usd' | 'eur' | 'mxn' | 'ars';

// Precio en centavos para el fallback de PaymentIntent (modal) del curso en USD
export const COURSE_PRICE_USD_MINOR = 400;

// PVP mostrados en frontend por moneda
export const DISPLAY_PRICES = {
	monthly: {
		usd: 12.49,
		eur: 10.99,
		mxn: 249.5,
		ars: 15999,
	},
	yearly: {
		usd: 129.9,
		eur: 109.99,
		mxn: 2399,
		ars: 164999,
	},
	course: {
		usd: 4,
		eur: 3.49,
		mxn: 79,
		ars: 4999,
	},
} as const;

export function getCurrencySymbol(currency: CurrencyCode): string {
	switch (currency) {
		case 'usd': return '$';
		case 'eur': return '€';
		case 'mxn': return '$';
		case 'ars': return '$';
		default: return '$';
	}
}

export function getDisplayPrice(plan: 'monthly' | 'yearly' | 'course', currency: CurrencyCode): number {
	return DISPLAY_PRICES[plan][currency];
}

export function getCourseMinorAmount(currency: CurrencyCode): number {
	const val = DISPLAY_PRICES.course[currency];
	// Stripe minor units según moneda: USD/EUR/MXN/ARS usan 2 decimales actualmente
	return Math.round(val * 100);
}

