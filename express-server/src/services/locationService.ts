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
];

export async function findNearbyLocations(
    latitude: number,
    longitude: number
): Promise<NearbyPlaces> {

    const endpoint =
        "https://overpass-api.de/api/interpreter";

    const query = `
        [out:json][timeout:10];
        node(around:1000,${latitude},${longitude})["tourism"];
        out tags;
    `;

    console.log("Testing Overpass...");
    console.log("Query:", query);

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            body: `data=${encodeURIComponent(query)}`,
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded",
                "Accept": "application/json",
                "User-Agent":
                    "Roamly Travel App/1.0",
            },
            signal: AbortSignal.timeout(15000),
        });

        console.log(
            "Overpass test status:",
            response.status
        );

        const text = await response.text();

        console.log(
            "Overpass test response:",
            text.slice(0, 1000)
        );

        return {
            attraction: [],
            hotel: [],
            restaurant: [],
        };

    } catch (error) {
        console.error(
            "OVERPASS TEST FAILED:",
            error
        );

        throw error;
    }
}