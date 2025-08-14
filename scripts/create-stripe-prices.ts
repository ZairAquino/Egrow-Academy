import 'dotenv/config';
import Stripe from 'stripe';
import * as fs from 'fs';
import * as path from 'path';

// Este script crea (o recupera si ya existen) los precios en Stripe para 4 monedas,
// usando lookup_key estable y fácil de mapear desde backend/frontend.
// Requiere STRIPE_SECRET_KEY en el entorno. Usa el modo test o live según la clave.

type CurrencyCode = 'usd' | 'eur' | 'mxn' | 'ars';

interface PlannedPrice {
	lookupKey: string;
	currency: CurrencyCode;
	unitAmount: number; // minor units
	recurring?: { interval: 'month' | 'year' };
	nickname: string;
}

interface CreatedPriceSummary {
	lookupKey: string;
	priceId: string;
	currency: CurrencyCode;
	unitAmount: number;
	recurring?: { interval: 'month' | 'year' };
	productId: string;
}

function getStripe(): Stripe {
	const key = process.env.STRIPE_SECRET_KEY;
	if (!key) {
		throw new Error('Falta STRIPE_SECRET_KEY en el entorno');
	}
	return new Stripe(key, { apiVersion: '2025-06-30.basil' });
}

function isLiveKey(key: string): boolean {
	return key.startsWith('sk_live_');
}

async function ensureProduct(stripe: Stripe, name: string, metadata: Record<string, string>): Promise<Stripe.Product> {
	// Intentar encontrar por nombre exacto
	const list = await stripe.products.list({ active: true, limit: 100 });
	const found = list.data.find(p => p.name === name);
	if (found) return found;
	// Crear si no existe
	return stripe.products.create({ name, metadata });
}

async function getExistingPriceByLookupKey(stripe: Stripe, lookupKey: string): Promise<Stripe.Price | null> {
	// Stripe permite filtrar por lookup_keys en list
	try {
		const res = await stripe.prices.list({ lookup_keys: [lookupKey], limit: 1, expand: ['data.product'] as any });
		return res.data[0] ?? null;
	} catch {
		return null;
	}
}

async function ensurePrice(
	stripe: Stripe,
	productId: string,
	planned: PlannedPrice
): Promise<Stripe.Price> {
	const existing = await getExistingPriceByLookupKey(stripe, planned.lookupKey);
	if (existing) return existing;
	return stripe.prices.create({
		product: productId,
		currency: planned.currency,
		unit_amount: planned.unitAmount,
		lookup_key: planned.lookupKey,
		nickname: planned.nickname,
		recurring: planned.recurring ? { interval: planned.recurring.interval } : undefined,
	});
}

function buildPlannedPrices(): {
	monthly: PlannedPrice[];
	yearly: PlannedPrice[];
	course: PlannedPrice[];
} {
	// PVP confirmados por el usuario
	// Mensual: USD 12.49, EUR 10.99, MXN 249.50, ARS 15,999
	// Anual:   USD 129.90, EUR 109.99, MXN 2,399,  ARS 164,999
	// Curso:   USD 4.00,   EUR 3.49,  MXN 79,      ARS 4,999

	const monthly: PlannedPrice[] = [
		{ lookupKey: 'sub_monthly_usd', currency: 'usd', unitAmount: 1249, recurring: { interval: 'month' }, nickname: 'Monthly USD 12.49' },
		{ lookupKey: 'sub_monthly_eur', currency: 'eur', unitAmount: 1099, recurring: { interval: 'month' }, nickname: 'Monthly EUR 10.99' },
		{ lookupKey: 'sub_monthly_mxn', currency: 'mxn', unitAmount: 24950, recurring: { interval: 'month' }, nickname: 'Monthly MXN 249.50' },
		{ lookupKey: 'sub_monthly_ars', currency: 'ars', unitAmount: 1599900, recurring: { interval: 'month' }, nickname: 'Monthly ARS 15999' },
	];

	const yearly: PlannedPrice[] = [
		{ lookupKey: 'sub_yearly_usd', currency: 'usd', unitAmount: 12990, recurring: { interval: 'year' }, nickname: 'Yearly USD 129.90' },
		{ lookupKey: 'sub_yearly_eur', currency: 'eur', unitAmount: 10999, recurring: { interval: 'year' }, nickname: 'Yearly EUR 109.99' },
		{ lookupKey: 'sub_yearly_mxn', currency: 'mxn', unitAmount: 239900, recurring: { interval: 'year' }, nickname: 'Yearly MXN 2399' },
		{ lookupKey: 'sub_yearly_ars', currency: 'ars', unitAmount: 16499900, recurring: { interval: 'year' }, nickname: 'Yearly ARS 164999' },
	];

	const course: PlannedPrice[] = [
		{ lookupKey: 'course_lifetime_usd', currency: 'usd', unitAmount: 400, nickname: 'Course USD 4.00' },
		{ lookupKey: 'course_lifetime_eur', currency: 'eur', unitAmount: 349, nickname: 'Course EUR 3.49' },
		{ lookupKey: 'course_lifetime_mxn', currency: 'mxn', unitAmount: 7900, nickname: 'Course MXN 79' },
		{ lookupKey: 'course_lifetime_ars', currency: 'ars', unitAmount: 499900, nickname: 'Course ARS 4999' },
	];

	return { monthly, yearly, course };
}

