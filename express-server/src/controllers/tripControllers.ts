import { Request, Response } from "express";
import tripService from "../services/tripService.js";

/**
 * Controller Layer
 *
 * TripController handles HTTP requests related to trips.
 *
 * Its responsibility is to:
 * - Read and validate request parameters
 * - Call the appropriate Service Layer method
 * - Return an appropriate HTTP response
 * - Handle errors that occur during the request
 *
 * The Controller does not contain database queries or business rules.
 *
 * Request
 *    ↓
 * TripController
 *    ↓
 * TripService
 *    ↓
 * TripRepository
 *    ↓
 * PostgreSQL
 */
class TripController {
    /**
     * GET /api/trips
     *
     * Retrieves all trips belonging to the authenticated user.
     *
     * The user ID comes from the JWT authentication middleware
     * rather than from a URL parameter.
     */
    async getTripsByUserId(req: Request, res: Response) {
        try {

            /**
             * The authentication middleware adds the authenticated
             * user's ID to the request.
             */
            const userId = req.userId;

            /**
             * A user ID should always exist because this route
             * is protected by the authentication middleware.
             */
            if (userId === undefined || userId === null) {
                return res.status(401).json({
                    status: "error",
                    message: "Authentication required"
                });
            }

            /**
             * The Service Layer handles the application logic
             * and communicates with the Repository.
             */
            const trips =
                await tripService.getTripsByUserId(userId);

            /**
             * Return the authenticated user's trips.
             */
            return res.status(200).json({
                status: "success",
                data: trips
            });

        } catch (error) {

            /**
             * Log the actual error for server-side debugging.
             */
            console.error(
                "Error fetching trips:",
                error
            );

            /**
             * Don't expose internal error details to the client.
             */
            return res.status(500).json({
                status: "error",
                message: "Failed to fetch trips"
            });
        }
    }


    /**
     * GET /api/trips/:tripId
     *
     * Retrieves a single trip belonging to the
     * authenticated user.
     */
    async getTripById(req: Request, res: Response) {

        try {

            /**
             * Convert the URL parameter from a string
             * to a number.
             */
            const tripId = Number(req.params.tripId);

            /**
             * Validate the trip ID.
             */
            if (Number.isNaN(tripId)) {

                return res.status(400).json({
                    status: "error",
                    message: "Invalid trip ID"
                });
            }

            /**
             * The authentication middleware adds the
             * authenticated user's ID to the request.
             */
            const userId = req.userId;

            if (userId === undefined || userId === null) {

                return res.status(401).json({
                    status: "error",
                    message: "Authentication required"
                });
            }

            /**
             * The Service Layer handles both:
             *
             * 1. Finding the trip
             * 2. Checking whether the user owns it
             */
            const trip =
                await tripService.getTripById(
                    tripId,
                    userId
                );

            /**
             * If no trip exists, return 404.
             */
            if (!trip) {

                return res.status(404).json({
                    status: "error",
                    message: "Trip not found"
                });
            }

            /**
             * Return the trip.
             */
            return res.status(200).json({
                status: "success",
                data: trip
            });

        } catch (error) {

            /**
             * Ownership errors are handled separately
             * from unexpected server errors.
             */
            if (
                error instanceof Error &&
                error.message ===
                    "You do not have access to this trip"
            ) {

                return res.status(403).json({
                    status: "error",
                    message: error.message
                });
            }

            /**
             * Log unexpected errors server-side.
             */
            console.error(
                "Error fetching trip:",
                error
            );

            return res.status(500).json({
                status: "error",
                message: "Failed to fetch trip"
            });
        }
    }

    /**
     * POST /api/trips
     *
     * Creates a new trip for the authenticated user.
     *
     * The user ID is taken from the JWT rather than
     * accepting a user ID from the request body.
     */
    async createTrip(req: Request, res: Response) {
        try {
            const userId = req.userId;

            if (userId === undefined || userId === null) {
                return res.status(401).json({
                    status: "error",
                    message: "Authentication required"
                });
            }

            const {
                destination,
                startDate,
                endDate,
                budget
            } = req.body;

            const trip = await tripService.createTrip(
                userId,
                destination,
                startDate,
                endDate,
                Number(budget)
            );

            return res.status(201).json({
                status: "success",
                data: trip
            });

        } catch (error) {
            console.error("Error creating trip:", error);

            return res.status(400).json({
                status: "error",
                message: error instanceof Error
                    ? error.message
                    : "Failed to create trip"
            });
        }
    }

    /**
     * PUT /api/trips/:tripId
     *
     * Updates an existing trip.
     */
    async updateTrip(req: Request, res: Response) {
        try {
            const tripId = Number(req.params.tripId);
            const userId = req.userId;

            if (userId === undefined || userId === null) {
                return res.status(401).json({
                    status: "error",
                    message: "Authentication required"
                });
            }

            if (Number.isNaN(tripId)) {
                return res.status(400).json({
                    status: "error",
                    message: "Invalid trip ID"
                });
            }

            const {
                destination,
                startDate,
                endDate,
                budget
            } = req.body;

            const trip = await tripService.updateTrip(
                tripId,
                userId,
                destination,
                startDate,
                endDate,
                Number(budget)
            );

            if (!trip) {
                return res.status(404).json({
                    status: "error",
                    message: "Trip not found"
                });
            }

            return res.status(200).json({
                status: "success",
                data: trip
            });

        } catch (error) {
            console.error("Error updating trip:", error);

            return res.status(400).json({
                status: "error",
                message: error instanceof Error
                    ? error.message
                    : "Failed to update trip"
            });
        }
    }

    /**
     * DELETE /api/trips/:tripId
     *
     * Deletes an existing trip.
     */
    async deleteTrip(req: Request, res: Response) {
        try {
            const tripId = Number(req.params.tripId);
            const userId = req.userId;

            if (userId === undefined || userId === null) {
                return res.status(401).json({
                    status: "error",
                    message: "Authentication required"
                });
            }

            if (Number.isNaN(tripId)) {
                return res.status(400).json({
                    status: "error",
                    message: "Invalid trip ID"
                });
            }

            const deleted = await tripService.deleteTrip(tripId, userId);

            if (!deleted) {
                return res.status(404).json({
                    status: "error",
                    message: "Trip not found"
                });
            }

            return res.status(200).json({
                status: "success",
                message: "Trip deleted successfully"
            });

        } catch (error) {
            console.error("Error deleting trip:", error);

            return res.status(500).json({
                status: "error",
                message: "Failed to delete trip"
            });
        }
    }
}

export default new TripController();