export interface LocationResult {
    lat: string;
    lon: string;
    display_name: string;
}

import { apiRequest } from "./api";

interface LocationSearchResponse {
    data: LocationResult[];
}

export async function searchLocations(
    query: string,
    signal?: AbortSignal
): Promise<LocationResult[]> {
    const params = new URLSearchParams({ q: query.trim() });
    const result = await apiRequest<LocationSearchResponse>(
        `/api/locations/search?${params.toString()}`,
        { signal }
    );

    return result.data;
}

export type NearbyLocationType =
    | "attraction"
    | "hotel"
    | "restaurant";

export async function searchNearbyLocations(
    latitude: number,
    longitude: number,
    type: NearbyLocationType
): Promise<LocationResult[]> {
    const params = new URLSearchParams({
        lat: String(latitude),
        lon: String(longitude),
        type,
    });
    const result = await apiRequest<LocationSearchResponse>(
        `/api/locations/nearby?${params.toString()}`
    );

    return result.data;
}