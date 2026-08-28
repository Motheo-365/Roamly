import { useEffect, useState } from "react";

interface ItineraryClockProps {
  date: string;
  time: string;
}

function getTimeDifference(target: Date, now: Date) {
  const difference = target.getTime() - now.getTime();

  if (difference <= 0) {
    return {
      passed: true,
      text: "Passed",
    };
  }

  const totalMinutes = Math.floor(difference / (1000 * 60));

  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  /*
   * Approximate months/weeks for countdown purposes.
   * We don't need these to be calendar-perfect because
   * this is only used for displaying a relative countdown.
   */
  const months = Math.floor(days / 30);

  const weeks = Math.floor(days / 7);

  // More than a month away
  if (months >= 1) {
    return {
      passed: false,
      text: `${months} ${months === 1 ? "month" : "months"} away`,
    };
  }

  // More than a week away
  if (weeks >= 1) {
    return {
      passed: false,
      text: `${weeks} ${weeks === 1 ? "week" : "weeks"} away`,
    };
  }

  // Less than a week but at least a day away
  if (days >= 1) {
    return {
      passed: false,
      text: `${days} ${days === 1 ? "day" : "days"} ${hours} ${
        hours === 1 ? "hour" : "hours"
      } away`,
    };
  }

  // Less than a day away
  if (hours >= 1) {
    return {
      passed: false,
      text: `${hours} ${hours === 1 ? "hour" : "hours"} ${minutes} ${
        minutes === 1 ? "minute" : "minutes"
      } away`,
    };
  }

  return {
    passed: false,
    text: `${minutes} ${minutes === 1 ? "minute" : "minutes"} away`,
  };
}

function ItineraryClock({ date, time }: ItineraryClockProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (!date || !time) {
    return null;
  }

  /*
   * The API gives us:
   *
   * date = "2026-09-15"
   * time = "14:30"
   *
   * Combine them into one local Date.
   */
  const target = new Date(`${date}T${time}`);

  if (Number.isNaN(target.getTime())) {
    return null;
  }

  const countdown = getTimeDifference(target, now);

  return (
    <span
      className={
        countdown.passed
          ? "itinerary-clock passed"
          : "itinerary-clock"
      }
    >
      {countdown.text}
    </span>
  );
}

export default ItineraryClock;