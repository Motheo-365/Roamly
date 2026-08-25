import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import tripController from "../controllers/tripControllers.js";

const router = Router();

/**
 * Get all trips belonging to the authenticated user.
 *
 * The user ID comes from the JWT rather than
 * from the URL.
 */
router.get( "/", authenticate,
    tripController.getTripsByUserId.bind(tripController)
);

/**
 * Get a single trip belonging to the authenticated user.
 */
router.get( "/:tripId", authenticate,
    tripController.getTripById.bind(tripController)
);

/**
 * Create a new trip.
 *
 * This should also be authenticated.
 */
router.post( "/", authenticate,
    tripController.createTrip.bind(tripController)
);

/**
 * Update a trip.
 *
 * This should also be authenticated.
 */
router.put( "/:tripId", authenticate,
    tripController.updateTrip.bind(tripController)
);

/**
 * Delete a trip.
 *
 * This should also be authenticated.
 */
router.delete( "/:tripId", authenticate,
    tripController.deleteTrip.bind(tripController)
);

export default router;