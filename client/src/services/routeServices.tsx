export interface RouteResult {
    distance: number;
    duration: number;
    geometry: [number, number][];
}

import { apiRequest } from "./api";

interface RouteResponse {
    data: RouteResult;
}

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

    try {
        const result = await apiRequest<RouteResponse>(
            `/api/routes?${params.toString()}`
        );

        return result.data;
    } catch (error) {
        if (!(error instanceof Error) || error.message !== "Route not found") {
            throw error;
        }

        const osrmUrl = new URL(
            `https://router.project-osrm.org/route/v1/driving/${fromLon},${fromLat};${toLon},${toLat}`
        );

        osrmUrl.searchParams.set("overview", "full");
        osrmUrl.searchParams.set("geometries", "geojson");

        const response = await fetch(osrmUrl);
        const data = await response.json();

        if (!response.ok || data.code !== "Ok" || !data.routes?.length) {
            throw new Error("Unable to calculate route.", { cause: error });
        }

        const route = data.routes[0];

        return {
            distance: route.distance,
            duration: route.duration,
            geometry: route.geometry.coordinates.map(
                ([longitude, latitude]: [number, number]) => [
                    latitude,
                    longitude,
                ]
            ),
        };
    }
}