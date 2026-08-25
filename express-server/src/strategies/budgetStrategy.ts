/**
 * Strategy Pattern
 *
 * BudgetStrategy defines the common interface that
 * every budget calculation strategy must implement.
 *
 * This allows BudgetCalculator to work with different
 * calculation algorithms without knowing their details.
 */
export interface BudgetStrategy {

    /**
     * Calculates a budget value.
     *
     * @param totalCost - Total amount spent on the trip
     * @param days - Number of days in the trip
     * @param people - Number of people on the trip
     */
    calculate(
        totalCost: number,
        days: number,
        people?: number
    ): number;
}