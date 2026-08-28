import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Itinerary from "./itinerary";
import Budget from "./budget";
import EditTrip from "../components/ui/editTrip";
import TripNavigation from "../components/ui/tripNavigation";

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

function TripDashboard() {
  const navigate = useNavigate();
  const { tripId } = useParams();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          endDate: apiTrip.end_date ? apiTrip.end_date.split("T")[0]: "",
          travellers: apiTrip.travellers ?? 1,
          description: apiTrip.description ?? "",
          budget: apiTrip.budget ?? 0,
          image,
        });
      } catch (error) {
        console.error("Error fetching trip:", error);

        setError(
          error instanceof Error ? error.message : "Failed to load trip.",
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
          <button className="back-to-trips" onClick={() => navigate("/trips")}>
            ←
          </button>

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
      <TripNavigation />

      <section className="trip-dashboard-container">
        {/* TRIP CONTENT */}
        <section className="trip-dashboard-content">
          <motion.section
            id="itinerary"
            className="narrative-section itinerary-section"
            initial={{
              opacity: 0,
              y: 60,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.08,
            }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
          >
            <Itinerary trip={trip}/>
          </motion.section>

          <motion.section
            id="budget"
            className="narrative-section budget-section"
            initial={{
              opacity: 0,
              y: 60,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.08,
            }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
          >
            <Budget />
          </motion.section>
        </section>
      </section>
    </main>
  );
}

export default TripDashboard;
