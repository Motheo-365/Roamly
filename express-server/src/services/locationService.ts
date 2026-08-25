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

    const response = await fetch(url, {
        headers: {
            "User-Agent": "Roamly Travel App",
        },
    });

    if (!response.ok) {
        throw new Error(
            `Nominatim request failed: ${response.status}`
        );
    }

    return response.json();
}