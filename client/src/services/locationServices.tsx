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