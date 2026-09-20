export class FincruxError extends Error {
	readonly status?: number;
	readonly body?: unknown;

	constructor(message: string, options?: { status?: number; body?: unknown }) {
		super(message);
		this.name = 'FincruxError';
		this.status = options?.status;
		this.body = options?.body;
	}
}

export function isSuccess(value: unknown): boolean {
	return value === true || value === 'true';
}

export function messageFromBody(body: unknown, fallback: string): string {
	if (
		typeof body === 'object' &&
		body !== null &&
		'message' in body &&
		(body as { message?: unknown }).message != null
	) {
		return String((body as { message: unknown }).message);
	}
	return fallback;
}

export function cleanParams(
	params?: Record<string, string | number | boolean | null | undefined>,
): Record<string, string> | undefined {
	if (!params) return undefined;
	const out: Record<string, string> = {};
	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null) continue;
		out[key] = String(value);
	}
	return Object.keys(out).length > 0 ? out : undefined;
}
