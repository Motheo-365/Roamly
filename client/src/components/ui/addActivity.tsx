import { useState } from "react";

function AddActivity() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        className="add-activity-button"
        onClick={() => setIsModalOpen(true)}
      >
        <span>+</span>
        Add activity
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="activity-modal">
            <div className="activity-modal-header">
              <div>
                <span>PLAN YOUR DAY</span>
                <h2>Add activity</h2>
              </div>

              <button
                type="button"
                className="close-trip-modal"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form
              className="activity-form"
              onSubmit={(event) => {
                event.preventDefault();

                console.log("Activity added");

                setIsModalOpen(false);
              }}
            >
              <div className="form-group">
                <label htmlFor="activity-title">Activity</label>

                <input
                  id="activity-title"
                  type="text"
                  placeholder="What are you doing?"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="activity-time">Time</label>

                  <input id="activity-time" type="time" required />
                </div>

                <div className="form-group">
                  <label htmlFor="activity-type">Type</label>

                  <select id="activity-type" defaultValue="activity">
                    <option value="activity">Activity</option>

                    <option value="food">Food</option>

                    <option value="transport">Transport</option>

                    <option value="hotel">Stay</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="activity-location">Location</label>

                <input
                  id="activity-location"
                  type="text"
                  placeholder="Where is it?"
                />
              </div>

              <button className="create-trip-button" type="submit">
                Add activity
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