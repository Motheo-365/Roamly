import { Router } from "express";

import activityController from "../controllers/activityController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

/**
 * All activity routes require authentication.
 *
 * The authenticate middleware verifies the JWT and
 * attaches the authenticated user's ID to req.userId.
 */
router.use(authenticate);

/**
 * GET /api/activities/trip/:tripId
 *
 * Get all activities belonging to a trip.
 */
router.get(
    "/trip/:tripId",
    activityController.getActivitiesByTripId.bind(activityController)
);

/**
 * POST /api/activities
 *
 * Create a new activity.
 */
router.post(
    "/",
    activityController.createActivity.bind(activityController)
);

/**
 * GET /api/activities/:activityId
 *
 * Get a single activity.
 */
router.get(
    "/:activityId",
    activityController.getActivityById.bind(activityController)
);

/**
 * PUT /api/activities/:activityId
 *
 * Update an existing activity.
 */
router.put(
    "/:activityId",
    activityController.updateActivity.bind(activityController)
);

/**
 * DELETE /api/activities/:activityId
 *
 * Delete an activity.
 */
router.delete(
    "/:activityId",
    activityController.deleteActivity.bind(activityController)
);

export default router;