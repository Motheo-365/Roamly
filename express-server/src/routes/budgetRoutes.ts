import { Router } from "express";
import budgetController from "../controllers/budgetController.js";
import { authenticate } from "../middleware/authMiddleware.js"

const router = Router();

/**
 * Calculate a trip's budget.
 *
 * Examples:
 *
 * GET /api/budget/1/total
 * GET /api/budget/1/daily
 * GET /api/budget/1/perPerson?people=2
 */
router.get(
    "/:tripId/:type", authenticate,
    budgetController.calculateBudget
);

export default router;