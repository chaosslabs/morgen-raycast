import { ActionPanel, Action, Icon } from "@raycast/api";
import { EventWithCalendar } from "./utils";

export function EventActions({ event }: { event: EventWithCalendar }) {
  return (
    <ActionPanel>
      <Action.Open title="Open in Morgen" icon={Icon.Calendar} target="morgen://" />
      {event.conferenceUrl && (
        <Action.OpenInBrowser title="Join Meeting" icon={Icon.Video} url={event.conferenceUrl} />
      )}
      {event.location && <Action.OpenInBrowser title="Search Location" url={`https://maps.google.com/maps?q=${encodeURIComponent(event.location)}`} icon={Icon.Pin} />}
      <Action.OpenInBrowser title="Open in Browser" url="https://platform.morgen.so" />
      <Action.CopyToClipboard title="Copy Event Title" content={event.title} />
      {event.location && <Action.CopyToClipboard title="Copy Location" content={event.location} shortcut={{ modifiers: ["cmd", "shift"], key: "l" }} />}
      {event.conferenceUrl && <Action.CopyToClipboard title="Copy Meeting Link" content={event.conferenceUrl} shortcut={{ modifiers: ["cmd", "shift"], key: "m" }} />}
    </ActionPanel>
  );
}
