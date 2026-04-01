import { ActionPanel, Action, List, showToast, Toast, Icon } from "@raycast/api";
import { useEffect, useState } from "react";
import { listCalendars, listEvents, MorgenCalendar, MorgenEvent } from "./api";

function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  const dateStr = date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
  const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${dateStr} ${timeStr}`;
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

export default function SearchEvents() {
  const [allEvents, setAllEvents] = useState<(MorgenEvent & { calendarName: string })[]>([]);
  const [searchText, setSearchText] = useState("");
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
        const start = now.toISOString();
        const end30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        const end = end30.toISOString();

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

        const all: (MorgenEvent & { calendarName: string })[] = [];
        for (const [accountId, cals] of grouped) {
          const calendarIds = cals.map((c) => c.calendarId);
          const evts = await listEvents(accountId, calendarIds, start, end);
          for (const evt of evts) {
            const cal = calendarMap.get(evt.calendarId);
            all.push({ ...evt, calendarName: cal?.name ?? "Unknown" });
          }
        }

        all.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
        setAllEvents(all);
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

  const filtered = searchText
    ? allEvents.filter((e) => e.title?.toLowerCase().includes(searchText.toLowerCase()))
    : allEvents;

  return (
    <List
      isLoading={isLoading}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search events in the next 30 days..."
      throttle
    >
      {filtered.length === 0 && !isLoading ? (
        <List.EmptyView
          icon={Icon.MagnifyingGlass}
          title="No Events Found"
          description={searchText ? "Try a different search term" : "No upcoming events in the next 30 days"}
        />
      ) : (
        filtered.map((event, index) => {
          const datetime = event.showWithoutTime ? "All day" : formatDateTime(event.start);
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
              subtitle={datetime}
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
