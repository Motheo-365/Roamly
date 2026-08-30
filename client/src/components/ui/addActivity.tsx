import { useState } from "react";

import {
  createActivity,
  createExpense,
  type Activity,
  type Expense,
} from "../../services/apiService";

interface AddActivityProps {
  tripId: number;
  date: string;
  onActivityAdded: (activity: Activity) => void | Promise<void>;
  onExpenseAdded: (expense: Expense) => void;
}

function AddActivity({
  tripId,
  date,
  onActivityAdded,
  onExpenseAdded,
}: AddActivityProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("activity");
  const [location, setLocation] = useState("");
  const [cost, setCost] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setTitle("");
    setTime("");
    setType("activity");
    setLocation("");
    setCost("");
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

    if (!title.trim()) {
      setError("Please enter an activity.");
      return;
    }

    if (!time) {
      setError("Please select a time.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const activityCost = Number(cost) || 0;

      /*
       * First create the activity.
       */
      const activityResponse = await createActivity(
        tripId,
        title.trim(),
        date,
        time,
        location.trim(),
        activityCost,
      );

      /*
       * Add the activity to the itinerary immediately.
       */
      onActivityAdded(activityResponse.data);

      /*
       * If the activity has a cost, automatically
       * create a corresponding budget expense.
       */
      if (activityCost > 0) {
        const expenseCategory =
          type === "food"
            ? "Food"
            : type === "transport"
              ? "Transport"
              : type === "hotel"
                ? "Accommodation"
                : "Activities";

        const expenseResponse = await createExpense(
          tripId,
          expenseCategory,
          title.trim(),
          activityCost,
          date,
        );

        /*
         * Send the new expense back up to
         * TripDashboard so the Budget updates.
         */
        onExpenseAdded(expenseResponse.data);
      }

      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error creating activity:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to add activity",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="add-activity-button"
        onClick={() => setIsModalOpen(true)}
      >
        <span>+</span>
        Add activity
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
          <div className="activity-modal">
            <div className="activity-modal-header">
              <div>
                <span>PLAN YOUR DAY</span>

                <h2>Add activity</h2>
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
              className="activity-form"
              onSubmit={handleSubmit}
            >
              {error && (
                <p className="itinerary-error">
                  {error}
                </p>
              )}

              <div className="form-group">
                <label htmlFor="activity-title">
                  Activity
                </label>

                <input
                  id="activity-title"
                  type="text"
                  placeholder="What are you doing?"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="activity-time">
                    Time
                  </label>

                  <input
                    id="activity-time"
                    type="time"
                    value={time}
                    onChange={(event) =>
                      setTime(event.target.value)
                    }
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="activity-type">
                    Type
                  </label>

                  <select
                    id="activity-type"
                    value={type}
                    onChange={(event) =>
                      setType(event.target.value)
                    }
                    disabled={loading}
                  >
                    <option value="activity">
                      Activity
                    </option>

                    <option value="food">
                      Food
                    </option>

                    <option value="transport">
                      Transport
                    </option>

                    <option value="hotel">
                      Stay
                    </option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="activity-location">
                  Location
                </label>

                <input
                  id="activity-location"
                  type="text"
                  placeholder="Where is it?"
                  value={location}
                  onChange={(event) =>
                    setLocation(event.target.value)
                  }
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="activity-cost">
                  Cost
                </label>

                <input
                  id="activity-cost"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={cost}
                  onChange={(event) =>
                    setCost(event.target.value)
                  }
                  disabled={loading}
                />
              </div>

              <button
                className="create-trip-button"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Adding..."
                  : "Add activity"}

                <span>→</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AddActivity;