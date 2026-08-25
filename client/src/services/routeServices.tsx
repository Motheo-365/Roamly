export interface RouteResult {
    distance: number;
    duration: number;
    geometry: [number, number][];
}

import { API_URL } from "./api";

export async function getRoute(
    fromLat: number,
    fromLon: number,
    toLat: number,
    toLon: number
): Promise<RouteResult> {

    const params = new URLSearchParams({
        fromLat: String(fromLat),
        fromLon: String(fromLon),
        toLat: String(toLat),
        toLon: String(toLon),
    });

    const response = await fetch(
        `${API_URL}/api/routes?${params}`
    );

    if (!response.ok) {
        throw new Error(
            "Unable to calculate route."
        );
    }

    const result = await response.json();

    return result.data;
}