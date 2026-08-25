import { Request, Response } from "express";
import activityLogService from "../services/activityLogService.js";

/**
 * Controller Layer
 *
 * Handles HTTP requests related to activity logs.
 */
class ActivityLogController {

    /**
     * GET /api/activity-logs
     *
     * Retrieves the authenticated user's activity history.
     */
    async getActivityLogs(
        req: Request,
        res: Response
    ) {
        try {
            const userId = req.userId;

            if (!userId) {
                return res.status(401).json({
                    status: "error",
                    message: "Authentication required"
                });
            }

            const logs =
                await activityLogService.getLogsByUserId(
                    userId
                );

            return res.status(200).json({
                status: "success",
                data: logs
            });

        } catch (error) {
            console.error(
                "Error fetching activity logs:",
                error
            );

            return res.status(500).json({
                status: "error",
                message: "Failed to fetch activity logs"
            });
        }
    }
}

export default new ActivityLogController();