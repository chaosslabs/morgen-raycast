import { showToast, Toast } from "@raycast/api";
import { listCalendars, listEvents, MorgenCalendar, MorgenEvent } from "./api";

export type EventWithCalendar = MorgenEvent & { calendarName: string };

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  const dateStr = date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
  const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${dateStr} ${timeStr}`;
}

export function computeDuration(start: string, end?: string): string {
  if (!end) return "";
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const minutes = Math.round(ms / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining > 0 ? `${hours}h ${remaining}m` : `${hours}h`;
}

export function getConferenceUrl(event: MorgenEvent): string | undefined {
  return event["morgen.so:derived"]?.virtualRoom?.url ?? event["google.com:hangoutLink"];
}

export function getLocation(event: MorgenEvent): string | undefined {
  if (!event.locations) return undefined;
  const first = Object.values(event.locations)[0];
  return first?.name || undefined;
}

export async function fetchEventsForRange(start: string, end: string): Promise<EventWithCalendar[]> {
  const calendars = await listCalendars();
  if (calendars.length === 0) return [];

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

  const allEvents: EventWithCalendar[] = [];
  for (const [accountId, cals] of grouped) {
    const calendarIds = cals.map((c) => c.calendarId);
    const evts = await listEvents(accountId, calendarIds, start, end);
    for (const evt of evts) {
      const cal = calendarMap.get(evt.calendarId);
      allEvents.push({ ...evt, calendarName: cal?.name ?? "Unknown" });
    }
  }

  allEvents.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  return allEvents;
}

export async function fetchEventsWithErrorHandling(
  start: string,
  end: string,
): Promise<{ events: EventWithCalendar[]; error: boolean }> {
  try {
    const events = await fetchEventsForRange(start, end);
    return { events, error: false };
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to load events",
      message: String(error),
    });
    return { events: [], error: true };
  }
}