async function main() {
	const stripeKey = process.env.STRIPE_SECRET_KEY || '';
	const stripe = getStripe();
	const envLabel = isLiveKey(stripeKey) ? 'live' : 'test';
	const apply = process.argv.includes('--apply');

	const planned = buildPlannedPrices();

	const monthlyProduct = await ensureProduct(stripe, 'eGrow Subscription Monthly', { kind: 'subscription', interval: 'month' });
	const yearlyProduct = await ensureProduct(stripe, 'eGrow Subscription Yearly', { kind: 'subscription', interval: 'year' });
	const courseProduct = await ensureProduct(stripe, 'eGrow Course Lifetime', { kind: 'one_time' });

	const toCreate = [
		...planned.monthly.map(p => ({ p, productId: monthlyProduct.id })),
		...planned.yearly.map(p => ({ p, productId: yearlyProduct.id })),
		...planned.course.map(p => ({ p, productId: courseProduct.id })),
	];

	if (!apply) {
		console.log(`[DRY RUN] Entorno: ${envLabel}`);
		console.log('Productos:');
		console.log(` - Monthly product: ${monthlyProduct.id}`);
		console.log(` - Yearly product:  ${yearlyProduct.id}`);
		console.log(` - Course product:  ${courseProduct.id}`);
		console.log('Precios planificados (lookup_key, currency, unit_amount):');
		for (const item of toCreate) {
			console.log(` - ${item.p.lookupKey} | ${item.p.currency} | ${item.p.unitAmount} | product=${item.productId}${item.p.recurring ? ' | ' + item.p.recurring.interval : ''}`);
		}
		console.log('Ejecuta con --apply para crear/asegurar precios.');
		return;
	}

	const created: CreatedPriceSummary[] = [];
	for (const item of toCreate) {
		const price = await ensurePrice(stripe, item.productId, item.p);
		created.push({
			lookupKey: item.p.lookupKey,
			priceId: price.id,
			currency: item.p.currency,
			unitAmount: item.p.unitAmount,
			recurring: item.p.recurring,
			productId: item.productId,
		});
		console.log(`Asegurado precio ${item.p.lookupKey}: ${price.id}`);
	}

	// Guardar mapping a archivo
	const outDir = path.join(process.cwd(), 'backups');
	if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
	const ts = new Date().toISOString().replace(/[:.]/g, '-');
	const outFile = path.join(outDir, `stripe-prices-${envLabel}-${ts}.json`);
	fs.writeFileSync(outFile, JSON.stringify({ env: envLabel, created }, null, 2), 'utf-8');
	console.log(`Guardado mapping en: ${outFile}`);
}

main().catch(err => {
	console.error('Error ejecutando script:', err);
	process.exit(1);
});


