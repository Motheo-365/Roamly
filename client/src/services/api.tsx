const DEFAULT_API_URL = "https://roamly-7ogn.onrender.com";

export const API_URL = (
	import.meta.env.VITE_API_URL || DEFAULT_API_URL
).replace(/\/$/, "");

interface ApiErrorResponse {
	message?: string;
}

export async function apiRequest<T>(
	path: string,
	options: RequestInit = {}
): Promise<T> {
	const headers = new Headers(options.headers);

	if (options.body && !headers.has("Content-Type")) {
		headers.set("Content-Type", "application/json");
	}

	const response = await fetch(`${API_URL}${path}`, {
		...options,
		headers,
	});

	const result = await response.json() as T & ApiErrorResponse;

	if (!response.ok) {
		throw new Error(result.message || "The request could not be completed.");
	}

	return result;
}

export interface AuthResponse {
	status: string;
	message: string;
	data: {
		id: string;
		email: string;
		token?: string;
	};
}

export function registerUser(email: string, password: string) {
	return apiRequest<AuthResponse>("/api/auth/register", {
		method: "POST",
		body: JSON.stringify({ email, password }),
	});
}

export function loginUser(email: string, password: string) {
	return apiRequest<AuthResponse>("/api/auth/login", {
		method: "POST",
		body: JSON.stringify({ email, password }),
	});
}
