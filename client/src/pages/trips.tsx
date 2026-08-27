import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import CreateTrip from "../components/ui/createTrip";
import {
  getTrips,
  getDestinationImage,
  deleteTrip as deleteTripApi,
  type Trip as ApiTrip,
} from "../services/apiService";

import "../styles/trips.css";

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
}

function Trips() {
  const navigate = useNavigate();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [view, setView] = useState<"upcoming" | "past">("upcoming");

  const [isCreateTripOpen, setIsCreateTripOpen] = useState(false);

  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  // =========================
  // FETCH TRIPS
  // =========================

  const fetchTrips = async () => {
      try {
          setLoading(true);
          setError("");

          const response = await getTrips();

          const formattedTrips: Trip[] = await Promise.all(
              response.data.map(async (trip: ApiTrip) => {
                  const destination =
                      trip.destination ?? "Unknown destination";

                  const parts = destination
                      .split(",")
                      .map((part) => part.trim());

                  let image = "";

                  try {
                      const imageResponse =
                          await getDestinationImage(destination);

                      image = imageResponse.data.url;
                  } catch (imageError) {
                      console.warn(
                          `Could not load image for ${destination}:`,
                          imageError
                      );
                  }

                  return {
                      id: trip.id,
                      destination: parts[0] || destination,
                      country: parts[1] || "",
                      startDate: trip.start_date ?? "",
                      endDate: trip.end_date ?? "",
                      travellers: trip.travellers ?? 1,
                      description: trip.description ?? "",
                      budget: trip.budget ?? 0,
                      image,
                  };
              })
          );

          setTrips(formattedTrips);
      } catch (error) {
          console.error("Error fetching trips:", error);

          setError(
              error instanceof Error
                  ? error.message
                  : "Failed to load trips."
          );
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchTrips();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  // =========================
  // FILTER TRIPS
  // =========================

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingTrips = useMemo(() => {
    return trips.filter((trip) => {
      if (!trip.endDate) return true;

      const endDate = new Date(trip.endDate);
      endDate.setHours(0, 0, 0, 0);

      return endDate >= today;
    });
  }, [trips]);

  const pastTrips = useMemo(() => {
    return trips.filter((trip) => {
      if (!trip.endDate) return false;

      const endDate = new Date(trip.endDate);
      endDate.setHours(0, 0, 0, 0);

      return endDate < today;
    });
  }, [trips]);

  const displayedTrips = view === "upcoming" ? upcomingTrips : pastTrips;

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date: string) => {
    if (!date) return "Date not set";

    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // TRIP DURATION
  // =========================

  const getTripDuration = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const difference = end.getTime() - start.getTime();

    return Math.ceil(difference / (1000 * 60 * 60 * 24)) + 1;
  };

  // =========================
  // DELETE TRIP
  // =========================

  const handleDeleteTrip = async () => {
    if (!tripToDelete) return;

    try {
      setDeleting(true);
      setError("");

      await deleteTripApi(tripToDelete.id);

      setTrips((currentTrips) =>
        currentTrips.filter((trip) => trip.id !== tripToDelete.id),
      );

      setTripToDelete(null);
    } catch (error) {
      console.error("Error deleting trip:", error);

      setError(
        error instanceof Error ? error.message : "Failed to delete trip.",
      );
    } finally {
      setDeleting(false);
    }
  };

  // =========================
  // RENDER
  // =========================

  return (
    <main className="trips-page">
      <section className="trips-container">
        {/* HEADER */}

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
            + New trip
          </button>
        </div>

        {/* ERROR */}

        {error && <div className="trips-error">{error}</div>}

        {/* TABS */}

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

        {/* LOADING */}

        {loading ? (
          <div className="empty-trips">
            <div className="empty-icon">...</div>

            <h2>Loading your trips</h2>

            <p>We're getting your adventures ready.</p>
          </div>
        ) : displayedTrips.length > 0 ? (
          /* TRIP GRID */

          <div className="trips-grid">
            {displayedTrips.map((trip) => (
              <article className="trip-card" key={trip.id}>
                <div className="trip-card-image">
                  {trip.image && (
                    <img
                      src={trip.image}
                      alt={`${trip.destination}, ${trip.country}`}
                      onClick={() => navigate(`/trips/${trip.id}`)}
                    />
                  )}

                  <div className="trip-image-overlay" />

                  <div className="trip-card-top">
                    <span className="trip-status">
                      {view === "upcoming" ? "UPCOMING" : "COMPLETED"}
                    </span>

                    <button
                      type="button"
                      className="delete-trip"
                      onClick={() => setTripToDelete(trip)}
                      aria-label={`Delete trip to ${trip.destination}`}
                    >
                      &#128465;
                    </button>
                  </div>

                  <div className="trip-destination">
                    <h2>{trip.destination}</h2>

                    {trip.country && <span>{trip.country}</span>}
                  </div>
                </div>

                <div className="trip-card-content">
                  <div className="trip-main-info">
                    <div className="trip-date">
                      <span className="detail-label">TRAVEL DATES</span>

                      <p>
                        {formatDate(trip.startDate)}
                        {" — "}
                        {formatDate(trip.endDate)}
                      </p>
                    </div>

                    <div className="trip-duration">
                      <span className="detail-label">DURATION</span>

                      <p>
                        {getTripDuration(trip.startDate, trip.endDate)} days
                      </p>
                    </div>
                  </div>

                  <div className="trip-secondary-info">
                    <div>
                      <span className="detail-label">TRAVELLERS</span>

                      <p>
                        {trip.travellers}{" "}
                        {trip.travellers === 1 ? "traveller" : "travellers"}
                      </p>
                    </div>

                    {trip.description && (
                      <div className="trip-description">{trip.description}</div>
                    )}
                  </div>

                  <button
                    className="view-trip-button"
                    onClick={() => navigate(`/trips/${trip.id}`)}
                  >
                    <span>View trip</span>

                    <span className="view-trip-arrow">→</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* EMPTY STATE */

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

        {/* CREATE TRIP MODAL */}

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
              onClose={() => {
                setIsCreateTripOpen(false);

                /*
                 * Fetch the trips again
                 * so the newly created
                 * database trip appears.
                 */
                fetchTrips();
              }}
            />
          </div>
        )}
      </section>

      {/* DELETE MODAL */}

      {tripToDelete && (
        <div
          className="delete-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deleting) {
              setTripToDelete(null);
            }
          }}
        >
          <div className="delete-modal">
            <span className="delete-modal-eyebrow">REMOVE TRIP</span>

            <h2>Delete this trip?</h2>

            <p>
              Are you sure you want to delete this trip to{" "}
              <strong>{tripToDelete.destination}</strong>? This action cannot be
              undone.
            </p>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="delete-cancel-button"
                onClick={() => setTripToDelete(null)}
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="delete-confirm-button"
                onClick={handleDeleteTrip}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete trip"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Trips;
