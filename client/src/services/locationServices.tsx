import { apiRequest } from "./api";

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

interface LocationSearchResponse {
    data: LocationResult[];
}

export async function searchLocations(
    query: string,
    signal?: AbortSignal
): Promise<LocationResult[]> {
    const params = new URLSearchParams({
        q: query.trim(),
    });

    const result = await apiRequest<LocationSearchResponse>(
        `/api/locations/search?${params.toString()}`,
        { signal }
    );

    return result.data;
}

export type NearbyLocationType =
    | "attraction"
    | "hotel"
    | "restaurant";

export type NearbyPlaces = Record<
    NearbyLocationType,
    LocationResult[]
>;

interface NearbyLocationResponse {
    data: Record<
        NearbyLocationType,
        LocationResult[]
    >;
}

export async function searchNearbyLocations(
    latitude: number,
    longitude: number
): Promise<NearbyPlaces> {

    const types: NearbyLocationType[] = [
        "attraction",
        "hotel",
        "restaurant",
    ];

    const results = await Promise.allSettled(
        types.map(async (type) => {

            const params = new URLSearchParams({
                lat: String(latitude),
                lon: String(longitude),
                type,
            });

            const result =
                await apiRequest<NearbyLocationResponse>(
                    `/api/locations/nearby?${params.toString()}`
                );

            console.log(
                `Nearby API response for ${type}:`,
                result
            );

            return {
                type,
                places: result.data[type] ?? [],
            };
        })
    );

    const places: NearbyPlaces = {
        attraction: [],
        hotel: [],
        restaurant: [],
    };

    results.forEach((result) => {
        if (result.status === "fulfilled") {
            places[result.value.type] = result.value.places;
        }
    });

    return places;
}