import tripEvents from "./tripEvents.js";
import activityLogRepository from "../repositories/activityLogRepository.js";

/**
 * Observer Pattern
 *
 * Listens for trip events and records them in the
 * activity log without TripService needing to know
 * about the activity log.
 */

/**
 * Observer for newly created trips.
 */
tripEvents.on("trip.created", async (trip) => {
    try {
        await activityLogRepository.createLog(
            trip.user_id,
            "TRIP_CREATED",
            `Created trip to ${trip.destination}`
        );

        console.log(
            `[Activity Log] Trip ${trip.id} creation recorded`
        );
    } catch (error) {
        console.error(
            "[Activity Log] Failed to record trip creation:",
            error
        );
    }
});

/**
 * Observer for updated trips.
 */
tripEvents.on("trip.updated", async (trip) => {
    try {
        await activityLogRepository.createLog(
            trip.user_id,
            "TRIP_UPDATED",
            `Updated trip to ${trip.destination}`
        );

        console.log(
            `[Activity Log] Trip ${trip.id} update recorded`
        );
    } catch (error) {
        console.error(
            "[Activity Log] Failed to record trip update:",
            error
        );
    }
});

/**
 * Observer for deleted trips.
 */
tripEvents.on("trip.deleted", async (trip) => {
    try {
        await activityLogRepository.createLog(
            trip.user_id,
            "TRIP_DELETED",
            `Deleted trip to ${trip.destination}`
        );

        console.log(
            `[Activity Log] Trip ${trip.id} deletion recorded`
        );
    } catch (error) {
        console.error(
            "[Activity Log] Failed to record trip deletion:",
            error
        );
    }
});