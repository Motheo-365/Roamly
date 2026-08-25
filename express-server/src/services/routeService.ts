export interface RouteResult {
    distance: number;
    duration: number;
    geometry: [number, number][];
}

export async function getRoute(
    fromLat: number,
    fromLon: number,
    toLat: number,
    toLon: number
): Promise<RouteResult> {

    const url = new URL(
        `https://router.project-osrm.org/route/v1/driving/${fromLon},${fromLat};${toLon},${toLat}`
    );

    url.searchParams.set("overview", "full");
    url.searchParams.set("geometries", "geojson");

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `OSRM request failed: ${response.status}`
        );
    }

    const data = await response.json();

    if (data.code !== "Ok" || !data.routes?.length) {
        throw new Error("No route found.");
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