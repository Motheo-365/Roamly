import "../styles/budget.css"

import type {
  Expense,
  Trip,
} from "../services/apiService";

interface BudgetBreakdownProps {
  trip: Trip;
  expenses: Expense[];
  budget: number;
  onBack: () => void;
}

interface Category {
  name: string;
  amount: number;
  budget: number;
  icon: string;
}

const categoryIcons: Record<string, string> = {
  Food: "🍜",
  Activities: "🎟️",
  Transport: "🚆",
  Accommodation: "🏨",
  Flights: "✈️",
  Shopping: "🛍️",
  Other: "•••",
};

function BudgetBreakdown({
  trip,
  expenses,
  budget,
  onBack,
}: BudgetBreakdownProps) {
  /*
   * Calculate actual spending for each category
   * using the expenses fetched from the backend.
   */
  const categoryAmounts: Record<string, number> = {};

  expenses.forEach((expense) => {
    const category = expense.category || "Other";

    categoryAmounts[category] =
      (categoryAmounts[category] || 0) +
      Number(expense.amount || 0);
  });

  /*
   * Build the category list from the actual
   * categories present in the backend expenses.
   *
   * The standard categories are included even when
   * they currently have no spending.
   */
  const categoryNames = [
    "Accommodation",
    "Transport",
    "Food",
    "Activities",
    "Flights",
    "Shopping",
    "Other",
  ];

  const categories: Category[] = categoryNames.map(
    (name) => ({
      name,
      amount: categoryAmounts[name] || 0,
      budget: 0,
      icon: categoryIcons[name] || "•••",
    })
  );

  /*
   * The trip currently has one overall budget rather
   * than separate budgets for each category.
   *
   * Therefore the breakdown shows actual category
   * spending and each category's percentage of the
   * total trip budget.
   */
  const totalSpent = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount || 0),
    0
  );

  const totalBudget = Number(budget) || 0;

  const remaining = totalBudget - totalSpent;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <main className="breakdown-page">

      {/* HEADER */}

      <header className="breakdown-header">
        <div>
          <button
            type="button"
            className="back-button"
            onClick={onBack}
          >
            ← Back to budget
          </button>

          <span className="budget-eyebrow">
            {trip.destination?.toUpperCase() ||
              "YOUR TRIP"}
          </span>

          <h1>Budget breakdown</h1>

          <p>
            See where your trip budget is going.
          </p>
        </div>
      </header>

      {/* SUMMARY */}

      <section className="breakdown-summary">
        <div className="summary-card">
          <span>Total budget</span>

          <strong>
            {formatCurrency(totalBudget)}
          </strong>
        </div>

        <div className="summary-card">
          <span>Spent</span>

          <strong>
            {formatCurrency(totalSpent)}
          </strong>
        </div>

        <div className="summary-card">
          <span>Remaining</span>

          <strong>
            {formatCurrency(remaining)}
          </strong>
        </div>
      </section>

      {/* CATEGORY BREAKDOWN */}

      <section className="breakdown-section">
        <div className="breakdown-section-header">
          <div>
            <h2>Spending by category</h2>

            <p>
              See how your actual spending is
              distributed across your trip.
            </p>
          </div>
        </div>

        <div className="category-list">
          {categories.map((category) => {
            /*
             * Percentage of the TOTAL trip budget
             * spent in this category.
             */
            const percentage =
              totalBudget > 0
                ? Math.min(
                    (category.amount /
                      totalBudget) *
                      100,
                    100
                  )
                : 0;

            return (
              <article
                key={category.name}
                className="category-card"
              >
                <div className="category-top">
                  <div className="category-name">
                    <div className="category-icon">
                      {category.icon}
                    </div>

                    <div>
                      <h3>
                        {category.name}
                      </h3>

                      <span>
                        {formatCurrency(
                          category.amount
                        )}{" "}
                        spent
                      </span>
                    </div>
                  </div>

                  <div className="category-amount">
                    <strong>
                      {Math.round(percentage)}%
                    </strong>

                    <span>
                      of total budget
                    </span>
                  </div>
                </div>

                <div className="category-progress">
                  <div className="category-track">
                    <div
                      className="category-fill"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  <span>
                    {formatCurrency(
                      category.amount
                    )}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default BudgetBreakdown;