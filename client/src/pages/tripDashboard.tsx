import { motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Itinerary from "./itinerary";
import Budget from "./budget";
import TripNavigation from "../components/ui/tripNavigation";
import EditTrip from "../components/ui/editTrip";

import {
  getTrip,
  getDestinationImage,
  type Trip as ApiTrip,
} from "../services/apiService";

import "../styles/tripDashboard.css";

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

const formatDate = (dateString: string) => {
  if (!dateString) return "Date not set";

  const normalisedDate = dateString.replace(/\//g, "-");
  const [year, month, day] = normalisedDate.split("-").map(Number);

  if (!year || !month || !day) return "Date not set";

  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Motion variant definitions for smooth staggered entrance
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

function TripDashboard() {
  const { tripId } = useParams();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditTripOpen, setIsEditTripOpen] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!tripId) {
        setError("No trip was specified.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getTrip(Number(tripId));
        const apiTrip: ApiTrip = response.data;
        const destination = apiTrip.destination ?? "Unknown destination";
        const parts = destination.split(",").map((part) => part.trim());

        let image = "";
        try {
          const imageResponse = await getDestinationImage(destination);
          image = imageResponse.data.url;
        } catch (imageError) {
          console.warn(`Could not load image for ${destination}:`, imageError);
        }

        setTrip({
          id: apiTrip.id,
          destination: parts[0] || destination,
          country: parts[1] || "",
          startDate: apiTrip.start_date ? apiTrip.start_date.split("T")[0] : "",
          endDate: apiTrip.end_date ? apiTrip.end_date.split("T")[0] : "",
          travellers: apiTrip.travellers ?? 1,
          description: apiTrip.description ?? "",
          budget: apiTrip.budget ?? 0,
          image,
        });
      } catch (err) {
        console.error("Error fetching trip:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load trip."
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchTrip();
  }, [tripId]);

  if (loading) {
    return (
      <main className="trip-dashboard-page">
        <TripNavigation />
        <section className="trip-dashboard-container">
          <div className="trip-not-found">
            <h1>Loading your trip...</h1>
            <p>We're getting your trip ready.</p>
          </div>
        </section>
      </main>
    );
  }

  if (error || !trip) {
    return (
      <main className="trip-dashboard-page">
        <TripNavigation />
        <section className="trip-dashboard-container">
          <div className="trip-not-found">
            <h1>Trip not found</h1>
            <p>{error || "We couldn't find the trip you're looking for."}</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="trip-dashboard-page">
      <section className="trip-dashboard-container">
        <TripNavigation />

        {/* HERO SECTION */}
        <header id="home" className="trip-dashboard-hero">
          <div className="trip-dashboard-hero-image">
            {trip.image && (
              <img
                src={trip.image}
                alt={`${trip.destination}, ${trip.country}`}
              />
            )}

            <div className="trip-dashboard-hero-overlay" />

            <button
              className="edit-trip-button"
              onClick={() => setIsEditTripOpen(true)}
            >
              Edit trip
            </button>

            <div className="trip-dashboard-hero-content">
              <h1>{trip.destination}</h1>
              <p>{trip.description}</p>

              {trip.country && (
                <p className="trip-dashboard-location">{trip.country}</p>
              )}

              <div className="trip-dashboard-meta">
                <span>
                  {formatDate(trip.startDate)}
                  {" — "}
                  {formatDate(trip.endDate)}
                </span>
                <span className="meta-divider">·</span>
                <span>
                  {trip.travellers}{" "}
                  {trip.travellers === 1 ? "traveller" : "travellers"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* TWO-COLUMN CONTENT WITH STAGGERED MOTION */}
        <motion.section 
          className="trip-dashboard-content"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.15 }}
        >
          <motion.section
            id="itinerary"
            className="narrative-section itinerary-section"
            variants={sectionVariants}
          >
            <Itinerary trip={trip} />
          </motion.section>

          <motion.section
            id="budget"
            className="narrative-section budget-section"
            variants={sectionVariants}
          >
            <Budget />
          </motion.section>
        </motion.section>

        {/* EDIT TRIP MODAL */}
        {isEditTripOpen && (
          <div
            className="create-trip-modal-overlay"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setIsEditTripOpen(false);
              }
            }}
          >
            <EditTrip
              trip={trip}
              onClose={() => {
                setIsEditTripOpen(false);
              }}
            />
          </div>
        )}
      </section>
    </main>
  );
}

export default TripDashboard;