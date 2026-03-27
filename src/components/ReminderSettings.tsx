"use client";

import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";

export default function ReminderSettings() {
  const { permission, settings, requestPermission, updateSettings } = useNotifications();

  const handleToggle = async (enabled: boolean) => {
    if (enabled && permission === "default") {
      const granted = await requestPermission();
      if (!granted) return;
    }
    updateSettings({ enabled });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ time: e.target.value });
  };

  return (
    <div className="flex flex-col gap-4 p-4 border border-border bg-muted/50 mt-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Daily Reminder</h3>
          <p className="text-xs text-muted-foreground">Get a notification to log your habits</p>
        </div>
        <button
          onClick={() => handleToggle(!settings.enabled)}
          className={cn(
            "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
            settings.enabled ? "bg-indigo-600" : "bg-muted"
          )}
        >
          <span
            className={cn(
              "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white dark:bg-zinc-200 shadow ring-0 transition duration-200 ease-in-out",
              settings.enabled ? "translate-x-4" : "translate-x-0"
            )}
          />
        </button>
      </div>

      {settings.enabled && (
        <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-1">
          <div className="flex flex-col gap-1">
            <label htmlFor="reminder-time" className="text-xs font-medium text-muted-foreground">
              Reminder Time
            </label>
            <input
              id="reminder-time"
              type="time"
              value={settings.time}
              onChange={handleTimeChange}
              className="bg-background border border-border px-2 py-1 text-sm focus:border-primary outline-none transition-colors text-foreground"
            />
          </div>
          {permission === "denied" && (
            <p className="text-[10px] text-destructive max-w-[150px]">
              Notifications are blocked by your browser. Please enable them in your settings.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
