import expenseRepository, { Expense } from "../repositories/expenseRepository.js";
import expenseFactory from "../factories/expenseFactory.js";
import tripRepository from "../repositories/tripRepository.js";

/**
 * Service Layer
 *
 * ExpenseService contains the business rules for expenses.
 *
 * The Service Layer also verifies that the authenticated
 * user owns the trip before allowing access to its expenses.
 */
class ExpenseService {

    /**
     * Verifies that a user owns a specific trip.
     *
     * This prevents users from accessing or modifying
     * expenses belonging to another user's trip.
     */
    private async verifyTripOwnership(
        tripId: number,
        userId: number
    ): Promise<void> {

        const trip =
            await tripRepository.getTripById(tripId, userId);

        if (!trip) {
            throw new Error("Trip not found");
        }

        if (trip.user_id !== userId) {
            throw new Error(
                "You do not have access to this trip"
            );
        }
    }


    /**
     * Retrieves all expenses belonging to a trip.
     */
    async getExpensesByTripId(
        tripId: number,
        userId: number
    ): Promise<Expense[]> {

        await this.verifyTripOwnership(
            tripId,
            userId
        );

        return expenseRepository.getExpensesByTripId(
            tripId
        );
    }


    /**
     * Retrieves a single expense.
     */
    async getExpenseById(
        expenseId: number,
        userId: number
    ): Promise<Expense | null> {

        const expense =
            await expenseRepository.getExpenseById(
                expenseId
            );

        if (!expense) {
            return null;
        }

        await this.verifyTripOwnership(
            expense.trip_id,
            userId
        );

        return expense;
    }


    /**
     * Creates a new expense.
     *
     * The authenticated user must own the trip first.
     */
    async createExpense(
        tripId: number,
        userId: number,
        category: string,
        description: string,
        amount: number,
        date: string
    ): Promise<Expense> {

        await this.verifyTripOwnership(
            tripId,
            userId
        );

        if (!category.trim()) {
            throw new Error(
                "Expense category is required"
            );
        }

        if (amount < 0) {
            throw new Error(
                "Expense amount cannot be negative"
            );
        }

        const expense = expenseFactory.create({
            tripId,
            category,
            description,
            amount,
            date
        });

        return expenseRepository.createExpense(
            expense.tripId,
            expense.category,
            expense.description,
            expense.amount,
            expense.date
        );
    }


    /**
     * Updates an existing expense.
     */
    async updateExpense(
        expenseId: number,
        userId: number,
        category: string,
        description: string,
        amount: number,
        date: string
    ): Promise<Expense | null> {

        const expense =
            await expenseRepository.getExpenseById(
                expenseId
            );

        if (!expense) {
            return null;
        }

        await this.verifyTripOwnership(
            expense.trip_id,
            userId
        );

        if (!category.trim()) {
            throw new Error(
                "Expense category is required"
            );
        }

        if (amount < 0) {
            throw new Error(
                "Expense amount cannot be negative"
            );
        }

        return expenseRepository.updateExpense(
            expenseId,
            category,
            description,
            amount,
            date
        );
    }


    /**
     * Deletes an expense.
     */
    async deleteExpense(
        expenseId: number,
        userId: number
    ): Promise<boolean> {

        const expense =
            await expenseRepository.getExpenseById(
                expenseId
            );

        if (!expense) {
            return false;
        }

        await this.verifyTripOwnership(
            expense.trip_id,
            userId
        );

        return expenseRepository.deleteExpense(
            expenseId
        );
    }
}

export default new ExpenseService();