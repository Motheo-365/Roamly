import { Request, Response } from "express";
import {
    findNearbyLocations,
    searchLocations,
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
        const { lat, lon } = req.query;

        const latitude = Number(lat);
        const longitude = Number(lon);

        if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude)
        ) {
            return res.status(400).json({
                status: "error",
                message: "Valid lat and lon are required.",
            });
        }

        console.log(
            `Nearby request @ ${latitude}, ${longitude}`
        );

        const results = await findNearbyLocations(
            latitude,
            longitude
        );

        return res.json({
            status: "success",
            data: results,
        });

    } catch (error) {

        console.error(
            "Nearby location error:",
            error
        );

        return res.status(500).json({
            status: "error",
            message:
                error instanceof Error
                    ? error.message
                    : "Unable to find nearby places.",
        });
    }
}