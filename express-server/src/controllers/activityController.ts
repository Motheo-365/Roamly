import { Request, Response } from "express";
import activityService from "../services/activityService.js";

/**
 * Controller Layer
 *
 * ActivityController handles HTTP requests related to activities.
 *
 * Its responsibility is to:
 * - Read and validate request parameters
 * - Get the authenticated user's ID
 * - Call the Service Layer
 * - Return an appropriate HTTP response
 * - Handle errors
 *
 * The Controller does not contain database queries or business rules.
 *
 * Request
 *    ↓
 * ActivityController
 *    ↓
 * ActivityService
 *    ↓
 * ActivityRepository
 *    ↓
 * PostgreSQL
 */

class ActivityController {

    /**
     * GET /api/activities/trip/:tripId
     *
     * Retrieves all activities belonging to a trip.
     *
     * The authenticated user's ID comes from the JWT.
     */
    async getActivitiesByTripId(req: Request, res: Response) {
        try {
            const tripId = Number(req.params.tripId);
            const userId = req.userId;

            // Make sure the user is authenticated.
            if (userId === undefined) {
                return res.status(401).json({
                    status: "error",
                    message: "Authentication required"
                });
            }

            // Validate the trip ID.
            if (Number.isNaN(tripId)) {
                return res.status(400).json({
                    status: "error",
                    message: "Invalid trip ID"
                });
            }

            const activities =
                await activityService.getActivitiesByTripId(
                    tripId,
                    userId
                );

            return res.status(200).json({
                status: "success",
                data: activities
            });

        } catch (error) {

            if (
                error instanceof Error &&
                error.message === "You do not have access to this trip"
            ) {
                return res.status(403).json({
                    status: "error",
                    message: error.message
                });
            }

            console.error(
                "Error fetching activities:",
                error
            );

            return res.status(500).json({
                status: "error",
                message: "Failed to fetch activities"
            });
        }
    }

    /**
     * GET /api/activities/:activityId
     *
     * Retrieves a single activity belonging to the
     * authenticated user's trip.
     */
    async getActivityById(req: Request, res: Response) {
        try {
            const activityId = Number(req.params.activityId);
            const userId = req.userId;

            if (userId === undefined) {
                return res.status(401).json({
                    status: "error",
                    message: "Authentication required"
                });
            }

            if (Number.isNaN(activityId)) {
                return res.status(400).json({
                    status: "error",
                    message: "Invalid activity ID"
                });
            }

            const activity =
                await activityService.getActivityById(
                    activityId,
                    userId
                );

            if (!activity) {
                return res.status(404).json({
                    status: "error",
                    message: "Activity not found"
                });
            }

            return res.status(200).json({
                status: "success",
                data: activity
            });

        } catch (error) {

            if (
                error instanceof Error &&
                error.message === "You do not have access to this activity"
            ) {
                return res.status(403).json({
                    status: "error",
                    message: error.message
                });
            }

            console.error(
                "Error fetching activity:",
                error
            );

            return res.status(500).json({
                status: "error",
                message: "Failed to fetch activity"
            });
        }
    }

    /**
     * POST /api/activities
     *
     * Creates a new activity.
     *
     * The authenticated user ID is obtained from the JWT.
     */
    async createActivity(req: Request, res: Response) {
        try {
            const userId = req.userId;

            if (userId === undefined) {
                return res.status(401).json({
                    status: "error",
                    message: "Authentication required"
                });
            }

            const {
                tripId,
                title,
                date,
                time,
                location,
                cost
            } = req.body;

            const activity =
                await activityService.createActivity(
                    tripId,
                    userId,
                    title,
                    date,
                    time,
                    location,
                    Number(cost)
                );

            return res.status(201).json({
                status: "success",
                data: activity
            });

        } catch (error) {

            if (
                error instanceof Error &&
                error.message === "You do not have access to this trip"
            ) {
                return res.status(403).json({
                    status: "error",
                    message: error.message
                });
            }

            console.error(
                "Error creating activity:",
                error
            );

            return res.status(400).json({
                status: "error",
                message: error instanceof Error
                    ? error.message
                    : "Failed to create activity"
            });
        }
    }

    /**
     * PUT /api/activities/:activityId
     *
     * Updates an existing activity.
     */
    async updateActivity(req: Request, res: Response) {
        try {
            const activityId = Number(req.params.activityId);
            const userId = req.userId;

            if (userId === undefined) {
                return res.status(401).json({
                    status: "error",
                    message: "Authentication required"
                });
            }

            if (Number.isNaN(activityId)) {
                return res.status(400).json({
                    status: "error",
                    message: "Invalid activity ID"
                });
            }

            const {
                title,
                date,
                time,
                location,
                cost
            } = req.body;

            const activity =
                await activityService.updateActivity(
                    activityId,
                    userId,
                    title,
                    date,
                    time,
                    location,
                    Number(cost)
                );

            if (!activity) {
                return res.status(404).json({
                    status: "error",
                    message: "Activity not found"
                });
            }

            return res.status(200).json({
                status: "success",
                data: activity
            });

        } catch (error) {

            if (
                error instanceof Error &&
                error.message === "You do not have access to this activity"
            ) {
                return res.status(403).json({
                    status: "error",
                    message: error.message
                });
            }

            console.error(
                "Error updating activity:",
                error
            );

            return res.status(400).json({
                status: "error",
                message: error instanceof Error
                    ? error.message
                    : "Failed to update activity"
            });
        }
    }

    /**
     * DELETE /api/activities/:activityId
     *
     * Deletes an activity belonging to the authenticated user.
     */
    async deleteActivity(req: Request, res: Response) {
        try {
            const activityId = Number(req.params.activityId);
            const userId = req.userId;

            if (userId === undefined) {
                return res.status(401).json({
                    status: "error",
                    message: "Authentication required"
                });
            }

            if (Number.isNaN(activityId)) {
                return res.status(400).json({
                    status: "error",
                    message: "Invalid activity ID"
                });
            }

            const deleted =
                await activityService.deleteActivity(
                    activityId,
                    userId
                );

            if (!deleted) {
                return res.status(404).json({
                    status: "error",
                    message: "Activity not found"
                });
            }

            return res.status(200).json({
                status: "success",
                message: "Activity deleted successfully"
            });

        } catch (error) {

            if (
                error instanceof Error &&
                error.message === "You do not have access to this activity"
            ) {
                return res.status(403).json({
                    status: "error",
                    message: error.message
                });
            }

            console.error(
                "Error deleting activity:",
                error
            );

            return res.status(500).json({
                status: "error",
                message: "Failed to delete activity"
            });
        }
    }
}

export default new ActivityController();