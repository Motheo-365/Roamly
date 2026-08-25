export interface LocationResult {
    lat: string;
    lon: string;
    display_name: string;
}

import { API_URL } from "./api";

export async function searchLocations(
    query: string,
    signal?: AbortSignal
): Promise<LocationResult[]> {

    const response = await fetch(
        `${API_URL}/api/locations/search?q=${encodeURIComponent(query)}`,
        {
            signal,
        }
    );

    if (!response.ok) {
        throw new Error(
            "Unable to search locations."
        );
    }

    const result = await response.json();

    return result.data;
}