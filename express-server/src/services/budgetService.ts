import budgetRepository, { type TripBudget } from "../repositories/budgetRepository.js";

import budgetCalculator from "../strategies/budgetCalculator.js";

import totalCostStrategy
    from "../strategies/totalCostStrategy.js";

import dailyCostStrategy
    from "../strategies/dailyCostStrategy.js";

import perPersonStrategy
    from "../strategies/perPersonStrategy.js";

export type BudgetCalculationType =
    | "total"
    | "daily"
    | "perPerson";

/**
 * Service Layer
 *
 * BudgetService coordinates:
 *
 * - Retrieving budget information
 * - Selecting a Strategy
 * - Performing the calculation
 * - Applying business rules
 *
 * The Service does not contain SQL.
 */
class BudgetService {

    /**
     * Calculates a selected budget metric for a trip.
     */
    async calculateBudget(
        tripId: number,
        userId: number,
        calculationType: BudgetCalculationType,
        people?: number
    ) {

        // Retrieve the trip's budget and expenses.
        const tripBudget =
            await budgetRepository.getTripBudget(tripId, userId);

        if (!tripBudget) {
            throw new Error("Trip not found");
        }

        /**
         * Calculate the number of days.
         *
         * For now we retrieve this separately from
         * the trips table.
         */
        const startDate =
            new Date(tripBudget.start_date);

        const endDate =
            new Date(tripBudget.end_date);

        const millisecondsPerDay =
            1000 * 60 * 60 * 24;

        const days =
            Math.ceil(
                (endDate.getTime() - startDate.getTime())
                / millisecondsPerDay
            ) + 1;

        /**
         * Select the appropriate Strategy.
         */
        switch (calculationType) {

            case "total":
                budgetCalculator.setStrategy(
                    totalCostStrategy
                );
                break;

            case "daily":
                budgetCalculator.setStrategy(
                    dailyCostStrategy
                );
                break;

            case "perPerson":
                budgetCalculator.setStrategy(
                    perPersonStrategy
                );
                break;

            default:
                throw new Error(
                    "Invalid budget calculation type"
                );
        }

        /**
         * Perform the calculation using the selected
         * Strategy.
         */
        const resultValue =
            budgetCalculator.calculate(
                tripBudget.total_expenses,
                days,
                people ?? 1
            );

        return {
            tripId: tripBudget.trip_id,
            tripBudget: tripBudget.budget,
            totalExpenses: tripBudget.total_expenses,
            calculationType,
            result: resultValue
        };
    }
}

export default new BudgetService();