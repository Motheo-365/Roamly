import activityRepository, { Activity } from "../repositories/activityRepository.js";

import tripRepository from "../repositories/tripRepository.js";

/**
 * Service Layer
 *
 * ActivityService contains the business rules for activities.
 *
 * The Service Layer sits between the Controller and Repository.
 *
 *                Controller
 *                    ↓
 *              ActivityService
 *                    ↓
*        TripRepository  ActivityRepository
 *                    ↓
 *                 PostgreSQL
 */
class ActivityService {

    /**
     * Checks whether the authenticated user owns
     * the trip associated with an activity.
     *
     * This prevents users from accessing or modifying
     * activities belonging to another user's trip.
     */
    private async verifyTripOwnership(
        tripId: number,
        userId: number
    ): Promise<void> {

        const trip = await tripRepository.getTripById(
            tripId,
            userId
        );

        if (!trip) {
            throw new Error(
                "You do not have access to this trip"
            );
        }
    }

    /**
     * Retrieves all activities belonging to a trip.
     *
     * The authenticated user must own the trip before
     * its activities can be retrieved.
     */
    async getActivitiesByTripId(
        tripId: number,
        userId: number
    ): Promise<Activity[]> {

        await this.verifyTripOwnership(
            tripId,
            userId
        );

        return activityRepository.getActivitiesByTripId(
            tripId
        );
    }

    /**
     * Retrieves a single activity.
     *
     * The activity's trip must belong to the
     * authenticated user.
     */
    async getActivityById(
        activityId: number,
        userId: number
    ): Promise<Activity | null> {

        const activity =
            await activityRepository.getActivityById(
                activityId
            );

        if (!activity) {
            return null;
        }

        await this.verifyTripOwnership(
            activity.trip_id,
            userId
        );

        return activity;
    }

    /**
     * Creates a new activity for a trip.
     *
     * The authenticated user must own the trip
     * before an activity can be added.
     */
    async createActivity(
        tripId: number,
        userId: number,
        title: string,
        date: string,
        time: string,
        location: string,
        cost: number
    ): Promise<Activity> {

        await this.verifyTripOwnership(
            tripId,
            userId
        );

        // Activity titles cannot be empty.
        if (!title.trim()) {
            throw new Error(
                "Activity title is required"
            );
        }

        // Activity locations cannot be empty.
        if (!location.trim()) {
            throw new Error(
                "Activity location is required"
            );
        }

        // Activity costs cannot be negative.
        if (cost < 0) {
            throw new Error(
                "Activity cost cannot be negative"
            );
        }

        return activityRepository.createActivity(
            tripId,
            title,
            date,
            time,
            location,
            cost
        );
    }

    /**
     * Updates an existing activity.
     *
     * The authenticated user must own the trip
     * that contains the activity.
     */
    async updateActivity(
        activityId: number,
        userId: number,
        title: string,
        date: string,
        time: string,
        location: string,
        cost: number
    ): Promise<Activity | null> {

        const activity =
            await activityRepository.getActivityById(
                activityId
            );

        if (!activity) {
            return null;
        }

        await this.verifyTripOwnership(
            activity.trip_id,
            userId
        );

        if (!title.trim()) {
            throw new Error(
                "Activity title is required"
            );
        }

        if (!location.trim()) {
            throw new Error(
                "Activity location is required"
            );
        }

        if (cost < 0) {
            throw new Error(
                "Activity cost cannot be negative"
            );
        }

        return activityRepository.updateActivity(
            activityId,
            title,
            date,
            time,
            location,
            cost
        );
    }

    /**
     * Deletes an activity.
     *
     * The authenticated user must own the trip
     * that contains the activity.
     */
    async deleteActivity(
        activityId: number,
        userId: number
    ): Promise<boolean> {

        const activity =
            await activityRepository.getActivityById(
                activityId
            );

        if (!activity) {
            return false;
        }

        await this.verifyTripOwnership(
            activity.trip_id,
            userId
        );

        return activityRepository.deleteActivity(
            activityId
        );
    }
}

export default new ActivityService();