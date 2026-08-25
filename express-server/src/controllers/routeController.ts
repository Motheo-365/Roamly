import { Request, Response } from "express";

import { getRoute } from "../services/routeService.js";

export async function getRouteController(
    req: Request,
    res: Response
) {
    try {
        const {
            fromLat,
            fromLon,
            toLat,
            toLon,
        } = req.query;

        const values = [
            fromLat,
            fromLon,
            toLat,
            toLon,
        ];

        if (
            values.some(
                (value) =>
                    typeof value !== "string" ||
                    !value.trim()
            )
        ) {
            return res.status(400).json({
                status: "error",
                message:
                    "fromLat, fromLon, toLat and toLon are required.",
            });
        }

        const route = await getRoute(
            Number(fromLat),
            Number(fromLon),
            Number(toLat),
            Number(toLon)
        );

        return res.json({
            status: "success",
            data: route,
        });

    } catch (error) {
        console.error("Route error:", error);

        return res.status(500).json({
            status: "error",
            message: "Unable to calculate route.",
        });
    }
}