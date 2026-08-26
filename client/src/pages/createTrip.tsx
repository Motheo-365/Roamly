import { useState } from "react";
import "../styles/createTrips.css";

function CreateTrip() {
    const [destination, setDestination] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [travellers, setTravellers] = useState(1);
    const [description, setDescription] = useState("");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trip = {
            destination,
            startDate,
            endDate,
            travellers,
            description,
        };

        console.log("New trip:", trip);
    };

    return (
        <main className="create-trip-page">
            <section className="create-trip-container">
                <div className="create-trip-heading">
                    <span>PLAN YOUR ADVENTURE</span>

                    <h1>Create a new trip</h1>

                    <p>
                        Start planning your next adventure and keep
                        everything in one place.
                    </p>
                </div>

                <form
                    className="create-trip-form"
                    onSubmit={handleSubmit}
                >
                    {/* Destination */}
                    <div className="form-group">
                        <label htmlFor="destination">
                            Destination
                        </label>

                        <div className="input-with-icon">
                            <input
                                id="destination"
                                type="text"
                                placeholder="Where are you going?"
                                value={destination}
                                onChange={(event) =>
                                    setDestination(
                                        event.target.value
                                    )
                                }
                                required
                            />
                        </div>
                    </div>


                    {/* Dates */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="start-date">
                                Start date
                            </label>

                            <input
                                id="start-date"
                                type="date"
                                value={startDate}
                                onChange={(event) =>
                                    setStartDate(
                                        event.target.value
                                    )
                                }
                                required
                            />
                        </div>


                        <div className="form-group">
                            <label htmlFor="end-date">
                                End date
                            </label>

                            <input
                                id="end-date"
                                type="date"
                                value={endDate}
                                min={startDate}
                                onChange={(event) =>
                                    setEndDate(
                                        event.target.value
                                    )
                                }
                                required
                            />
                        </div>
                    </div>


                    {/* Travellers */}
                    <div className="form-group">
                        <label htmlFor="travellers">
                            Travellers
                        </label>

                        <div className="traveller-control">
                            <button
                                type="button"
                                onClick={() =>
                                    setTravellers(
                                        Math.max(
                                            1,
                                            travellers - 1
                                        )
                                    )
                                }
                            >
                                −
                            </button>

                            <span>
                                {travellers}
                                {travellers === 1
                                    ? " traveller"
                                    : " travellers"}
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    setTravellers(
                                        travellers + 1
                                    )
                                }
                            >
                                +
                            </button>
                        </div>
                    </div>


                    {/* Description */}
                    <div className="form-group">
                        <label htmlFor="description">
                            About your trip
                            <span className="optional">
                                Optional
                            </span>
                        </label>

                        <textarea
                            id="description"
                            placeholder="What are you hoping to do on this trip?"
                            value={description}
                            onChange={(event) =>
                                setDescription(
                                    event.target.value
                                )
                            }
                            rows={4}
                        />
                    </div>


                    {/* Submit */}
                    <button
                        className="create-trip-button"
                        type="submit"
                    >
                        Create trip
                        <span>→</span>
                    </button>
                </form>
            </section>
        </main>
    );
}

export default CreateTrip;