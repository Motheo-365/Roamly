export interface LocationResult {
    lat: string;
    lon: string;
    display_name: string;

    id?: string;
    address?: string;
    rating?: number;
    userRatingCount?: number;
    photoUrl?: string | null;
    googleMapsUri?: string | null;
    photoAttributions?: {
        displayName?: string;
        uri?: string;
        photoUri?: string;
    }[];
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


interface GooglePhoto {
    name: string;

    widthPx?: number;
    heightPx?: number;

    authorAttributions?: {
        displayName?: string;
        uri?: string;
        photoUri?: string;
    }[];
}


interface GooglePlace {
    id?: string;

    displayName?: {
        text?: string;
    };

    formattedAddress?: string;

    location?: {
        latitude?: number;
        longitude?: number;
    };

    rating?: number;

    userRatingCount?: number;

    photos?: GooglePhoto[];

    googleMapsUri?: string;
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
                    "places.id," +
                    "places.displayName," +
                    "places.formattedAddress," +
                    "places.location," +
                    "places.rating," +
                    "places.userRatingCount," +
                    "places.photos," +
                    "places.googleMapsUri",
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
        .map((place) => {

            const photoName =
                place.photos?.[0]?.name;

            const photoUrl =
                photoName
                    ? `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=600&key=${apiKey}`
                    : null;

            return {
                id: place.id,

                lat: String(
                    place.location!.latitude
                ),

                lon: String(
                    place.location!.longitude
                ),

                display_name:
                    place.displayName!.text!,

                address:
                    place.formattedAddress,

                rating:
                    place.rating,

                userRatingCount:
                    place.userRatingCount,

                photoUrl,

                googleMapsUri:
                    place.googleMapsUri,

                photoAttributions:
                    place.photos?.[0]?.authorAttributions ?? [],
            };
        });
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