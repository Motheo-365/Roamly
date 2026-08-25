/**
 * Represents the data required to create an expense.
 */
export interface ExpenseData {
    tripId: number;
    category: string;
    description: string;
    amount: number;
    date: string;
}

/**
 * Expense object created by the factory.
 */
export interface Expense {
    tripId: number;
    category: string;
    description: string;
    amount: number;
    date: string;
}

/**
 * Factory Pattern
 *
 * ExpenseFactory centralises the creation of Expense objects.
 *
 * Instead of allowing different parts of the application
 * to construct expenses independently, the factory provides
 * one consistent way to create them.
 *
 * This becomes particularly useful when different expense
 * categories require different defaults or behaviour.
 */
class ExpenseFactory {

    /**
     * Creates an expense based on its category.
     */
    create(data: ExpenseData): Expense {

        switch (data.category.toLowerCase()) {

            case "accommodation":
                return this.createAccommodationExpense(data);

            case "transport":
                return this.createTransportExpense(data);

            case "food":
                return this.createFoodExpense(data);

            case "activities":
                return this.createActivityExpense(data);

            case "flights":
                return this.createFlightExpense(data);

            default:
                return this.createOtherExpense(data);
        }
    }

    /**
     * Creates an accommodation expense.
     */
    private createAccommodationExpense(
        data: ExpenseData
    ): Expense {
        return {
            ...data,
            category: "Accommodation"
        };
    }

    /**
     * Creates a transport expense.
     */
    private createTransportExpense(
        data: ExpenseData
    ): Expense {
        return {
            ...data,
            category: "Transport"
        };
    }

    /**
     * Creates a food expense.
     */
    private createFoodExpense(
        data: ExpenseData
    ): Expense {
        return {
            ...data,
            category: "Food"
        };
    }

    /**
     * Creates an activity expense.
     */
    private createActivityExpense(
        data: ExpenseData
    ): Expense {
        return {
            ...data,
            category: "Activities"
        };
    }

    /**
     * Creates a flight expense.
     */
    private createFlightExpense(
        data: ExpenseData
    ): Expense {
        return {
            ...data,
            category: "Flights"
        };
    }

    /**
     * Creates an expense that does not match
     * one of the predefined categories.
     */
    private createOtherExpense(
        data: ExpenseData
    ): Expense {
        return {
            ...data,
            category: "Other"
        };
    }
}

export default new ExpenseFactory();