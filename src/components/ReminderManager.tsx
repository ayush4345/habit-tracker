"use client";

import { useEffect, useRef } from "react";
import { useNotifications } from "@/hooks/useNotifications";

export default function ReminderManager() {
  const { settings, permission, sendNotification } = useNotifications();
  const lastReminderDate = useRef<string | null>(null);

  useEffect(() => {
    if (!settings.enabled || permission !== "granted") return;

    const checkTime = () => {
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, "0");
      const currentMinutes = now.getMinutes().toString().padStart(2, "0");
      const currentTimeString = `${currentHours}:${currentMinutes}`;
      const todayDate = now.toDateString();

      if (currentTimeString === settings.time && lastReminderDate.current !== todayDate) {
        sendNotification("Habit Reminder!", {
          body: "Don't forget to check in your habits for today!",
          icon: "/favicon.ico",
        });
        lastReminderDate.current = todayDate;
      }
    };

    // Check every minute
    const interval = setInterval(checkTime, 60000);
    // Also check immediately
    checkTime();

    return () => clearInterval(interval);
  }, [settings, permission, sendNotification]);

  return null; // Background component
}
