import { useState } from "react";
import {
  createExpense,
  type Expense,
} from "../../services/apiService";

import "../../styles/addExpense.css";

interface AddExpenseProps {
  tripId: number;
  onExpenseAdded: (expense: Expense) => void;
}

const categories = [
  "Food",
  "Activities",
  "Transport",
  "Accommodation",
  "Flights",
  "Other",
];

function AddExpense({
  tripId,
  onExpenseAdded,
}: AddExpenseProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Food");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setExpenseName("");
    setExpenseAmount("");
    setExpenseCategory("Food");
    setError("");
  };

  const handleClose = () => {
    if (loading) return;

    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const amount = Number(expenseAmount);

    if (!expenseName.trim()) {
      setError("Please enter an expense name.");
      return;
    }

    if (!expenseAmount || amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (!tripId) {
      setError("No trip selected.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const today = new Date()
        .toISOString()
        .split("T")[0];

      const response = await createExpense(
        tripId,
        expenseCategory,
        expenseName.trim(),
        amount,
        today
      );

      onExpenseAdded(response.data);

      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error creating expense:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to add expense"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="add-expense-button"
        onClick={() => setIsModalOpen(true)}
      >
        <span>+</span>
        Add expense
      </button>

      {isModalOpen && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !loading
            ) {
              handleClose();
            }
          }}
        >
          <div className="expense-modal">
            <div className="expense-modal-header">
              <div>
                <span>TRACK YOUR SPENDING</span>

                <h2>Add expense</h2>

                <p>
                  Keep track of what you're spending on your trip.
                </p>
              </div>

              <button
                type="button"
                className="close-trip-modal"
                onClick={handleClose}
                disabled={loading}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form
              className="expense-form"
              onSubmit={handleSubmit}
            >
              {error && (
                <p className="budget-error">
                  {error}
                </p>
              )}

              <div className="form-group">
                <label htmlFor="expense-name">
                  Expense
                </label>

                <input
                  id="expense-name"
                  type="text"
                  placeholder="What did you spend on?"
                  value={expenseName}
                  onChange={(event) =>
                    setExpenseName(event.target.value)
                  }
                  required
                  disabled={loading}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label htmlFor="expense-amount">
                  Amount
                </label>

                <div className="expense-amount-input">
                  <span>R</span>

                  <input
                    id="expense-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={expenseAmount}
                    onChange={(event) =>
                      setExpenseAmount(event.target.value)
                    }
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="expense-category">
                  Category
                </label>

                <select
                  id="expense-category"
                  value={expenseCategory}
                  onChange={(event) =>
                    setExpenseCategory(event.target.value)
                  }
                  disabled={loading}
                >
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="create-trip-button"
                type="submit"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add expense"}

                <span>→</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AddExpense;