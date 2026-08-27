import { useState } from "react";

import { updateTrip } from "../../services/apiService";

import "../../styles/createTrips.css";

interface Trip {
  id: number;
  destination: string;
  country: string;
  startDate: string;
  endDate: string;
  travellers: number;
  description: string;
  budget: number;
  image?: string;
  photoAttribute?: string;
}

interface EditTripProps {
  trip: Trip;
  onClose: () => void;
}

function EditTrip({ trip, onClose }: EditTripProps) {
  const [destination, setDestination] = useState(trip.destination);
  const [startDate, setStartDate] = useState(trip.startDate ? trip.startDate.split("T")[0] : "");
  const [endDate, setEndDate] = useState(trip.endDate ? trip.endDate.split("T")[0] : "");
  const [travellers, setTravellers] = useState(trip.travellers);
  const [description, setDescription] = useState(trip.description);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await updateTrip(
        trip.id,
        destination,
        startDate,
        endDate,
        travellers,
        description,
        trip.budget ?? 0,
      );

      onClose();
    } catch (error) {
      console.error("Error updating trip:", error);

      setError(
        error instanceof Error ? error.message : "Failed to update trip.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-trip-modal">
      <div className="create-trip-modal-header">
        <div>
          <span>EDIT YOUR TRIP</span>
        </div>

        <button
          type="button"
          className="close-trip-modal"
          onClick={onClose}
          aria-label="Close"
          disabled={loading}
        >
          ×
        </button>
      </div>

      <form className="create-trip-form" onSubmit={handleSubmit}>
        {error && <div className="trip-form-error">{error}</div>}

        {/* Destination */}
        <div className="form-group">
          <label htmlFor="destination">Destination</label>

          <div className="input-with-icon">
            <input
              id="destination"
              type="text"
              placeholder="Where are you going?"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Dates */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="start-date">Start date</label>

            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="end-date">End date</label>

            <input
              id="end-date"
              type="date"
              value={endDate}
              min={startDate}
              onChange={(event) => setEndDate(event.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Travellers */}
        <div className="form-group">
          <label htmlFor="travellers">Travellers</label>

          <div className="traveller-control">
            <button
              type="button"
              onClick={() => setTravellers(Math.max(1, travellers - 1))}
              disabled={loading}
            >
              −
            </button>

            <span>
              {travellers}
              {travellers === 1 ? " traveller" : " travellers"}
            </span>

            <button
              type="button"
              onClick={() => setTravellers(travellers + 1)}
              disabled={loading}
            >
              +
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">
            About your trip
            <span className="optional">Optional</span>
          </label>

          <textarea
            id="description"
            placeholder="What are you hoping to do on this trip?"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            disabled={loading}
          />
        </div>

        {/* Submit */}
        <button className="create-trip-button" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save changes"}

          {!loading && <span>→</span>}
        </button>
      </form>
    </div>
  );
}

export default EditTrip;
