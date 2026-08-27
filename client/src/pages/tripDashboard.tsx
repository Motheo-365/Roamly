import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Itinerary from "./itinerary";
import Budget from "./budget";
import EditTrip from "../components/ui/editTrip";
import TripNavigation from "../components/ui/tripNavigation";

import "../styles/tripDashboard.css";

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
    description: "Explore Shibuya, visit Tokyo Tower and discover the city.",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
  },
  {
    id: 2,
    destination: "Paris",
    country: "France",
    startDate: "2026-10-04",
    endDate: "2026-10-11",
    travellers: 1,
    description: "A week of museums, cafés and exploring the streets of Paris.",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
  },
  {
    id: 3,
    destination: "Cape Town",
    country: "South Africa",
    startDate: "2026-11-14",
    endDate: "2026-11-18",
    travellers: 3,
    description: "Weekend getaway with hikes, beaches and good food.",
    image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99",
  },
];

function TripDashboard() {
  const navigate = useNavigate();
  const { tripId } = useParams();

  const [isEditTripOpen, setIsEditTripOpen] = useState(false);
  const trip = sampleTrips.find((trip) => trip.id === Number(tripId));

  if (!trip) {
    return (
      <main className="trip-dashboard-page">
        <section className="trip-dashboard-container">
          <button className="back-to-trips" onClick={() => navigate("/trips")}>
            ←
          </button>

          <div className="trip-not-found">
            <h1>Trip not found</h1>
            <p>We couldn't find the trip you're looking for.</p>
          </div>
        </section>
      </main>
    );
  }

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);

    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <main className="trip-dashboard-page">
      <TripNavigation />

      <section className="trip-dashboard-container">
        {/* HERO */}
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
              <p className="trip-dashboard-location">{trip.country}</p>
              <div className="trip-dashboard-meta">
                <span>
                  {formatDate(trip.startDate)}
                  {" — "}
                  {formatDate(trip.endDate)} {trip.endDate.split("-")[0]}
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

        {/* INTRO */}
        <section className="trip-dashboard-intro">
          <div>
            <span className="trip-dashboard-intro-label">YOUR ADVENTURE</span>
            <p>{trip.description}</p>
          </div>

        </section>

        {/* TRIP CONTENT */}
        <section className="trip-dashboard-content">
          <motion.section
            id="itinerary"
            className="narrative-section itinerary-section"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Itinerary />
          </motion.section>

          <motion.section
            id="budget"
            className="narrative-section budget-section"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Budget />
          </motion.section>
        </section>

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
            <EditTrip trip={trip} onClose={() => setIsEditTripOpen(false)} />
          </div>
        )}
      </section>
    </main>
  );
}

export default TripDashboard;