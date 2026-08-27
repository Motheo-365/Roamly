import pool from "../db/connection.js";

/**
 * Represents a trip returned from the database.
 *
 * The Repository layer is responsible for database access.
 * It contains the SQL queries needed to retrieve and modify
 * trip data, but does not contain business rules or HTTP logic.
 */
export interface Trip {
    id: number;
    user_id: number;
    destination: string | null;
    start_date: string | null;
    end_date: string | null;
    travellers: number;
    description: string | null;
    budget: number;
}

/**
 * Repository Pattern
 *
 * TripRepository handles all database operations related to trips.
 *
 * This keeps PostgreSQL queries separate from the Service and
 * Controller layers. If the database implementation changes,
 * the rest of the application does not need to know about it.
 */
class TripRepository {

    /**
     * Retrieves all trips belonging to a specific user.
     *
     * Parameterised queries ($1) are used to safely insert values
     * into SQL queries and help prevent SQL injection.
     */
    async getTripsByUserId(userId: number): Promise<Trip[]> {
        const result = await pool.query(
            `
            SELECT
                id,
                user_id,
                destination,
                start_date,
                end_date,
                travellers,
                description,
                budget
            FROM trips
            WHERE user_id = $1
            ORDER BY start_date ASC
            `,
            [userId]
        );

        return result.rows;
    }

    /**
     * Retrieves a single trip using its ID.
     *
     * Returns null when no matching trip exists.
     */
    async getTripById(tripId: number, userId?: number): Promise<Trip | null> {
        const result = await pool.query(
            `
            SELECT
                id,
                user_id,
                destination,
                start_date,
                end_date,
                travellers,
                description,
                budget
            FROM trips
            WHERE id = $1
            ${userId === undefined ? "" : "AND user_id = $2"}
            `,
            userId === undefined ? [tripId] : [tripId, userId]
        );

        return result.rows[0] ?? null;
    }

    /**
     * Creates a new trip in the database.
     *
     * RETURNING is used so PostgreSQL can immediately return
     * the newly created trip, including its generated ID.
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
        const result = await pool.query(
            `
            INSERT INTO trips (
                user_id,
                destination,
                start_date,
                end_date,
                travellers,
                description,
                budget
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING
                id,
                user_id,
                destination,
                start_date,
                end_date,
                travellers,
                description,
                budget
            `,
            [userId, destination, startDate, endDate, travellers, description, budget]
        );

        return result.rows[0];
    }

    /**
     * Updates an existing trip belonging to a specific user.
     *
     * The user_id condition ensures that a user can only
     * modify their own trip.
     *
     * Returns the updated trip if successful,
     * otherwise returns null.
     */
    async updateTrip(
        tripId: number,
        userId: number,
        destination: string,
        startDate: string,
        endDate: string,
        travellers: number,
        description: string | null,
        budget: number
    ): Promise<Trip | null> {

        const result = await pool.query(
            `
            UPDATE trips
            SET
                destination = $1,
                start_date = $2,
                end_date = $3,
                travellers = $4
                description = $5
                budget = $6
            WHERE id = $7
            AND user_id = $8
            RETURNING
                id,
                user_id,
                destination,
                start_date,
                end_date,
                travellers
                description
                budget
            `,
            [
                destination,
                startDate,
                endDate,
                travellers,
                description,
                budget,
                tripId,
                userId
            ]
        );

        return result.rows[0] ?? null;
    }
    /**
     * Deletes a trip from the database.
     *
     * Returns true when a trip was deleted and false when
     * no trip with the specified ID existed.
     */
    async deleteTrip(tripId: number, userId: number): Promise<boolean> {
        const result = await pool.query(
            `
            DELETE FROM trips
            WHERE id = $1
            AND user_id = $2
            `,
            [tripId, userId]
        );

        return result.rowCount === 1;
    }
}

export default new TripRepository();