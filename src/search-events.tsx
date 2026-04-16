import { List, Icon } from "@raycast/api";
import { useEffect, useState } from "react";
import { EventWithCalendar, formatDateTime, computeDuration, fetchEventsWithErrorHandling } from "./utils";
import { EventActions } from "./event-actions";

export default function SearchEvents() {
  const [allEvents, setAllEvents] = useState<EventWithCalendar[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      const now = new Date();
      const end30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      const { events } = await fetchEventsWithErrorHandling(now.toISOString(), end30.toISOString());
      setAllEvents(events);
      setIsLoading(false);
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
            ...(event.conferenceUrl ? [{ icon: Icon.Video }] : []),
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
              actions={<EventActions event={event} />}
            />
          );
        })
      )}
    </List>
  );
}
