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


interface GooglePlace {
    displayName?: {
        text?: string;
    };

    location?: {
        latitude?: number;
        longitude?: number;
    };
}


interface GooglePlacesResponse {
    places?: GooglePlace[];
}


const googlePlaceTypes: Record<
    NearbyLocationType,
    string
> = {
    attraction: "tourist_attraction",
    hotel: "hotel",
    restaurant: "restaurant",
};


async function searchGooglePlaces(
    latitude: number,
    longitude: number,
    type: NearbyLocationType
): Promise<LocationResult[]> {

    const apiKey =
        process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
        throw new Error(
            "GOOGLE_PLACES_API_KEY is not configured."
        );
    }

    const response = await fetch(
        "https://places.googleapis.com/v1/places:searchNearby",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": apiKey,
                "X-Goog-FieldMask":
                    "places.displayName,places.location",
            },

            body: JSON.stringify({
                includedTypes: [
                    googlePlaceTypes[type],
                ],

                maxResultCount: 20,

                locationRestriction: {
                    circle: {
                        center: {
                            latitude,
                            longitude,
                        },

                        radius: 3000,
                    },
                },

                rankPreference: "DISTANCE",
            }),
        }
    );

    console.log(
        `Google Places ${type} status:`,
        response.status
    );

    if (!response.ok) {

        const errorText =
            await response.text();

        console.error(
            `Google Places ${type} response:`,
            errorText
        );

        throw new Error(
            `Google Places request failed: ${response.status}`
        );
    }

    const result =
        await response.json() as GooglePlacesResponse;

    return (result.places ?? [])
        .filter(
            (place) =>
                place.displayName?.text &&
                place.location?.latitude !== undefined &&
                place.location?.longitude !== undefined
        )
        .map((place) => ({
            lat: String(
                place.location!.latitude
            ),

            lon: String(
                place.location!.longitude
            ),

            display_name:
                place.displayName!.text!,
        }));
}


export async function findNearbyLocations(
    latitude: number,
    longitude: number
): Promise<NearbyPlaces> {

    console.log(
        `Google nearby request @ ${latitude}, ${longitude}`
    );

    const [
        attractions,
        hotels,
        restaurants,
    ] = await Promise.all([
        searchGooglePlaces(
            latitude,
            longitude,
            "attraction"
        ),

        searchGooglePlaces(
            latitude,
            longitude,
            "hotel"
        ),

        searchGooglePlaces(
            latitude,
            longitude,
            "restaurant"
        ),
    ]);

    console.log(
        `Nearby results: attractions=${attractions.length}, hotels=${hotels.length}, restaurants=${restaurants.length}`
    );

    return {
        attraction: attractions,
        hotel: hotels,
        restaurant: restaurants,
    };
}