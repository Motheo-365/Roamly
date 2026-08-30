import { useEffect, useState } from "react";

import EditTrip from "../components/ui/editTrip";
import AddActivity from "../components/ui/addActivity";
import ItineraryClock from "../components/ui/itineraryClock";
import { 
  getActivitiesByTripId,
  deleteActivity as deleteActivityApi,
  type Activity as ApiActivity, 
  type Expense as ApiExpense 
} from "../services/apiService"


import { useItineraryNotifications } from "../hooks/useItineraryNotifications";

import "../styles/itinerary.css";
import "../styles/tripDashboard.css"

interface Activity {
  id: number;
  time: string;
  title: string;
  location: string;
  type: "activity" | "food" | "transport" | "hotel";
  cost: number;
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
  budget: number;
  description: string;
  image?: string;
  photoAttribute?: string;
}


function getActivityType(title: string): Activity["type"] {
  const value = title.toLowerCase();

  if (
    value.includes("dinner") ||
    value.includes("lunch") ||
    value.includes("breakfast") ||
    value.includes("restaurant") ||
    value.includes("food")
  ) {
    return "food";
  }

  if (
    value.includes("airport") ||
    value.includes("train") ||
    value.includes("flight") ||
    value.includes("bus") ||
    value.includes("transport")
  ) {
    return "transport";
  }

  if (
    value.includes("hotel") ||
    value.includes("check in") ||
    value.includes("check-in") ||
    value.includes("stay")
  ) {
    return "hotel";
  }

  return "activity";
}

function getDayTitle(dayNumber: number, activities: Activity[]) {
  if (activities.length === 0) {
    return `Day ${dayNumber}`;
  }

  return activities[0].title;
}

interface ItineraryProps {
  trip: Trip;
  onExpenseAdded: (expense: ApiExpense) => void;
}

function Itinerary({ trip, onExpenseAdded }: ItineraryProps) {
  const [days, setDays] = useState<Day[]>([]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [activityToDelete, setActivityToDelete] = useState<Activity | null>( null,);

  const [loading, setLoading] = useState(true);

  const [notificationSettings, ] = useState({
    thirtyMinutes: true,
    tenMinutes: true,
    atStart: true,
  });
  
  const [error, setError] = useState("");

  const handleActivityAdded = (
    newActivity: ApiActivity
  ) => {
    const formattedActivity: Activity = {
      id: newActivity.id,
      time: newActivity.time || "",
      title: newActivity.title || "",
      location: newActivity.location || "",
      cost: Number(newActivity.cost) || 0,
      type: getActivityType(newActivity.title || ""),
    };

    setDays((currentDays) =>
      currentDays.map((day) => {
        if (
          day.date !==
          newActivity.date?.split("T")[0]
        ) {
          return day;
        }

        const updatedActivities = [
          ...day.activities,
          formattedActivity,
        ].sort((a, b) =>
          a.time.localeCompare(b.time)
        );

        return {
          ...day,
          title: getDayTitle(
            day.id,
            updatedActivities
          ),
          activities: updatedActivities,
        };
      })
    );
  };

  useEffect(() => {
    async function loadActivities() {
      if (
        !Number.isInteger(Number(trip.id)) ||
        Number(trip.id) <= 0
      ) {
        setError("Invalid trip ID.");
        setLoading(false);
        return;
      }

      if (!trip.startDate || !trip.endDate) {
        setError("This trip does not have valid start and end dates.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getActivitiesByTripId(Number(trip.id));

        const activities = response.data;

        const groupedDays: Day[] = [];

        const start = new Date(trip.startDate);
        const end = new Date(trip.endDate);

        let dayNumber = 1;
        const current = new Date(start);

        while (current <= end) {
          const dateString = current.toISOString().split("T")[0];

          const dayActivities = activities
            .filter((activity) => {
              if (!activity.date) return false;

              return activity.date.startsWith(dateString);
            })
            .map((activity) => ({
              id: activity.id,
              time: activity.time || "",
              title: activity.title || "",
              location: activity.location || "",
              cost: activity.cost || 0,
              type: getActivityType(activity.title || ""),
            }))
            .sort((a, b) => a.time.localeCompare(b.time));

          groupedDays.push({
            id: dayNumber,
            date: dateString,
            title: getDayTitle(dayNumber, dayActivities),
            activities: dayActivities,
          });

          current.setDate(current.getDate() + 1);
          dayNumber++;
        }

        setDays(groupedDays);

        if (groupedDays.length > 0) {
          setSelectedDay(groupedDays[0].id);
        }
      } catch (error) {
        console.error("Error loading activities:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load itinerary",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadActivities();
  }, [trip.id, trip.startDate, trip.endDate]);

      const currentDay = days.find((day) => day.id === selectedDay);

  const formatDate = (dateString: string) => {
    if (!dateString) {
      return "Date not set";
    }

    const normalisedDate = dateString.replace(/\//g, "-");
    const [year, month, day] = normalisedDate.split("-").map(Number);

    if (!year || !month || !day) {
      return "Date not set";
    }

    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
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

  const deleteActivity = async () => {
    if (!activityToDelete) return;

    try {
      await deleteActivityApi(activityToDelete.id);

      setDays((currentDays) =>
        currentDays.map((day) => ({
          ...day,
          activities: day.activities.filter(
            (activity) => activity.id !== activityToDelete.id,
          ),
        })),
      );

      setActivityToDelete(null);
    } catch (error) {
      console.error("Error deleting activity:", error);

      alert(
        error instanceof Error ? error.message : "Failed to delete activity",
      );
    }
  };

  const notificationActivities = days.flatMap((day) =>
    day.activities.map((activity) => ({
      id: activity.id,
      title: activity.title,
      date: day.date,
      time: activity.time,
    })),
  );

  useItineraryNotifications(
    notificationActivities,
    notificationSettings,
  );

return (
    <main className="itinerary-page">
      <section className="itinerary-container">
        <div className="itinerary-layout">
          {/* DAY NAVIGATION */}

          <aside className="day-navigation">
            <span className="day-navigation-label">Itinerary</span>

            <div className="day-list">
              {days.map((day) => (
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
            {loading && (
              <p className="itinerary-status">Loading your itinerary...</p>
            )}

            {error && (
              <p className="itinerary-status itinerary-error">{error}</p>
            )}

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

                        <ItineraryClock
                            date={currentDay.date}
                            time={activity.time}
                        />
                      </div>
                    </article>
                  ))}
                </div>

                {/* ADD ACTIVITY */}
                <AddActivity
                  tripId={Number(trip?.id)}
                  date={currentDay.date}
                  onActivityAdded={handleActivityAdded}
                  onExpenseAdded={onExpenseAdded}
                />
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
