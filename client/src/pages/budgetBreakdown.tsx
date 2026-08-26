import "../../styles/budget.css";

interface Category {
  name: string;
  amount: number;
  budget: number;
  icon: string;
}

const categories: Category[] = [
  {
    name: "Accommodation",
    amount: 4200,
    budget: 6000,
    icon: "🏨",
  },
  {
    name: "Transport",
    amount: 350,
    budget: 2500,
    icon: "🚆",
  },
  {
    name: "Food",
    amount: 480,
    budget: 2500,
    icon: "🍜",
  },
  {
    name: "Activities",
    amount: 320,
    budget: 2000,
    icon: "🎟️",
  },
  {
    name: "Shopping",
    amount: 0,
    budget: 1000,
    icon: "🛍️",
  },
  {
    name: "Other",
    amount: 0,
    budget: 1000,
    icon: "•••",
  },
];

function BudgetBreakdown() {
  const totalSpent = categories.reduce(
    (total, category) => total + category.amount,
    0,
  );

  const totalBudget = categories.reduce(
    (total, category) => total + category.budget,
    0,
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <main className="breakdown-page">
      <header className="breakdown-header">
        <div>
          <button className="back-button">← Back to budget</button>

          <span className="budget-eyebrow">TOKYO ADVENTURE</span>

          <h1>Budget breakdown</h1>

          <p>See where your trip budget is going.</p>
        </div>
      </header>

      {/* Summary */}
      <section className="breakdown-summary">
        <div className="summary-card">
          <span>Total budget</span>

          <strong>{formatCurrency(totalBudget)}</strong>
        </div>

        <div className="summary-card">
          <span>Spent</span>

          <strong>{formatCurrency(totalSpent)}</strong>
        </div>

        <div className="summary-card">
          <span>Remaining</span>

          <strong>{formatCurrency(totalBudget - totalSpent)}</strong>
        </div>
      </section>

      {/* Category breakdown */}
      <section className="breakdown-section">
        <div className="breakdown-section-header">
          <div>
            <h2>Spending by category</h2>

            <p>Compare your actual spending with your planned budget.</p>
          </div>
        </div>

        <div className="category-list">
          {categories.map((category) => {
            const percentage =
              category.budget > 0
                ? Math.min((category.amount / category.budget) * 100, 100)
                : 0;

            return (
              <article key={category.name} className="category-card">
                <div className="category-top">
                  <div className="category-name">
                    <div className="category-icon">{category.icon}</div>

                    <div>
                      <h3>{category.name}</h3>

                      <span>{formatCurrency(category.amount)} spent</span>
                    </div>
                  </div>

                  <div className="category-amount">
                    <strong>{formatCurrency(category.budget)}</strong>

                    <span>budget</span>
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

                  <span>{Math.round(percentage)}%</span>
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
