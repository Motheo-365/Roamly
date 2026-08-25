import { BudgetStrategy } from "./budgetStrategy.js";

/**
 * Calculates the average cost per person.
 */
class PerPersonStrategy implements BudgetStrategy {

    calculate(
        totalCost: number,
        days: number,
        people?: number
    ): number {

        if (!people || people <= 0) {
            throw new Error(
                "Number of people must be greater than zero"
            );
        }

        return totalCost / people;
    }
}

export default new PerPersonStrategy();