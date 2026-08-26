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

export async function findNearbyLocations(
    latitude: number,
    longitude: number,
    type: NearbyLocationType
): Promise<LocationResult[]> {
    const offset = 0.15;
    const url = new URL("https://nominatim.openstreetmap.org/search");

    url.searchParams.set("format", "json");
    url.searchParams.set("q", nearbyQueries[type]);
    url.searchParams.set(
        "viewbox",
        `${longitude - offset},${latitude + offset},${longitude + offset},${latitude - offset}`
    );
    url.searchParams.set("bounded", "1");
    url.searchParams.set("limit", "20");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("accept-language", "en");

    const response = await fetch(url, {
        headers: {
            "User-Agent": "Roamly Travel App",
            "Accept": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Nominatim request failed: ${response.status}`);
    }

    return response.json();
}