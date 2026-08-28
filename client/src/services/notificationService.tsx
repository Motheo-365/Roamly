// services/notificationService.ts

const STORAGE_KEY = "roamly-notifications";

interface SentNotification {
  activityId: number;
  type: "30-min" | "10-min" | "start";
}

function getSentNotifications(): SentNotification[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    return JSON.parse(stored) as SentNotification[];
  } catch {
    return [];
  }
}

function saveSentNotifications(notifications: SentNotification[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
}

export function hasNotificationBeenSent(
  activityId: number,
  type: SentNotification["type"],
): boolean {
  const notifications = getSentNotifications();

  return notifications.some(
    (notification) =>
      notification.activityId === activityId && notification.type === type,
  );
}

export function markNotificationAsSent(
  activityId: number,
  type: SentNotification["type"],
) {
  const notifications = getSentNotifications();

  notifications.push({
    activityId,
    type,
  });

  saveSentNotifications(notifications);
}

export function notificationsSupported(): boolean {
  return "Notification" in window;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!notificationsSupported()) {
    return "denied";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  return await Notification.requestPermission();
}

export async function sendNotification(
  title: string,
  body: string,
): Promise<boolean> {
  if (!notificationsSupported()) {
    return false;
  }

  if (Notification.permission !== "granted") {
    return false;
  }

  new Notification(title, {
    body,
    icon: "/favicon.ico",
  });

  return true;
}
