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

const nearbyQueries: Record<NearbyLocationType, string> = {
    attraction: "tourism=attraction",
    hotel: "tourism=hotel",
    restaurant: "amenity=restaurant",
};

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
        [key: string]: string | undefined;
    };
}

interface OverpassResponse {
    elements: OverpassElement[];
}

export async function findNearbyLocations(
    latitude: number,
    longitude: number
): Promise<Record<NearbyLocationType, LocationResult[]>> {

    const query = `
        [out:json][timeout:15];

        nwr["tourism"="attraction"](around:5000,${latitude},${longitude});
        nwr["tourism"="hotel"](around:5000,${latitude},${longitude});
        nwr["amenity"="restaurant"](around:5000,${latitude},${longitude});

        out center tags;
    `;

    const requestOptions: RequestInit = {
        method: "POST",
        body: `data=${encodeURIComponent(query)}`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
            "User-Agent": "Roamly Travel App/1.0 (location search)",
        },
        signal: AbortSignal.timeout(20000),
    };

    const endpoints = [
        "https://overpass-api.de/api/interpreter",
        "https://overpass.private.coffee/api/interpreter",
    ];

    let response: Response | null = null;

    for (const endpoint of endpoints) {
        try {
            const currentResponse = await fetch(
                endpoint,
                requestOptions
            );

            if (currentResponse.ok) {
                response = currentResponse;
                break;
            }

            console.warn(
                `Overpass ${endpoint} returned ${currentResponse.status}`
            );

        } catch (error) {
            console.warn(
                `Overpass ${endpoint} failed`,
                error
            );
        }
    }

    if (!response) {
        throw new Error("Nearby location provider unavailable.");
    }

    const result =
        await response.json() as OverpassResponse;

    const places: Record<NearbyLocationType, LocationResult[]> = {
        attraction: [],
        hotel: [],
        restaurant: [],
    };

    result.elements
        .filter((element) => element.tags?.name)
        .forEach((element) => {

            const coordinates = element.center ?? {
                lat: element.lat,
                lon: element.lon,
            };

            if (
                coordinates.lat === undefined ||
                coordinates.lon === undefined
            ) {
                return;
            }

            const tags = element.tags ?? {};

            let type: NearbyLocationType | null = null;

            if (tags.tourism === "attraction") {
                type = "attraction";
            } else if (tags.tourism === "hotel") {
                type = "hotel";
            } else if (tags.amenity === "restaurant") {
                type = "restaurant";
            }

            if (!type) {
                return;
            }

            places[type].push({
                lat: String(coordinates.lat),
                lon: String(coordinates.lon),
                display_name: tags.name ?? "Unnamed place",
            });
        });

    places.attraction = places.attraction.slice(0, 20);
    places.hotel = places.hotel.slice(0, 20);
    places.restaurant = places.restaurant.slice(0, 20);

    return places;
}