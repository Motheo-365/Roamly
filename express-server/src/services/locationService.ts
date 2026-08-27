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
    longitude: number,
    type: NearbyLocationType
): Promise<LocationResult[]> {

    const [tagKey, tagValue] = nearbyQueries[type].split("=");

    const query = `
        [out:json][timeout:25];
        nwr[
            "${tagKey}"="${tagValue}"
        ](
            around:5000,
            ${latitude},
            ${longitude}
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

    const endpoints = [
        "https://overpass-api.de/api/interpreter",
        "https://overpass.kumi.systems/api/interpreter",
        "https://overpass.private.coffee/api/interpreter",
    ];

    let lastError = "Nearby provider failed.";

    for (const endpoint of endpoints) {
        try {
            console.log(`Trying Overpass endpoint: ${endpoint}`);

            const response = await fetch(
                endpoint,
                {
                    ...requestOptions,
                    signal: AbortSignal.timeout(30000),
                }
            );

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

                lastError = `Overpass returned ${response.status}`;
                continue;
            }

            const result =
                await response.json() as OverpassResponse;

            return result.elements
                .filter(
                    (element) =>
                        element.tags?.name
                )
                .map((element) => {

                    const coordinates =
                        element.center ?? {
                            lat: element.lat,
                            lon: element.lon,
                        };

                    return {
                        lat: String(
                            coordinates.lat
                        ),
                        lon: String(
                            coordinates.lon
                        ),
                        display_name:
                            element.tags?.name ??
                            "Unnamed place",
                    };
                })
                .filter(
                    (place) =>
                        place.lat !== "undefined" &&
                        place.lon !== "undefined"
                )
                .slice(0, 20);

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