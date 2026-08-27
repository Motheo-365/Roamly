import { useState } from "react";
import "../../styles/createTrips.css";

interface Trip {
  id: number;
  destination: string;
  country: string;
  startDate: string;
  endDate: string;
  travellers: number;
  description: string;
  image?: string;
  photoAttribute?: string;
}

interface EditTripProps {
  trip: Trip;
  onClose: () => void;
}

function EditTrip({ trip, onClose }: EditTripProps) {
  const [destination, setDestination] = useState(trip.destination);

  const [startDate, setStartDate] = useState(trip.startDate);

  const [endDate, setEndDate] = useState(trip.endDate);

  const [travellers, setTravellers] = useState(trip.travellers);

  const [description, setDescription] = useState(trip.description);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const updatedTrip = {
      id: trip.id,
      destination,
      country: trip.country,
      startDate,
      endDate,
      travellers,
      description,
      image: trip.image,
      photoAttribute: trip.photoAttribute,
    };

    console.log("Updated trip:", updatedTrip);

    onClose();
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
        >
          ×
        </button>
      </div>

      <form className="create-trip-form" onSubmit={handleSubmit}>
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
            >
              −
            </button>

            <span>
              {travellers}

              {travellers === 1 ? " traveller" : " travellers"}
            </span>

            <button type="button" onClick={() => setTravellers(travellers + 1)}>
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
          />
        </div>

        {/* Submit */}
        <button className="create-trip-button" type="submit">
          Save changes
          <span>→</span>
        </button>
      </form>
    </div>
  );
}

export default EditTrip;
