import { useEffect } from "react";

import {
  requestNotificationPermission,
  sendNotification,
  hasNotificationBeenSent,
  markNotificationAsSent,
} from "../services/notificationService";

interface NotificationActivity {
  id: number;
  title: string;
  date: string;
  time: string;
}

interface NotificationSettings {
  thirtyMinutes: boolean;
  tenMinutes: boolean;
  atStart: boolean;
}

export function useItineraryNotifications(
  activities: NotificationActivity[],
  settings: NotificationSettings,
) {
  useEffect(() => {
    if (activities.length === 0) {
      return;
    }

    let interval: ReturnType<typeof setInterval> | undefined;

    async function setup() {
      const permission =
        await requestNotificationPermission();

      if (permission !== "granted") {
        return;
      }

      const checkActivities = async () => {
        const now = new Date();

        for (const activity of activities) {
          if (!activity.date || !activity.time) {
            continue;
          }

          const activityTime = new Date(
            `${activity.date}T${activity.time}`,
          );

          if (Number.isNaN(activityTime.getTime())) {
            continue;
          }

          const difference =
            activityTime.getTime() - now.getTime();

          const minutesUntil =
            difference / (1000 * 60);

          /*
           * 30 MINUTES BEFORE
           */
          if (
            settings.thirtyMinutes &&
            minutesUntil > 29 &&
            minutesUntil <= 30 &&
            !hasNotificationBeenSent(
              activity.id,
              "30-min",
            )
          ) {
            const sent = await sendNotification(
              "Upcoming activity",
              `${activity.title} starts in 30 minutes.`,
            );

            if (sent) {
              markNotificationAsSent(
                activity.id,
                "30-min",
              );
            }
          }

          /*
           * 10 MINUTES BEFORE
           */
          if (
            settings.tenMinutes &&
            minutesUntil > 9 &&
            minutesUntil <= 10 &&
            !hasNotificationBeenSent(
              activity.id,
              "10-min",
            )
          ) {
            const sent = await sendNotification(
              "Upcoming activity",
              `${activity.title} starts in 10 minutes.`,
            );

            if (sent) {
              markNotificationAsSent(
                activity.id,
                "10-min",
              );
            }
          }

          /*
           * WHEN ACTIVITY STARTS
           */
          if (
            settings.atStart &&
            minutesUntil >= 0 &&
            minutesUntil < 1 &&
            !hasNotificationBeenSent(
              activity.id,
              "start",
            )
          ) {
            const sent = await sendNotification(
              "It's time!",
              `${activity.title} starts now.`,
            );

            if (sent) {
              markNotificationAsSent(
                activity.id,
                "start",
              );
            }
          }
        }
      };

      await checkActivities();

      interval = setInterval(
        checkActivities,
        60 * 1000,
      );
    }

    void setup();

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [activities, settings]);
}

