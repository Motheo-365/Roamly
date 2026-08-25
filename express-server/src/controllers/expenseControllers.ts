import { Request, Response } from "express";
import expenseService from "../services/expenseService.js";

/**
 * Controller Layer
 *
 * Handles HTTP requests related to expenses.
 *
 * The controller is responsible for HTTP concerns,
 * while business logic remains in the Service Layer.
 */
class ExpenseController {

    /**
     * GET /api/expenses/trip/:tripId
     */
    async getExpensesByTripId(
        req: Request,
        res: Response
    ) {
        try {
            const userId = req.userId;

            if (userId === undefined || userId === null) {
                return res.status(401).json({
                    status: "error",
                    message: "Authentication required"
                });
            }

            const tripId = Number(req.params.tripId);

            if (Number.isNaN(tripId)) {
                return res.status(400).json({
                    status: "error",
                    message: "Invalid trip ID"
                });
            }

            const expenses =
                await expenseService.getExpensesByTripId(
                    tripId,
                    userId
                );

            return res.status(200).json({
                status: "success",
                data: expenses
            });

        } catch (error) {
            console.error(
                "Error fetching expenses:",
                error
            );

            return res.status(500).json({
                status: "error",
                message: "Failed to fetch expenses"
            });
        }
    }

    /**
     * GET /api/expenses/:expenseId
     */
    async getExpenseById(
        req: Request,
        res: Response
    ) {
        try {
            const userId = req.userId;

            if (userId === undefined || userId === null) {
                return res.status(401).json({
                    status: "error",
                    message: "Authentication required"
                });
            }

            const expenseId =
                Number(req.params.expenseId);

            if (Number.isNaN(expenseId)) {
                return res.status(400).json({
                    status: "error",
                    message: "Invalid expense ID"
                });
            }

            const expense =
                await expenseService.getExpenseById(
                    expenseId,
                    userId
                );

            if (!expense) {
                return res.status(404).json({
                    status: "error",
                    message: "Expense not found"
                });
            }

            return res.status(200).json({
                status: "success",
                data: expense
            });

        } catch (error) {
            console.error(
                "Error fetching expense:",
                error
            );

            return res.status(500).json({
                status: "error",
                message: "Failed to fetch expense"
            });
        }
    }

    /**
     * POST /api/expenses
     */
    async createExpense(
        req: Request,
        res: Response
    ) {
        try {
            const userId = req.userId;

            if (userId === undefined || userId === null) {
                return res.status(401).json({
                    status: "error",
                    message: "Authentication required"
                });
            }

            const {
                tripId,
                category,
                description,
                amount,
                date
            } = req.body;

            const expense =
                await expenseService.createExpense(
                    Number(tripId),
                    userId,
                    category,
                    description,
                    Number(amount),
                    date
                );

            return res.status(201).json({
                status: "success",
                data: expense
            });

        } catch (error) {
            console.error(
                "Error creating expense:",
                error
            );

            return res.status(400).json({
                status: "error",
                message: error instanceof Error
                    ? error.message
                    : "Failed to create expense"
            });
        }
    }

    /**
     * PUT /api/expenses/:expenseId
     */
    async updateExpense(
        req: Request,
        res: Response
    ) {
        try {
            const userId = req.userId;

            if (userId === undefined || userId === null) {
                return res.status(401).json({
                    status: "error",
                    message: "Authentication required"
                });
            }

            const expenseId =
                Number(req.params.expenseId);

            if (Number.isNaN(expenseId)) {
                return res.status(400).json({
                    status: "error",
                    message: "Invalid expense ID"
                });
            }

            const {
                category,
                description,
                amount,
                date
            } = req.body;

            const expense =
                await expenseService.updateExpense(
                    expenseId,
                    userId,
                    category,
                    description,
                    Number(amount),
                    date
                );

            if (!expense) {
                return res.status(404).json({
                    status: "error",
                    message: "Expense not found"
                });
            }

            return res.status(200).json({
                status: "success",
                data: expense
            });

        } catch (error) {
            console.error(
                "Error updating expense:",
                error
            );

            return res.status(400).json({
                status: "error",
                message: error instanceof Error
                    ? error.message
                    : "Failed to update expense"
            });
        }
    }

    /**
     * DELETE /api/expenses/:expenseId
     */
    async deleteExpense(
        req: Request,
        res: Response
    ) {
        try {
            const userId = req.userId;

            if (userId === undefined || userId === null) {
                return res.status(401).json({
                    status: "error",
                    message: "Authentication required"
                });
            }

            const expenseId =
                Number(req.params.expenseId);

            if (Number.isNaN(expenseId)) {
                return res.status(400).json({
                    status: "error",
                    message: "Invalid expense ID"
                });
            }

            const deleted =
                await expenseService.deleteExpense(
                    expenseId,
                    userId
                );

            if (!deleted) {
                return res.status(404).json({
                    status: "error",
                    message: "Expense not found"
                });
            }

            return res.status(200).json({
                status: "success",
                message: "Expense deleted successfully"
            });

        } catch (error) {
            console.error(
                "Error deleting expense:",
                error
            );

            return res.status(500).json({
                status: "error",
                message: "Failed to delete expense"
            });
        }
    }
}

export default new ExpenseController();