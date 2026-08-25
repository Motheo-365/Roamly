import pool from "../db/connection.js";

/**
 * Represents an activity belonging to a trip.
 *
 * The Repository Layer is responsible for communicating
 * directly with PostgreSQL.
 */
export interface Activity {
    id: number;
    trip_id: number;
    title: string | null;
    date: string | null;
    time: string | null;
    location: string | null;
    cost: number | null;
}

/**J
 * Repository Pattern
 *
 * ActivityRepository contains all database operations
 * related to activities.
 *
 * It keeps SQL and database logic separate from the
 * Service and Controller layers.
 */
class ActivityRepository {

    /**
     * Retrieves all activities belonging to a trip.
     */
    async getActivitiesByTripId(tripId: number): Promise<Activity[]> {
        const result = await pool.query(
            `
            SELECT
                id,
                trip_id,
                title,
                date,
                time,
                location,
                cost
            FROM activities
            WHERE trip_id = $1
            ORDER BY date ASC, time ASC
            `,
            [tripId]
        );

        return result.rows;
    }

    /**
     * Retrieves a single activity by its ID.
     *
     * Returns null if the activity does not exist.
     */
    async getActivityById(activityId: number): Promise<Activity | null> {
        const result = await pool.query(
            `
            SELECT
                id,
                trip_id,
                title,
                date,
                time,
                location,
                cost
            FROM activities
            WHERE id = $1
            `,
            [activityId]
        );

        return result.rows[0] ?? null;
    }

    /**
     * Creates a new activity for a trip.
     */
    async createActivity(
        tripId: number,
        title: string,
        date: string,
        time: string,
        location: string,
        cost: number
    ): Promise<Activity> {
        const result = await pool.query(
            `
            INSERT INTO activities (
                trip_id,
                title,
                date,
                time,
                location,
                cost
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING
                id,
                trip_id,
                title,
                date,
                time,
                location,
                cost
            `,
            [tripId, title, date, time, location, cost]
        );

        return result.rows[0];
    }

    /**
     * Updates an existing activity.
     */
    async updateActivity(
        activityId: number,
        title: string,
        date: string,
        time: string,
        location: string,
        cost: number
    ): Promise<Activity | null> {
        const result = await pool.query(
            `
            UPDATE activities
            SET
                title = $1,
                date = $2,
                time = $3,
                location = $4,
                cost = $5
            WHERE id = $6
            RETURNING
                id,
                trip_id,
                title,
                date,
                time,
                location,
                cost
            `,
            [title, date, time, location, cost, activityId]
        );

        return result.rows[0] ?? null;
    }

    /**
     * Deletes an activity.
     *
     * Returns true if an activity was deleted.
     */
    async deleteActivity(activityId: number): Promise<boolean> {
        const result = await pool.query(
            `
            DELETE FROM activities
            WHERE id = $1
            `,
            [activityId]
        );

        return result.rowCount === 1;
    }
}

export default new ActivityRepository();