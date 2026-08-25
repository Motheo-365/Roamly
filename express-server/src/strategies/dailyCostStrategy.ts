import { BudgetStrategy } from "./budgetStrategy.js";

/**
 * Calculates the average cost per day.
 *
 * Example:
 *
 * Total cost = R20 000
 * Trip length = 10 days
 *
 * Result = R2 000 per day
 */
class DailyCostStrategy implements BudgetStrategy {

    calculate(
        totalCost: number,
        days: number,
        people?: number
    ): number {

        if (days <= 0) {
            throw new Error(
                "Trip must contain at least one day"
            );
        }

        return totalCost / days;
    }
}

export default new DailyCostStrategy();