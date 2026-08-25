import { Router } from "express";
import expenseController from "../controllers/expenseControllers.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authenticate);

// Get all expenses for a trip
router.get(
    "/trip/:tripId",
    expenseController.getExpensesByTripId
);

// Create an expense
router.post(
    "/", authenticate,
    expenseController.createExpense
);

// Get one expense
router.get(
    "/:expenseId",
    expenseController.getExpenseById
);

// Update an expense
router.put(
    "/:expenseId",
    expenseController.updateExpense
);

// Delete an expense
router.delete(
    "/:expenseId",
    expenseController.deleteExpense
);

export default router;