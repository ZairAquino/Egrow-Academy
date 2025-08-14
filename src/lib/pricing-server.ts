import stripe from '@/lib/stripe';
import type { CurrencyCode } from '@/lib/pricing';

// Lookup keys para todos los precios en las 4 monedas
const LOOKUP_KEYS = {
	subscription: {
		monthly: {
			usd: 'sub_monthly_usd',
			eur: 'sub_monthly_eur',
			mxn: 'sub_monthly_mxn',
			ars: 'sub_monthly_ars',
		},
		yearly: {
			usd: 'sub_yearly_usd',
			eur: 'sub_yearly_eur',
			mxn: 'sub_yearly_mxn',
			ars: 'sub_yearly_ars',
		},
	},
	course: {
		usd: 'course_lifetime_usd',
		eur: 'course_lifetime_eur',
		mxn: 'course_lifetime_mxn',
		ars: 'course_lifetime_ars',
	},
} as const;

const priceIdCache = new Map<string, string>();

async function getPriceIdByLookupKey(lookupKey: string): Promise<string> {
	const cached = priceIdCache.get(lookupKey);
	if (cached) return cached;

	const res = await stripe.prices.list({ lookup_keys: [lookupKey], limit: 1 });
	const price = res.data[0];
	if (!price) {
		throw new Error(`Stripe price no encontrado para lookup_key: ${lookupKey}`);
	}
	priceIdCache.set(lookupKey, price.id);
	return price.id;
}

export async function getSubscriptionPriceId(
	plan: 'monthly' | 'yearly',
	currency: CurrencyCode = 'usd'
): Promise<string> {
	const lookupKey = LOOKUP_KEYS.subscription[plan][currency];
	return getPriceIdByLookupKey(lookupKey);
}

export async function getCoursePriceId(currency: CurrencyCode = 'usd'): Promise<string> {
	const lookupKey = LOOKUP_KEYS.course[currency];
	return getPriceIdByLookupKey(lookupKey);
}


