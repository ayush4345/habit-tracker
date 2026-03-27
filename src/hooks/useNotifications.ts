"use client";

import { useState, useEffect, useCallback } from "react";

export interface ReminderSettings {
  enabled: boolean;
  time: string; // HH:mm format
}

const STORAGE_KEY = "habit-tracker-reminder-settings";

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [settings, setSettings] = useState<ReminderSettings>({
    enabled: false,
    time: "09:00",
  });

  // Load settings and permission status on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setPermission(Notification.permission);
      
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setSettings(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse reminder settings", e);
        }
      }
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      console.warn("This browser does not support desktop notification");
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result === "granted";
  }, []);

  const updateSettings = useCallback((newSettings: Partial<ReminderSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (Notification.permission === "granted") {
      return new Notification(title, options);
    }
    return null;
  }, []);

  return {
    permission,
    settings,
    requestPermission,
    updateSettings,
    sendNotification,
  };
}
