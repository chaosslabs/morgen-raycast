import { ActionPanel, Action, List, showToast, Toast, Icon } from "@raycast/api";
import { useEffect, useState } from "react";
import { listCalendars, listEvents, MorgenCalendar, MorgenEvent } from "./api";

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function computeDuration(start: string, end?: string): string {
  if (!end) return "";
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const minutes = Math.round(ms / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining > 0 ? `${hours}h ${remaining}m` : `${hours}h`;
}

export default function ListTodayEvents() {
  const [events, setEvents] = useState<(MorgenEvent & { calendarName: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const calendars = await listCalendars();
        if (calendars.length === 0) {
          setIsLoading(false);
          return;
        }

        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
        const start = startOfDay.toISOString();
        const end = endOfDay.toISOString();

        const calendarMap = new Map<string, MorgenCalendar>();
        for (const cal of calendars) {
          calendarMap.set(cal.calendarId, cal);
        }

        const grouped = new Map<string, MorgenCalendar[]>();
        for (const cal of calendars) {
          const existing = grouped.get(cal.accountId) ?? [];
          existing.push(cal);
          grouped.set(cal.accountId, existing);
        }

        const allEvents: (MorgenEvent & { calendarName: string })[] = [];
        for (const [accountId, cals] of grouped) {
          const calendarIds = cals.map((c) => c.calendarId);
          const evts = await listEvents(accountId, calendarIds, start, end);
          for (const evt of evts) {
            const cal = calendarMap.get(evt.calendarId);
            allEvents.push({ ...evt, calendarName: cal?.name ?? "Unknown" });
          }
        }

        allEvents.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
        setEvents(allEvents);
      } catch (error) {
        await showToast({
          style: Toast.Style.Failure,
          title: "Failed to load events",
          message: String(error),
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchEvents();
  }, []);

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Filter today's events...">
      {events.length === 0 && !isLoading ? (
        <List.EmptyView icon={Icon.Calendar} title="No Events Today" description="Enjoy your free day!" />
      ) : (
        events.map((event, index) => {
          const time = event.showWithoutTime ? "All day" : formatTime(event.start);
          const duration = computeDuration(event.start, event.end);
          const accessories = [
            { text: event.calendarName },
            ...(duration ? [{ text: duration }] : []),
          ];

          return (
            <List.Item
              key={event.id ?? `${index}`}
              icon={Icon.Calendar}
              title={event.title || "(No title)"}
              subtitle={time}
              accessories={accessories}
              actions={
                <ActionPanel>
                  <Action.Open title="Open in Morgen" target="morgen://" />
                  <Action.OpenInBrowser title="Open in Browser" url="https://platform.morgen.so" />
                  <Action.CopyToClipboard title="Copy Event Title" content={event.title} />
                </ActionPanel>
              }
            />
          );
        })
      )}
    </List>
  );
}
