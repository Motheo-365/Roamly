import pool from "../db/connection.js";

/**
 * Represents an expense belonging to a trip.
 *
 * The Repository Layer is responsible for communicating
 * directly with PostgreSQL.
 */
export interface Expense {
    id: number;
    trip_id: number;
    category: string | null;
    description: string | null;
    amount: number | null;
    date: string | null;
}

/**
 * Repository Pattern
 *
 * ExpenseRepository contains all database operations
 * related to expenses.
 *
 * This keeps SQL/database logic separate from the
 * Service and Controller layers.
 */
class ExpenseRepository {

    /**
     * Retrieves all expenses belonging to a trip.
     */
    async getExpensesByTripId(tripId: number): Promise<Expense[]> {
        const result = await pool.query(
            `
            SELECT
                id,
                trip_id,
                category,
                description,
                amount,
                date
            FROM expenses
            WHERE trip_id = $1
            ORDER BY date ASC
            `,
            [tripId]
        );

        return result.rows;
    }

    /**
     * Retrieves a single expense by its ID.
     */
    async getExpenseById(expenseId: number): Promise<Expense | null> {
        const result = await pool.query(
            `
            SELECT
                id,
                trip_id,
                category,
                description,
                amount,
                date
            FROM expenses
            WHERE id = $1
            `,
            [expenseId]
        );

        return result.rows[0] ?? null;
    }

    /**
     * Creates a new expense.
     */
    async createExpense(
        tripId: number,
        category: string,
        description: string,
        amount: number,
        date: string
    ): Promise<Expense> {
        const result = await pool.query(
            `
            INSERT INTO expenses (
                trip_id,
                category,
                description,
                amount,
                date
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING
                id,
                trip_id,
                category,
                description,
                amount,
                date
            `,
            [tripId, category, description, amount, date]
        );

        return result.rows[0];
    }

    /**
     * Updates an existing expense.
     */
    async updateExpense(
        expenseId: number,
        category: string,
        description: string,
        amount: number,
        date: string
    ): Promise<Expense | null> {
        const result = await pool.query(
            `
            UPDATE expenses
            SET
                category = $1,
                description = $2,
                amount = $3,
                date = $4
            WHERE id = $5
            RETURNING
                id,
                trip_id,
                category,
                description,
                amount,
                date
            `,
            [category, description, amount, date, expenseId]
        );

        return result.rows[0] ?? null;
    }

    /**
     * Deletes an expense.
     */
    async deleteExpense(expenseId: number): Promise<boolean> {
        const result = await pool.query(
            `
            DELETE FROM expenses
            WHERE id = $1
            `,
            [expenseId]
        );

        return result.rowCount === 1;
    }
}

export default new ExpenseRepository();