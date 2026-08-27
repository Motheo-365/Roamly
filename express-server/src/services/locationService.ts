export interface LocationResult {
    lat: string;
    lon: string;
    display_name: string;
}

export async function searchLocations(
    query: string
): Promise<LocationResult[]> {

    const url = new URL(
        "https://nominatim.openstreetmap.org/search"
    );

    url.searchParams.set("format", "json");
    url.searchParams.set("q", query);
    url.searchParams.set("limit", "5");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("accept-language", "en");

    console.log("Nominatim URL:", url.toString());

    const response = await fetch(url, {
        headers: {
            "User-Agent": "Roamly Travel App",
            "Accept": "application/json",
        },
    });

    console.log(
        "Nominatim status:",
        response.status
    );

    if (!response.ok) {
        const errorText = await response.text();

        console.error(
            "Nominatim response:",
            errorText
        );

        throw new Error(
            `Nominatim request failed: ${response.status}`
        );
    }

    return response.json();
}

export type NearbyLocationType =
    | "attraction"
    | "hotel"
    | "restaurant";

export interface NearbyPlaces {
    attraction: LocationResult[];
    hotel: LocationResult[];
    restaurant: LocationResult[];
}

interface OverpassElement {
    type: "node" | "way" | "relation";
    id: number;

    lat?: number;
    lon?: number;

    center?: {
        lat: number;
        lon: number;
    };

    tags?: {
        name?: string;
        tourism?: string;
        amenity?: string;
        [key: string]: string | undefined;
    };
}

interface OverpassResponse {
    elements: OverpassElement[];
}

const endpoints = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
];

export async function findNearbyLocations(
    latitude: number,
    longitude: number
): Promise<NearbyPlaces> {

    const query = `
        [out:json][timeout:20];

        (
            nwr["tourism"="attraction"](
                around:3000,
                ${latitude},
                ${longitude}
            );

            nwr["tourism"="hotel"](
                around:3000,
                ${latitude},
                ${longitude}
            );

            nwr["amenity"="restaurant"](
                around:3000,
                ${latitude},
                ${longitude}
            );
        );

        out center tags;
    `;

    const requestOptions: RequestInit = {
        method: "POST",
        body: `data=${encodeURIComponent(query)}`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
            "User-Agent": "Roamly Travel App/1.0",
        },
    };

    let lastError = "Nearby provider failed.";

    for (const endpoint of endpoints) {
        try {
            console.log(
                `Trying Overpass endpoint: ${endpoint}`
            );

            const response = await fetch(endpoint, {
                ...requestOptions,
                signal: AbortSignal.timeout(25000),
            });

            console.log(
                `Overpass ${endpoint} status:`,
                response.status
            );

            if (!response.ok) {
                const errorText = await response.text();

                console.error(
                    `Overpass ${endpoint} response:`,
                    errorText
                );

                lastError =
                    `Overpass returned ${response.status}`;

                continue;
            }

            const result =
                await response.json() as OverpassResponse;

            const places: NearbyPlaces = {
                attraction: [],
                hotel: [],
                restaurant: [],
            };

            for (const element of result.elements) {

                if (!element.tags?.name) {
                    continue;
                }

                const coordinates = element.center ?? {
                    lat: element.lat,
                    lon: element.lon,
                };

                if (
                    coordinates.lat === undefined ||
                    coordinates.lon === undefined
                ) {
                    continue;
                }

                const place: LocationResult = {
                    lat: String(coordinates.lat),
                    lon: String(coordinates.lon),
                    display_name: element.tags.name,
                };

                if (
                    element.tags.tourism === "attraction"
                ) {
                    places.attraction.push(place);
                }

                if (
                    element.tags.tourism === "hotel"
                ) {
                    places.hotel.push(place);
                }

                if (
                    element.tags.amenity === "restaurant"
                ) {
                    places.restaurant.push(place);
                }
            }

            places.attraction =
                places.attraction.slice(0, 20);

            places.hotel =
                places.hotel.slice(0, 20);

            places.restaurant =
                places.restaurant.slice(0, 20);

            console.log(
                `Nearby results: attractions=${places.attraction.length}, hotels=${places.hotel.length}, restaurants=${places.restaurant.length}`
            );

            return places;

        } catch (error) {

            console.error(
                `Overpass endpoint failed: ${endpoint}`,
                error
            );

            lastError =
                error instanceof Error
                    ? error.message
                    : "Nearby provider failed.";
        }
    }

    throw new Error(lastError);
}