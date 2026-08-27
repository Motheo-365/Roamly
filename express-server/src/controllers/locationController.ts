import { Request, Response } from "express";
import {
    findNearbyLocations,
    searchLocations,
    type NearbyLocationType,
} from "../services/locationService.js";

export async function searchLocationController(
    req: Request,
    res: Response
) {
    try {
        const query = req.query.q;

        if (typeof query !== "string" || !query.trim()) {
            return res.status(400).json({
                status: "error",
                message: "Search query is required.",
            });
        }

        const results = await searchLocations(query.trim());

        return res.json({
            status: "success",
            data: results,
        });

    } catch (error) {
        console.error("Location search error:", error);

        return res.status(500).json({
            status: "error",
            message: "Unable to search locations.",
        });
    }
}

export async function nearbyLocationsController(
    req: Request,
    res: Response
) {
    try {
        const { lat, lon, type } = req.query;

        const latitude = Number(lat);
        const longitude = Number(lon);

        const validTypes: NearbyLocationType[] = [
            "attraction",
            "hotel",
            "restaurant",
        ];

        if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude) ||
            !validTypes.includes(type as NearbyLocationType)
        ) {
            return res.status(400).json({
                status: "error",
                message: "lat, lon and a valid type are required.",
            });
        }

        console.log(
            `Nearby request: ${type} @ ${latitude}, ${longitude}`
        );

        const results = await findNearbyLocations(
            latitude,
            longitude,
            type as NearbyLocationType
        );

        console.log(
            `Nearby ${type}: ${results.length} results`
        );

        return res.json({
            status: "success",
            data: results,
        });

    } catch (error) {
        console.error("Nearby location error:", error);

        return res.status(500).json({
            status: "error",
            message:
                error instanceof Error
                    ? error.message
                    : "Unable to find nearby places.",
        });
    }
}