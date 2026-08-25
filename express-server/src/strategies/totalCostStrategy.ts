import { BudgetStrategy } from "./budgetStrategy.js";

/**
 * Calculates the total amount spent on a trip.
 *
 * This strategy simply returns the total expense amount.
 */
class TotalCostStrategy implements BudgetStrategy {

    calculate(
        totalCost: number,
        days: number,
        people?: number
    ): number {

        return totalCost;
    }
}

export default new TotalCostStrategy();