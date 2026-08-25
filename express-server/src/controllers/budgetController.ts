import { Request, Response } from "express";
import budgetService, {
    BudgetCalculationType
} from "../services/budgetService.js";

/**
 * Controller Layer
 *
 * Handles HTTP requests for budget calculations.
 *
 * The controller handles HTTP input/output while
 * the Service Layer handles the actual business logic.
 */
class BudgetController {

    /**
     * GET /api/budget/:tripId/:type
     *
     * Example:
     *
     * /api/budget/1/total
     * /api/budget/1/daily
     * /api/budget/1/perPerson
     */
    async calculateBudget(
        req: Request,
        res: Response
    ) {
        try {
            const tripId =
                Number(req.params.tripId);

            const userId = req.userId;

            if (userId === undefined) {
                return res.status(401).json({
                    status: "error",
                    message: "Authentication required"
                });
            }

            const type =
                req.params.type as BudgetCalculationType;

            const people =
                req.query.people
                    ? Number(req.query.people)
                    : undefined;

            if (Number.isNaN(tripId)) {
                return res.status(400).json({
                    status: "error",
                    message: "Invalid trip ID"
                });
            }

            const result =
                await budgetService.calculateBudget(
                    tripId,
                    userId,
                    type,
                    people
                );

            return res.status(200).json({
                status: "success",
                data: result
            });

        } catch (error) {

            console.error(
                "Error calculating budget:",
                error
            );

            return res.status(400).json({
                status: "error",
                message: error instanceof Error
                    ? error.message
                    : "Failed to calculate budget"
            });
        }
    }
}

export default new BudgetController();