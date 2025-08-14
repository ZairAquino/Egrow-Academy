export type CurrencyCode = 'usd' | 'eur' | 'mxn' | 'ars';

// Conjunto simple de países de la UE/Eurozona para mapear a EUR
const EURO_COUNTRIES = new Set([
	'AT','BE','CY','EE','FI','FR','DE','GR','IE','IT','LV','LT','LU','MT','NL','PT','SK','SI','ES'
]);

export function resolveCurrencyFromCountry(countryCode?: string | null): CurrencyCode {
	if (!countryCode) return 'usd';
	const cc = countryCode.toUpperCase();
	if (cc === 'MX') return 'mxn';
	if (cc === 'AR') return 'ars';
	if (EURO_COUNTRIES.has(cc)) return 'eur';
	return 'usd';
}


