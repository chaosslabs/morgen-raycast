# Morgen for Raycast

Interact with your [Morgen](https://morgen.so) calendars directly from Raycast. View today's schedule, search upcoming events, and create new events without leaving your workflow.

## Commands

### List Today's Events

View all calendar events scheduled for today. Events are sorted by start time and show duration and calendar name. Supports multiple calendar accounts.

### Search Events

Search through your upcoming events for the next 30 days. Filter results in real time by typing in the search bar.

### Create Event

Create a new calendar event with a title, date, start time, duration, and calendar selection. Read-only calendars are automatically filtered out. Your timezone is detected automatically.

## Setup

1. Install this extension from the Raycast Store.
2. Get your Morgen API key from [morgen.so](https://morgen.so) (Settings > Integrations > API Keys).
3. When prompted, enter your API key in the extension preferences.

## Development

```bash
# Install dependencies
npm install

# Start development mode
npm run dev

# Lint
npm run lint

# Type-check
npx tsc --noEmit
```
