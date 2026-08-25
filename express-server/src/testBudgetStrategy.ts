import budgetCalculator from "./strategies/budgetCalculator.js";

import totalCostStrategy
    from "./strategies/totalCostStrategy.js";

import dailyCostStrategy
    from "./strategies/dailyCostStrategy.js";

import perPersonStrategy
    from "./strategies/perPersonStrategy.js";

const totalCost = 20000;
const days = 10;
const people = 4;

// Total Cost
budgetCalculator.setStrategy(totalCostStrategy);

console.log(
    "Total cost:",
    budgetCalculator.calculate(
        totalCost,
        days,
        people
    )
);

// Daily Cost
budgetCalculator.setStrategy(dailyCostStrategy);

console.log(
    "Daily cost:",
    budgetCalculator.calculate(
        totalCost,
        days,
        people
    )
);

// Per Person
budgetCalculator.setStrategy(perPersonStrategy);

console.log(
    "Per person:",
    budgetCalculator.calculate(
        totalCost,
        days,
        people
    )
);