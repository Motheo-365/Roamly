import { BudgetStrategy } from "./budgetStrategy.js";

/**
 * Context in the Strategy Pattern.
 *
 * BudgetCalculator does not contain the actual budget
 * calculation algorithms.
 *
 * Instead, it delegates the calculation to whichever
 * BudgetStrategy has been selected.
 */
class BudgetCalculator {

    private strategy!: BudgetStrategy;

    /**
     * Sets the strategy that will be used for calculations.
     */
    setStrategy(strategy: BudgetStrategy): void {
        this.strategy = strategy;
    }

    /**
     * Performs the calculation using the currently
     * selected strategy.
     */
    calculate(
        totalCost: number,
        days: number,
        people: number
    ): number {

        if (!this.strategy) {
            throw new Error(
                "A budget strategy must be selected"
            );
        }

        return this.strategy.calculate(
            totalCost,
            days,
            people
        );
    }
}

export default new BudgetCalculator();