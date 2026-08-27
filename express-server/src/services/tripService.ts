import tripRepository, { type Trip } from "../repositories/tripRepository.js";
import tripEvents from "../events/tripEvents.js"

/**
 * Service Layer
 *
 * TripService contains the business logic for working with trips.
 *
 * The Service Layer sits between the Controller and Repository:
 *
 * Controller
 *     ↓
 * TripService
 *     ↓
 * TripRepository
 *     ↓
 * PostgreSQL
 *
 * Controllers handle HTTP requests and responses, while the
 * Repository handles database operations. The Service Layer
 * contains the rules that determine whether an operation is valid.
 */
class TripService {

    /**
     * Retrieves all trips belonging to a user.
     *
     * No business validation is currently required for this
     * operation, so the request can be passed to the repository.
     */
    async getTripsByUserId(userId: number): Promise<Trip[]> {
        return tripRepository.getTripsByUserId(userId);
    }

    /**
     * Retrieves a single trip belonging to a specific user.
     *
     * Business Rule:
     * A user can only access their own trips.
     *
     * The Service Layer is responsible for enforcing
     * this rule before returning the trip.
     */
    async getTripById(
        tripId: number,
        userId: number
    ): Promise<Trip | null> {

        // Retrieve the trip from the Repository.
        const trip =
            await tripRepository.getTripById(tripId, userId);

        // The trip does not exist.
        if (!trip) {
            return null;
        }

        /**
         * Business rule:
         *
         * The authenticated user must own the trip.
         */
        if (trip.user_id !== userId) {
            throw new Error(
                "You do not have access to this trip"
            );
        }

        return trip;
    }

    /**
     * Creates a new trip.
     *
     * Business rules are validated here before the repository
     * is allowed to modify the database.
     */
    async createTrip(
        userId: number,
        destination: string,
        startDate: string,
        endDate: string,
        travellers: number,
        description: string,
        budget: number
    ): Promise<Trip> {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            throw new Error("Invalid trip dates");
        }

        if (start > end) {
            throw new Error("Start date cannot be after end date.")
        }

        // A trip must have a destination.
        if (!destination.trim()) {
            throw new Error("Destination is required");
        }

        // A budget cannot be negative.
        if (budget < 0) {
            throw new Error("Budget cannot be negative");
        }

        if (!Number.isInteger(travellers) || travellers < 1) {
            throw new Error("There must be at least one traveller");
        }

        const cleanDescription = description?.trim() || "";

        const trip = await tripRepository.createTrip(
            userId,
            destination,
            startDate,
            endDate,
            travellers,
            cleanDescription,
            budget
        );

        // Notify observers that a trip has been created and added.
        tripEvents.emit("trip.created", trip);

        // Only valid trips are passed to the Repository.
        return trip;
    }

    /**
     * Updates an existing trip.
     *
     * The same business rules used when creating a trip are
     * applied before the database is modified.
     */
    async updateTrip(
        tripId: number,
        userId: number,
        destination: string,
        startDate: string,
        endDate: string,
        travellers: number,
        description: string,
        budget: number
    ): Promise<Trip | null> {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            throw new Error("Invalid trip dates");
        }

        if (start > end) {
            throw new Error("Start date cannot be after end date.")
        }

        if (!destination.trim()) {
            throw new Error("Destination is required");
        }

        if (budget < 0) {
            throw new Error("Budget cannot be negative");
        }

        const trip = await tripRepository.getTripById(tripId);

        if (!trip) {
            return null;
        }

        if (trip.user_id !== userId) {
            throw new Error("You do not have access to this trip");
        }

        const updatedTrip = await tripRepository.updateTrip(
            tripId,
            userId,
            destination,
            startDate,
            endDate,
            Number(travellers),
            description,
            Number(budget)
        );

        return updatedTrip;
    }

    /**
     * Deletes a trip.
     *
     * The Repository handles the actual DELETE query.
     */
    async deleteTrip(tripId: number, userId: number): Promise<boolean> {
       const trip = await tripRepository.getTripById(tripId, userId);
       if (!trip) return false;

       const deleted = await tripRepository.deleteTrip(tripId, userId);
        if (deleted) tripEvents.emit("trip.deleted", trip);

        return deleted;
    }
}

export default new TripService();