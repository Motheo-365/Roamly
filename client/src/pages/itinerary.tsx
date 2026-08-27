import { useState } from "react";

import EditTrip from "../components/ui/editTrip";
import AddActivity from "../components/ui/addActivity";

import "../styles/itinerary.css";

interface Activity {
  id: number;
  time: string;
  title: string;
  location: string;
  type: "activity" | "food" | "transport" | "hotel";
}

interface Day {
  id: number;
  date: string;
  title: string;
  activities: Activity[];
}

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

const itineraryDays: Day[] = [
  {
    id: 1,
    date: "2026-09-12",
    title: "Arrival & Shibuya",
    activities: [
      {
        id: 1,
        time: "09:30",
        title: "Arrive at Haneda Airport",
        location: "Haneda Airport",
        type: "transport",
      },
      {
        id: 2,
        time: "11:00",
        title: "Check in",
        location: "Shibuya",
        type: "hotel",
      },
      {
        id: 3,
        time: "14:00",
        title: "Explore Shibuya",
        location: "Shibuya Crossing",
        type: "activity",
      },
      {
        id: 4,
        time: "19:00",
        title: "Dinner",
        location: "Shibuya",
        type: "food",
      },
    ],
  },
  {
    id: 2,
    date: "2026-09-13",
    title: "Tokyo highlights",
    activities: [
      {
        id: 5,
        time: "09:00",
        title: "Meiji Shrine",
        location: "Shibuya",
        type: "activity",
      },
      {
        id: 6,
        time: "12:30",
        title: "Lunch",
        location: "Harajuku",
        type: "food",
      },
      {
        id: 7,
        time: "15:00",
        title: "Tokyo Tower",
        location: "Minato",
        type: "activity",
      },
    ],
  },
  {
    id: 3,
    date: "2026-09-14",
    title: "Asakusa & Akihabara",
    activities: [
      {
        id: 8,
        time: "09:30",
        title: "Senso-ji Temple",
        location: "Asakusa",
        type: "activity",
      },
      {
        id: 9,
        time: "13:00",
        title: "Lunch in Asakusa",
        location: "Asakusa",
        type: "food",
      },
      {
        id: 10,
        time: "16:00",
        title: "Explore Akihabara",
        location: "Akihabara",
        type: "activity",
      },
    ],
  },
];

const trip: Trip = {
  id: 1,
  destination: "Tokyo",
  country: "Japan",
  startDate: "2026-09-12",
  endDate: "2026-09-20",
  travellers: 2,
  description: "Explore Shibuya, visit Tokyo Tower and discover the city.",
  image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
};

function Itinerary() {
  const [days, setDays] = useState<Day[]>(itineraryDays);
  const [selectedDay, setSelectedDay] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(
    null,
  );

  const currentDay = itineraryDays.find((day) => day.id === selectedDay);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  };

  const getTypeLabel = (type: Activity["type"]) => {
    switch (type) {
      case "food":
        return "Food";

      case "transport":
        return "Transport";

      case "hotel":
        return "Stay";

      default:
        return "Activity";
    }
  };

  const deleteActivity = () => {
    if (!activityToDelete) return;

    setDays((currentDays) =>
      currentDays.map((day) => ({
        ...day,
        activities: day.activities.filter(
          (activity) => activity.id !== activityToDelete.id,
        ),
      })),
    );

    setActivityToDelete(null);
  };

  return (
    <main className="itinerary-page">
      <section className="itinerary-container">
        <header className="itinerary-header">
          <div>
            <span className="itinerary-eyebrow">YOUR TRIP</span>

            <h1>{trip.destination}</h1>

            <p className="itinerary-location">{trip.country}</p>

            <div className="itinerary-meta">
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
        </header>

        <div className="itinerary-layout">
          {/* DAY NAVIGATION */}

          <aside className="day-navigation">
            <span className="day-navigation-label">ITINERARY</span>

            <div className="day-list">
              {itineraryDays.map((day) => (
                <button
                  key={day.id}
                  className={
                    selectedDay === day.id ? "day-button active" : "day-button"
                  }
                  onClick={() => setSelectedDay(day.id)}
                >
                  <span className="day-number">Day {day.id}</span>

                  <span className="day-date">{formatDate(day.date)}</span>
                </button>
              ))}
            </div>
          </aside>

          {/* CURRENT DAY */}

          <section className="day-content">
            {currentDay && (
              <>
                <div className="day-heading">
                  <div>
                    <span>DAY {currentDay.id}</span>

                    <h2>{currentDay.title}</h2>
                  </div>

                  <time>{formatDate(currentDay.date)}</time>
                </div>

                {/* ACTIVITIES */}

                <div className="activity-list">
                  {currentDay.activities.map((activity) => (
                    <article className="activity" key={activity.id}>
                      <div className="activity-time">{activity.time}</div>

                      <div className="activity-line">
                        <span />
                      </div>

                      <div className="activity-card">
                        <div className="activity-card-top">
                          <span className="activity-type">
                            {getTypeLabel(activity.type)}
                          </span>

                          <button
                            type="button"
                            className="delete-activity"
                            onClick={() => setActivityToDelete(activity)}
                            aria-label={`Delete ${activity.title}`}
                          >
                            &#128465;
                          </button>
                        </div>

                        <h3>{activity.title}</h3>

                        <p>{activity.location}</p>
                      </div>
                    </article>
                  ))}
                </div>

                {/* ADD ACTIVITY */}
                <AddActivity />
              </>
            )}
          </section>
        </div>
      </section>
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <EditTrip trip={trip} onClose={() => setIsEditModalOpen(false)} />
          </div>
        </div>
      )}
      {activityToDelete && (
        <div
          className="delete-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setActivityToDelete(null);
            }
          }}
        >
          <div className="delete-modal">
            <span className="delete-modal-eyebrow">REMOVE ACTIVITY</span>

            <h2>Delete this activity?</h2>

            <p>
              Are you sure you want to remove{" "}
              <strong>{activityToDelete.title}</strong> from your itinerary?
              This action cannot be undone.
            </p>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="delete-cancel-button"
                onClick={() => setActivityToDelete(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="delete-confirm-button"
                onClick={deleteActivity}
              >
                Delete activity
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Itinerary;
