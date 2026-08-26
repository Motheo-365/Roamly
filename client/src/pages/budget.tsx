import { useState } from "react";

import "../styles/budget.css";

interface Expense {
  id: number;
  name: string;
  category: string;
  amount: number;
  date: string;
}

const initialExpenses: Expense[] = [
  {
    id: 1,
    name: "Hotel",
    category: "Lodging",
    amount: 4200,
    date: "2026-10-12",
  },
  {
    id: 2,
    name: "Airport train",
    category: "Transport",
    amount: 350,
    date: "2026-10-12",
  },
  {
    id: 3,
    name: "Dinner in Shibuya",
    category: "Food",
    amount: 480,
    date: "2026-10-13",
  },
  {
    id: 4,
    name: "Tokyo Tower",
    category: "Entertainment",
    amount: 320,
    date: "2026-10-13",
  },
];

const categories = ["Food", "Entertainment", "Transport", "Lodging", "Other"];

function Budget() {
  const [expensesList, setExpensesList] = useState<Expense[]>(initialExpenses);

  const [budget, setBudget] = useState(15000);
  const [showBudgetInput, setShowBudgetInput] = useState(false);
  const [newBudget, setNewBudget] = useState("15000");

  const [showExpenseForm, setShowExpenseForm] = useState(false);

  // New expense form state
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Food");
    
  const [showExpenses, setShowExpenses] = useState(true);

    const [sortOption, setSortOption] = useState<
        "date-newest" | "date-oldest" | "amount-high" | "amount-low"
    >("date-newest");  const totalSpent = expensesList.reduce(
        (total, expense) => total + expense.amount,
        0,
    );

  const remaining = budget - totalSpent;

  const percentageSpent =
    budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleAddExpense = () => {
    const amount = Number(expenseAmount);

    if (!expenseName.trim() || amount <= 0) {
      return;
    }

    const newExpense: Expense = {
      id: Date.now(),
      name: expenseName.trim(),
      category: expenseCategory,
      amount: amount,
      date: new Date().toISOString().split("T")[0],
    };

    setExpensesList((currentExpenses) => [newExpense, ...currentExpenses]);

    // Reset form
    setExpenseName("");
    setExpenseAmount("");
    setExpenseCategory("Food");
    setShowExpenseForm(false);
  };

  const saveBudget = () => {
    const value = Number(newBudget);

    if (value > 0) {
      setBudget(value);
      setShowBudgetInput(false);
    }
  };

  const sortedExpenses = [...expensesList].sort((a, b) => {
        switch (sortOption) {
            case "date-oldest":
                return (
                    new Date(a.date).getTime() -
                    new Date(b.date).getTime()
                );

            case "amount-high":
                return b.amount - a.amount;

            case "amount-low":
                return a.amount - b.amount;

            case "date-newest":
            default:
                return (
                    new Date(b.date).getTime() -
                    new Date(a.date).getTime()
                );
        }
    });

  return (
    <main className="budget-page">
      {/* Header */}
      <header className="budget-header">
        <div>
          <span className="budget-eyebrow">TOKYO ADVENTURE</span>

          <h1>Budgeting</h1>
        </div>

        <button
          className="add-expense-button"
          onClick={() => setShowExpenseForm(!showExpenseForm)}
        >
          <span>+</span>
          Add expense
        </button>
      </header>

      {/* Add expense form */}
      {showExpenseForm && (
        <section className="set-budget-panel expense-form">
          <div>
            <h3>Add a new expense</h3>
          </div>

          <div className="expense-form-fields">
            {/* Expense name */}
            <div className="form-field">
              <label htmlFor="expense-name">Expense</label>

              <input
                id="expense-name"
                type="text"
                placeholder="e.g. Dinner in Shibuya"
                value={expenseName}
                onChange={(event) => setExpenseName(event.target.value)}
              />
            </div>

            {/* Amount */}
            <div className="form-field">
                <label htmlFor="expense-currency">Amount</label>
              <div className="amount-input">

                <input
                  id="expense-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={expenseAmount}
                  onChange={(event) => setExpenseAmount(event.target.value)}
                />
              </div>
            </div>

            {/* Category */}
            <div className="form-field">
              <label htmlFor="expense-category">Category</label>

              <select
                id="expense-category"
                value={expenseCategory}
                onChange={(event) => setExpenseCategory(event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="expense-form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => setShowExpenseForm(false)}
            >
              Cancel
            </button>

            <button
              type="button"
              className="save-expense-button"
              onClick={handleAddExpense}
            >
              Add expense
            </button>
          </div>
        </section>
      )}

      {/* Budget overview */}
      <section className="budget-overview">
        <div className="budget-total">
          <span className="budget-label">Total spent</span>

          <h2>{formatCurrency(totalSpent)}</h2>

          <p>of {formatCurrency(budget)} budget</p>
        </div>

        <div className="budget-progress">
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${percentageSpent}%`,
              }}
            />
          </div>

          <div className="progress-info">
            <span>{Math.round(percentageSpent)}% spent</span>

            <span>{formatCurrency(remaining)} remaining</span>
          </div>
        </div>

        <div className="budget-actions">
          <button onClick={() => setShowBudgetInput(!showBudgetInput)}>
            Set budget
          </button>

          <button>Group balances</button>

          <button>Settings</button>
        </div>
      </section>

      {/* Set budget */}
      {showBudgetInput && (
        <section className="set-budget-panel">
          <div>
            <h3>Set your trip budget</h3>
          </div>

          <div className="budget-input-wrapper">
            <span>R</span>

            <input
              type="number"
              value={newBudget}
              onChange={(event) => setNewBudget(event.target.value)}
            />

            <button onClick={saveBudget}>Save</button>
          </div>
        </section>
      )}

      {/* Expenses */}
        <section className="expenses-section">
            <div className="section-heading">
                {/* Clickable expenses header */}
                <button
                    className="section-title"
                    onClick={() => setShowExpenses(!showExpenses)}
                    aria-label={
                        showExpenses
                            ? "Collapse expenses"
                            : "Expand expenses"
                    }
                >
                    <span className="section-chevron">
                        {showExpenses ? "Hide Expenses" : "Show Expenses"}
                    </span>

                    <div>
                        <span>
                            {expensesList.length} expenses
                        </span>
                    </div>
                </button>

                {/* Sort button */}
                <button
                    className="sort-button"
                    onClick={() => {
                        setSortOption((current) => {
                            switch (current) {
                                case "date-newest":
                                    return "date-oldest";

                                case "date-oldest":
                                    return "amount-high";

                                case "amount-high":
                                    return "amount-low";

                                case "amount-low":
                                    return "date-newest";
                            }
                        });
                    }}
                >
                    <strong>Sort:</strong>

                    {sortOption === "date-newest" &&
                        "Date (newest first)"}

                    {sortOption === "date-oldest" &&
                        "Date (oldest first)"}

                    {sortOption === "amount-high" &&
                        "Amount (highest first)"}

                    {sortOption === "amount-low" &&
                        "Amount (lowest first)"}
                </button>

            </div>

            {/* Expense table/list */}
            {showExpenses && (
                <>
                    {expensesList.length === 0 ? (

                        <div className="empty-expenses">

                            <div className="empty-icon">
                                R
                            </div>

                            <h3>
                                You haven't added any expenses yet.
                            </h3>

                            <p>
                                Start tracking your spending to stay
                                on top of your trip budget.
                            </p>

                            <button
                                onClick={() => setShowExpenseForm(true)}
                            >
                                + Add your first expense
                            </button>

                        </div>

                    ) : (

                        <div className="expense-list">

                            {sortedExpenses.map((expense) => (

                                <article
                                    key={expense.id}
                                    className="expense-item"
                                >

                                    <div className="expense-details">

                                        <h3>
                                            {expense.name}
                                        </h3>

                                        <span>
                                            {expense.category}
                                        </span>

                                    </div>

                                    <div className="expense-date">

                                        {new Date(
                                            expense.date
                                        ).toLocaleDateString("en-ZA", {
                                            day: "numeric",
                                            month: "short",
                                        })}

                                    </div>

                                    <strong className="expense-amount">
                                        {formatCurrency(expense.amount)}
                                    </strong>

                                    <button className="expense-menu">
                                        ⋮
                                    </button>

                                </article>

                            ))}

                        </div>

                    )}
                </>
            )}

        </section>
    </main>
  );
}

export default Budget;
