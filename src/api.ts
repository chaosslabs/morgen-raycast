import { getPreferenceValues, showToast, Toast } from "@raycast/api";

const BASE_URL = "https://api.morgen.so/v3";

interface Preferences {
  morgenApiKey: string;
}

export async function morgenFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const { morgenApiKey } = getPreferenceValues<Preferences>();

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `ApiKey ${morgenApiKey}`,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    const message = `Morgen API error (${response.status}): ${body}`;
    await showToast({ style: Toast.Style.Failure, title: "API Error", message });
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export interface MorgenCalendar {
  accountId: string;
  calendarId: string;
  name: string;
  color?: string;
  readOnly?: boolean;
}

export interface MorgenEvent {
  id?: string;
  title: string;
  start: string;
  end?: string;
  duration?: string;
  calendarId: string;
  accountId: string;
  calendarName?: string;
  showWithoutTime?: boolean;
}

interface CalendarsResponse {
  data: MorgenCalendar[];
}

interface EventsResponse {
  data: MorgenEvent[];
}

export async function listCalendars(): Promise<MorgenCalendar[]> {
  const result = await morgenFetch<CalendarsResponse>("/calendars/list");
  return result.data ?? [];
}

export async function listEvents(
  accountId: string,
  calendarIds: string[],
  start: string,
  end: string,
): Promise<MorgenEvent[]> {
  const params = new URLSearchParams({
    accountId,
    calendarIds: calendarIds.join(","),
    start,
    end,
  });
  const result = await morgenFetch<EventsResponse>(`/events/list?${params.toString()}`);
  return result.data ?? [];
}

export interface CreateEventPayload {
  accountId: string;
  calendarId: string;
  title: string;
  start: string;
  duration: string;
  timeZone: string;
  showWithoutTime: false;
}

export async function createEvent(payload: CreateEventPayload): Promise<MorgenEvent> {
  const result = await morgenFetch<{ data: MorgenEvent }>("/events/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return result.data;
}
