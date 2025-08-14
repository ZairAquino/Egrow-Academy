import 'dotenv/config';
import Stripe from 'stripe';
import * as fs from 'fs';

function getStripe(): Stripe {
	const key = process.env.STRIPE_SECRET_KEY;
	if (!key) throw new Error('Falta STRIPE_SECRET_KEY');
	return new Stripe(key, { apiVersion: '2025-06-30.basil' });
}

function parseArgs(): { apply: boolean; ids: string[] } {
	const args = process.argv.slice(2);
	const apply = args.includes('--apply');
	let ids: string[] = [];

	for (const arg of args) {
		if (arg.startsWith('--prices=')) {
			ids = arg.replace('--prices=', '').split(',').map(s => s.trim()).filter(Boolean);
		}
		if (arg.startsWith('--file=')) {
			const filePath = arg.replace('--file=', '');
			const raw = fs.readFileSync(filePath, 'utf-8');
			try {
				const parsed = JSON.parse(raw);
				if (Array.isArray(parsed)) {
					ids.push(...parsed);
				} else if (Array.isArray(parsed.prices)) {
					ids.push(...parsed.prices);
				} else if (Array.isArray(parsed.created)) {
					ids.push(...parsed.created.map((x: any) => x.priceId).filter(Boolean));
				}
			} catch (e) {
				console.error('No se pudo parsear el archivo JSON:', e);
			}
		}
	}

	ids = Array.from(new Set(ids));
	return { apply, ids };
}

async function main() {
	const stripe = getStripe();
	const { apply, ids } = parseArgs();

	if (ids.length === 0) {
		console.log('Uso: node scripts/deactivate-stripe-prices.ts --prices=price_ABC,price_DEF [--apply]');
		console.log('   o: node scripts/deactivate-stripe-prices.ts --file=backups/stripe-prices-*.json [--apply]');
		return;
	}

	console.log(`[${apply ? 'APPLY' : 'DRY RUN'}] Desactivando ${ids.length} prices...`);
	for (const id of ids) {
		if (!apply) {
			console.log(`- (dry) price ${id} -> active=false`);
			continue;
		}
		try {
			const updated = await stripe.prices.update(id, { active: false });
			console.log(`- OK ${id} active=${updated.active}`);
		} catch (e) {
			console.error(`- ERROR ${id}`, e);
		}
	}
}

main().catch(e => {
	console.error('Error:', e);
	process.exit(1);
});


