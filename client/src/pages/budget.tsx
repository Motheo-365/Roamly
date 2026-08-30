import { useEffect, useState } from "react";

import AddExpense from "../components/ui/addExpense";
import { 
  type Expense,
  getTrip,
  updateTrip,
} from "../services/apiService";

import "../styles/budget.css";

interface BudgetProps {
  tripId: number;
  travellers: number;
  expenses: Expense[];
  onExpenseAdded: (expense: Expense) => void;
  onExpenseDeleted: (expenseId: number) => void;
}

function Budget({
  tripId,
  travellers,
  expenses,
  onExpenseAdded,
  onExpenseDeleted,
}: BudgetProps) {
  const [budget, setBudget] = useState(0);
  const [showBudgetInput, setShowBudgetInput] = useState(false);
  const [newBudget, setNewBudget] = useState("15000");
  const [, setLoadingBudget] = useState(false);
  const [showExpenses, setShowExpenses] = useState(true);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  const [sortOption, setSortOption] = useState<
    "date-newest" | "date-oldest" | "amount-high" | "amount-low"
  >("date-newest");

  const totalSpent = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0,
  );

  const safeTravellers = Math.max(Number(travellers) || 1, 1);
  const spentPerson = totalSpent / safeTravellers;
  const budgetPerson = budget / safeTravellers;

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

  const deleteExpense = () => {
    if (!expenseToDelete) return;
    onExpenseDeleted(expenseToDelete.id);
    setExpenseToDelete(null);
  };

  const saveBudget = async () => {
    const value = Number(newBudget);

    if (value <= 0) {
      return;
    }

    try {
      const tripResponse = await getTrip(tripId);
      const trip = tripResponse.data;

      const response = await updateTrip(
        tripId,
        trip.destination ?? "",
        trip.start_date ?? "",
        trip.end_date ?? "",
        Number(trip.travellers) || 1,
        trip.description ?? "",
        value,
      );

      const savedBudget = Number(response.data.budget);

      setBudget(savedBudget);
      setNewBudget(String(savedBudget));
      setShowBudgetInput(false);
    } catch (error) {
      console.error("Failed to save budget:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to save budget.",
      );
    }
  };

  const sortedExpenses = [...expenses].sort((a, b) => {
    switch (sortOption) {
      case "date-oldest":
        return (
          new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime()
        );

      case "amount-high":
        return Number(b.amount) - Number(a.amount);

      case "amount-low":
        return Number(a.amount) - Number(b.amount);

      case "date-newest":
      default:
        return (
          new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
        );
    }
  });

  // Load and get budget from backend.
  useEffect(() => {
    const loadBudget = async () => {
      try {
        setLoadingBudget(true);

        const response = await getTrip(tripId);
        const savedBudget = Number(response.data.budget) || 0;

        setBudget(savedBudget);
        setNewBudget(String(savedBudget));
      } catch (error) {
        console.error("Failed to load trip budget:", error);
      } finally {
        setLoadingBudget(false);
      }
    };

    loadBudget();
  }, [tripId]);

  return (
    <main className="budget-page">
      {/* Header */}
      <header className="budget-header">
        <div>
          <span className="budget-eyebrow">{ }</span>

          <h1>Budgeting</h1>
        </div>

        {/* ADD EXPENSE MODAL */}

        <AddExpense tripId={tripId} onExpenseAdded={onExpenseAdded} />
      </header>

      {/* Budget overview */}
      <section className="budget-overview">
        {/* Top statistics */}
        <div className="budget-stats">
          <div className="budget-total">
            <span className="budget-label">Total spent</span>

            <h2>{formatCurrency(totalSpent)}</h2>

            <p>of {formatCurrency(budget)} budget</p>
          </div>

          <div className="budget-total">
            <span className="budget-label">Travellers</span>

            <h2>{safeTravellers}</h2>

            <p>{safeTravellers === 1 ? "traveller" : "travellers"}</p>
          </div>

          <div className="budget-total">
            <span className="budget-label">Spent per person</span>

            <h2>{formatCurrency(spentPerson)}</h2>

            <p>budget per person: {formatCurrency(budgetPerson)}</p>
          </div>
        </div>

        {/* Progress + actions */}
        <div className="budget-overview-bottom">
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
          </div>
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
            aria-label={showExpenses ? "Collapse expenses" : "Expand expenses"}
          >
            <span className="section-chevron">
              {showExpenses ? "Hide Expenses" : "Show Expenses"}
            </span>

            <div>
              <span>{expenses.length} expenses</span>
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
                  default:
                    return "date-newest";
                }
              });
            }}
          >
            <strong>Sort:</strong>

            {sortOption === "date-newest" && "Date (newest first)"}

            {sortOption === "date-oldest" && "Date (oldest first)"}

            {sortOption === "amount-high" && "Amount (highest first)"}

            {sortOption === "amount-low" && "Amount (lowest first)"}
          </button>
        </div>

        {/* Expense table/list */}
        {showExpenses && (
          <>
            {expenses.length === 0 ? (
              <div className="empty-expenses">
                <div className="empty-icon">R</div>

                <h3>You haven't added any expenses yet.</h3>

                <p>
                  Start tracking your spending to stay on top of your trip
                  budget.
                </p>

                {/* This opens the SAME AddExpense modal */}
                <AddExpense tripId={tripId} onExpenseAdded={onExpenseAdded} />
              </div>
            ) : (
              <div className="expense-list">
                {sortedExpenses.map((expense) => (
                  <article key={expense.id} className="expense-item">
                    <div className="expense-details">
                      <h3>{expense.description}</h3>

                      <span>{expense.category}</span>
                    </div>

                    <div className="expense-date">
                      {expense.date
                        ? new Date(expense.date).toLocaleDateString("en-ZA", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Date not set"}
                    </div>

                    <strong className="expense-amount">
                      {formatCurrency(Number(expense.amount))}
                    </strong>

                    <button
                      type="button"
                      className="delete-expense"
                      onClick={() => setExpenseToDelete(expense)}
                      aria-label={`Delete ${expense.description}`}
                    >
                      &#128465;
                    </button>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* Delete confirmation modal */}
      {expenseToDelete && (
        <div
          className="delete-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setExpenseToDelete(null);
            }
          }}
        >
          <div className="delete-modal">
            <span className="delete-modal-eyebrow">REMOVE EXPENSE</span>

            <h2>Delete this expense?</h2>

            <p>
              Are you sure you want to remove{" "}
              <strong>{expenseToDelete.description}</strong> from your trip
              budget? This action cannot be undone.
            </p>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="delete-cancel-button"
                onClick={() => setExpenseToDelete(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="delete-confirm-button"
                onClick={deleteExpense}
              >
                Delete expense
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Budget;
