import pool from "../db/connection.js";

/**
 * Represents the budget information for a trip.
 *
 * The repository retrieves the trip's budget and
 * calculates the total amount spent from its expenses.
 */
export interface TripBudget {
    trip_id: number;
    budget: number;
    total_expenses: number;
    start_date: string;
    end_date: string;
    travellers: number;
}

/**
 * Repository Layer
 *
 * BudgetRepository is responsible only for retrieving
 * budget-related data from PostgreSQL.
 *
 * It does not perform the different budget calculations.
 * Those calculations belong to the Strategy Pattern.
 */
class BudgetRepository {

    /**
     * Retrieves the budget and total expenses for a trip.
     */
    async getTripBudget(
        tripId: number,
        userId: number
    ): Promise<TripBudget | null> {

        const result = await pool.query(
            `
                SELECT
                    t.id AS trip_id,
                    t.budget,
                    t.travellers,
                    t.start_date,
                    t.end_date,
                    COALESCE(SUM(e.amount), 0) AS total_expenses
                FROM trips t
                LEFT JOIN expenses e
                    ON t.id = e.trip_id
                WHERE t.id = $1
                AND t.user_id = $2
                GROUP BY
                    t.id,
                    t.budget,
                    t.travellers,
                    t.start_date,
                    t.end_date
            `,
            [tripId, userId]
        );

        if (result.rows.length === 0) {
            return null;
        }

        return {
            trip_id: result.rows[0].trip_id,
            budget: Number(result.rows[0].budget),
            total_expenses: Number(result.rows[0].total_expenses),
            start_date: result.rows[0].start_date,
            end_date: result.rows[0].end_date,
            travellers: Number(result.rows[0].travellers)
        };
    }
}

export default new BudgetRepository();