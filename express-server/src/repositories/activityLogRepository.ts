import pool from "../db/connection.js";

export interface ActivityLog {
    id: number;
    user_id: number;
    action: string;
    description: string;
    created_at: string;
}

/**
 * Repository Pattern
 *
 * ActivityLogRepository is responsible for all database
 * operations related to the activity log.
 *
 * It does not contain business logic.
 */
class ActivityLogRepository {

    /**
     * Creates a new activity log entry.
     */
    async createLog(
        userId: number,
        action: string,
        description: string
    ): Promise<ActivityLog> {

        const result = await pool.query(
            `
            INSERT INTO activity_logs (
                user_id,
                action,
                description
            )
            VALUES ($1, $2, $3)
            RETURNING
                id,
                user_id,
                action,
                description,
                created_at
            `,
            [
                userId,
                action,
                description
            ]
        );

        return result.rows[0];
    }

    /**
     * Retrieves all activity logs belonging to a user.
     */
    async getLogsByUserId(
        userId: number
    ): Promise<ActivityLog[]> {

        const result = await pool.query(
            `
            SELECT
                id,
                user_id,
                action,
                description,
                created_at
            FROM activity_logs
            WHERE user_id = $1
            ORDER BY created_at DESC
            `,
            [userId]
        );

        return result.rows;
    }
}

export default new ActivityLogRepository();