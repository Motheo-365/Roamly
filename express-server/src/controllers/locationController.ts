import { Request, Response } from "express";
import { searchLocations } from "../services/locationService.js";

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