// Utilidades para disparar eventos a píxeles de anuncios (TikTok, LinkedIn, Meta)

declare global {
	interface Window {
		ttq?: any
		lintrk?: any
		fbq?: (...args: any[]) => void
	}
}

// ---- TikTok Pixel ----

export function trackTikTokViewContent(params: {
	contentId?: string
	contentName?: string
	value?: number
	currency?: string
	utm?: Record<string, any>
}) {
	if (typeof window !== 'undefined' && window.ttq) {
		window.ttq.track('ViewContent', {
			content_type: 'course',
			content_id: params.contentId,
			content_name: params.contentName,
			value: params.value,
			currency: params.currency || 'USD',
			...normalizeUtm(params.utm)
		})
	}
}

export function trackTikTokCompleteRegistration(params: {
	contentId?: string
	contentName?: string
	value?: number
	currency?: string
	utm?: Record<string, any>
}) {
	if (typeof window !== 'undefined' && window.ttq) {
		window.ttq.track('CompleteRegistration', {
			content_type: 'course',
			content_id: params.contentId,
			content_name: params.contentName,
			value: params.value,
			currency: params.currency || 'USD',
			...normalizeUtm(params.utm)
		})
	}
}

export function trackTikTokCompletePayment(params: {
	contentId?: string
	contentName?: string
	value: number
	currency?: string
	utm?: Record<string, any>
}) {
	if (typeof window !== 'undefined' && window.ttq) {
		window.ttq.track('CompletePayment', {
			content_type: 'course',
			content_id: params.contentId,
			content_name: params.contentName,
			value: params.value,
			currency: params.currency || 'USD',
			...normalizeUtm(params.utm)
		})
	}
}

// ---- LinkedIn Insight Tag ----

// Si dispones de un conversion id específico, puedes dispararlo aquí
export function trackLinkedInConversion(conversionId?: string) {
	if (typeof window !== 'undefined' && window.lintrk && conversionId) {
		try {
			window.lintrk('track', { conversion_id: conversionId })
		} catch {}
	}
}

// ---- Meta Pixel (opcional para compras) ----

export function trackMetaPurchase(params: { value: number; currency?: string }) {
	if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
		window.fbq('track', 'Purchase', {
			value: params.value,
			currency: params.currency || 'USD'
		})
	}
}

// ---- Helpers ----

function normalizeUtm(utm?: Record<string, any>) {
	if (!utm) return {}
	return {
		utm_source: utm.utm_source,
		utm_medium: utm.utm_medium,
		utm_campaign: utm.utm_campaign,
		utm_content: utm.utm_content,
		utm_term: utm.utm_term
	}
}


