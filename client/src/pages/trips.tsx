import { useMemo, useState } from "react";
import CreateTrip from "../components/ui/createTrip";

import "../styles/trips.css";

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

const sampleTrips: Trip[] = [
    {
        id: 1,
        destination: "Tokyo",
        country: "Japan",
        startDate: "2026-09-12",
        endDate: "2026-09-20",
        travellers: 2,
        description:
            "Explore Shibuya, visit Tokyo Tower and discover the city.",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
    },
    {
        id: 2,
        destination: "Paris",
        country: "France",
        startDate: "2026-10-04",
        endDate: "2026-10-11",
        travellers: 1,
        description:
            "A week of museums, cafés and exploring the streets of Paris.",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
    },
    {
        id: 3,
        destination: "Cape Town",
        country: "South Africa",
        startDate: "2026-11-14",
        endDate: "2026-11-18",
        travellers: 3,
        description:
            "Weekend getaway with hikes, beaches and good food.",
        image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99",
    },
];

function Trips() {
  const [trips] = useState<Trip[]>(sampleTrips);
  const [view, setView] = useState<"upcoming" | "past">("upcoming");
  const [isCreateTripOpen, setIsCreateTripOpen] = useState(false);
  const today = new Date();

  const upcomingTrips = useMemo(() => {
    return trips.filter((trip) => new Date(trip.endDate) >= today);
  }, [trips]);

  const pastTrips = useMemo(() => {
    return trips.filter((trip) => new Date(trip.endDate) < today);
  }, [trips]);

  const displayedTrips = view === "upcoming" ? upcomingTrips : pastTrips;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getTripDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const difference = end.getTime() - start.getTime();

    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  };

  return (
    <main className="trips-page">
      <section className="trips-container">
        <div className="trips-header">
          <div>
            <span className="trips-eyebrow">YOUR ADVENTURES</span>

            <h1>My trips</h1>

            <p>
              Keep track of where you're going and everything you're planning.
            </p>
          </div>

          <button
            className="new-trip-button"
            onClick={() => setIsCreateTripOpen(true)}
          >
            <span>+</span>
            New trip
          </button>
        </div>

        <div className="trip-tabs">
          <button
            className={view === "upcoming" ? "active" : ""}
            onClick={() => setView("upcoming")}
          >
            Upcoming
            <span>{upcomingTrips.length}</span>
          </button>

          <button
            className={view === "past" ? "active" : ""}
            onClick={() => setView("past")}
          >
            Past
            <span>{pastTrips.length}</span>
          </button>
        </div>

        {displayedTrips.length > 0 ? (
          <div className="trips-grid">
            {displayedTrips.map((trip) => (
              <article
                  className="trip-card"
                  key={trip.id}
              >
                  <div className="trip-card-image">

                      {trip.image && (
                          <img
                              src={trip.image}
                              alt={`${trip.destination}, ${trip.country}`}
                          />
                      )}

                      <div className="trip-image-overlay" />

                      <div className="trip-card-top">
                          <span className="trip-status">
                              {view === "upcoming"
                                  ? "UPCOMING"
                                  : "COMPLETED"}
                          </span>

                          <button className="trip-menu">
                              ⋯
                          </button>
                      </div>

                      <div className="trip-destination">
                          <h2>{trip.destination}</h2>

                          <span>{trip.country}</span>
                      </div>

                  </div>

                  <div className="trip-card-content">

                      <div className="trip-main-info">

                          <div className="trip-date">
                              <span className="detail-label">
                                  TRAVEL DATES
                              </span>

                              <p>
                                  {formatDate(trip.startDate)}
                                  {" — "}
                                  {formatDate(trip.endDate)}
                              </p>
                          </div>

                          <div className="trip-duration">
                              <span className="detail-label">
                                  DURATION
                              </span>

                              <p>
                                  {getTripDuration(
                                      trip.startDate,
                                      trip.endDate
                                  )} days
                              </p>
                          </div>

                      </div>

                      <div className="trip-secondary-info">

                          <div>
                              <span className="detail-label">
                                  TRAVELLERS
                              </span>

                              <p>
                                  {trip.travellers}{" "}
                                  {trip.travellers === 1
                                      ? "traveller"
                                      : "travellers"}
                              </p>
                          </div>

                          <div className="trip-description">
                              {trip.description}
                          </div>

                      </div>

                      <button className="view-trip-button">
                          <span>View trip</span>

                          <span className="view-trip-arrow">
                              →
                          </span>
                      </button>

                  </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-trips">
            <div className="empty-icon">+</div>

            <h2>No {view === "upcoming" ? "upcoming" : "past"} trips</h2>

            <p>
              {view === "upcoming"
                ? "Start planning your next adventure."
                : "Your completed trips will appear here."}
            </p>

            {view === "upcoming" && (
              <button 
                className="new-trip-button"
                onClick={() => setIsCreateTripOpen(true)}
              >
                Create your first trip
              </button>
            )}
          </div>
        )}

        {isCreateTripOpen && (
          <div
            className="create-trip-modal-overlay"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setIsCreateTripOpen(false);
              }
            }}
          >
              <CreateTrip
                onClose={() => setIsCreateTripOpen(false)}
              />
          </div>
        )}
      </section>
    </main>
  );
}

export default Trips;
