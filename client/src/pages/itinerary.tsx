import { useState } from "react";
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

function Itinerary() {
  const [selectedDay, setSelectedDay] = useState(1);

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

  return (
    <main className="itinerary-page">
      <section className="itinerary-container">
        {/* =========================
                    TRIP HEADER
                ========================= */}

        <header className="itinerary-header">
          <div>
            <span className="itinerary-eyebrow">YOUR TRIP</span>

            <h1>Tokyo</h1>

            <p className="itinerary-location">Japan</p>

            <div className="itinerary-meta">
              <span>12 Sep — 20 Sep 2026</span>

              <span className="meta-divider">·</span>

              <span>2 travellers</span>
            </div>
          </div>

          <div className="itinerary-actions">
            <button className="edit-trip-button">Edit trip</button>

            <button className="trip-options-button">⋯</button>
          </div>
        </header>

        {/* =========================
                    CONTENT
                ========================= */}

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

                          <button className="activity-menu">⋯</button>
                        </div>

                        <h3>{activity.title}</h3>

                        <p>{activity.location}</p>
                      </div>
                    </article>
                  ))}
                </div>

                {/* ADD ACTIVITY */}

                <button className="add-activity-button">
                  <span>+</span>
                  Add activity
                </button>
              </>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

export default Itinerary;
