const DEFAULT_API_URL = "https://roamly-7ogn.onrender.com";

export const API_URL = (
  import.meta.env.VITE_API_URL || DEFAULT_API_URL
).replace(/\/$/, "");

interface ApiErrorResponse {
  message?: string;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = localStorage.getItem("roamly_token");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const result = (await response.json()) as T & ApiErrorResponse;

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

//Image
interface ImageResponse {
    status: string;
    data: {
        url: string;
    };
}

export function getDestinationImage(destination: string) {
    return apiRequest<ImageResponse>(
        `/api/images/${encodeURIComponent(destination)}`
    );
}

// Trip
export interface Trip {
    id: number;
    user_id: number;
    destination: string | null;
    start_date: string | null;
    end_date: string | null;
    travellers: number;
    description: string | null;
    budget: number;
}

interface TripsResponse {
    status: string;
    data: Trip[];
}

interface TripResponse {
    status: string;
    data: Trip;
}

interface DeleteTripResponse {
    status: string;
    message: string;
}

export function getTrips() {
    return apiRequest<TripsResponse>("/api/trips");
}

export function getTrip(tripId: number) {
    return apiRequest<TripResponse>(
        `/api/trips/${tripId}`
    );
}

export function createTrip(
    destination: string,
    startDate: string,
    endDate: string,
    travellers: number,
    description: string,
    budget: number
) {
    return apiRequest<TripResponse>("/api/trips", {
        method: "POST",
        body: JSON.stringify({
            destination,
            startDate,
            endDate,
            travellers,
            description,
            budget,
        }),
    });
}

export function updateTrip(
    tripId: number,
    destination: string,
    startDate: string,
    endDate: string,
    travellers: number,
    description: string,
    budget: number
) {
    return apiRequest<TripResponse>(
        `/api/trips/${tripId}`,
        {
            method: "PUT",
            body: JSON.stringify({
                destination,
                startDate,
                endDate,
                travellers,
                description,
                budget,
            }),
        }
    );
}

export function deleteTrip(tripId: number) {
    return apiRequest<DeleteTripResponse>(
        `/api/trips/${tripId}`,
        {
            method: "DELETE",
        }
    );
}