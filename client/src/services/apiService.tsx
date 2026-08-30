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
    `/api/images/${encodeURIComponent(destination)}`,
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
  return apiRequest<TripResponse>(`/api/trips/${tripId}`);
}

export function createTrip(
  destination: string,
  startDate: string,
  endDate: string,
  travellers: number,
  description: string,
  budget: number,
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
  budget: number,
) {
  return apiRequest<TripResponse>(`/api/trips/${tripId}`, {
    method: "PUT",
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

export function deleteTrip(tripId: number) {
  return apiRequest<DeleteTripResponse>(`/api/trips/${tripId}`, {
    method: "DELETE",
  });
}

// Activity

export interface Activity {
  id: number;
  trip_id: number;
  title: string | null;
  date: string | null;
  time: string | null;
  location: string | null;
  cost: number | null;
}

interface ActivitiesResponse {
  status: string;
  data: Activity[];
}

interface ActivityResponse {
  status: string;
  data: Activity;
}

interface DeleteActivityResponse {
  status: string;
  message: string;
}

export function getActivitiesByTripId(tripId: number) {
  return apiRequest<ActivitiesResponse>(`/api/activities/trip/${tripId}`);
}

export function getActivity(activityId: number) {
  return apiRequest<ActivityResponse>(`/api/activities/${activityId}`);
}

export function createActivity(
  tripId: number,
  title: string,
  date: string,
  time: string,
  location: string,
  cost: number,
) {
  return apiRequest<ActivityResponse>("/api/activities", {
    method: "POST",
    body: JSON.stringify({
      tripId,
      title,
      date,
      time,
      location,
      cost,
    }),
  });
}

export function updateActivity(
  activityId: number,
  title: string,
  date: string,
  time: string,
  location: string,
  cost: number,
) {
  return apiRequest<ActivityResponse>(`/api/activities/${activityId}`, {
    method: "PUT",
    body: JSON.stringify({
      title,
      date,
      time,
      location,
      cost,
    }),
  });
}

export function deleteActivity(activityId: number) {
  return apiRequest<DeleteActivityResponse>(`/api/activities/${activityId}`, {
    method: "DELETE",
  });
}

// Expense

export interface Expense {
  id: number;
  trip_id: number;
  category: string | null;
  description: string | null;
  amount: number | null;
  date: string | null;
}

interface ExpensesResponse {
  status: string;
  data: Expense[];
}

interface ExpenseResponse {
  status: string;
  data: Expense;
}

interface DeleteExpenseResponse {
  status: string;
  message: string;
}

export function getExpensesByTripId(tripId: number) {
  return apiRequest<ExpensesResponse>(`/api/expenses/trip/${tripId}`);
}

export function getExpense(expenseId: number) {
  return apiRequest<ExpenseResponse>(`/api/expenses/${expenseId}`);
}

export function createExpense(
  tripId: number,
  category: string,
  description: string,
  amount: number,
  date: string,
) {
  return apiRequest<ExpenseResponse>("/api/expenses", {
    method: "POST",
    body: JSON.stringify({
      tripId,
      category,
      description,
      amount,
      date,
    }),
  });
}

export function updateExpense(
  expenseId: number,
  category: string,
  description: string,
  amount: number,
  date: string,
) {
  return apiRequest<ExpenseResponse>(`/api/expenses/${expenseId}`, {
    method: "PUT",
    body: JSON.stringify({
      category,
      description,
      amount,
      date,
    }),
  });
}

export function deleteExpense(expenseId: number) {
  return apiRequest<DeleteExpenseResponse>(`/api/expenses/${expenseId}`, {
    method: "DELETE",
  });
}
