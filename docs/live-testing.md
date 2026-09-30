# Live validation — 2026-09-30

Tested the development extension in Raycast on macOS using a single user-approved personal calendar. Calendar Scope excluded other calendars from event reads and writes. No attendees were invited. Private addresses, credentials, and calendar/event IDs are omitted from this record.

## Successful checks

- Created “Raycast test — Focus session” through Create Event at 21:00 for one hour in America/Argentina/Cordoba. Raycast displayed “Event created!”; a fresh Today command returned the event.
- Search Events found the focus event by title.
- Raycast AI invoked List Calendars and Find Events and reported the stored start, timezone, duration, and presence of an event ID.
- Raycast AI created “Raycast test — Reading break” at 22:15 for 15 minutes, then used Find Events to read it back. A subsequent Today command displayed both events.
- Scoped Calendar Display Name showed “Personal” while retaining the original calendar identity.
- Captured and visually inspected `metadata/morgen-1.png`, a native Raycast 2000×1250 screenshot with synthetic event titles and a clean background.

## Failure found during screenshot preparation

Later fresh reads returned no UI results. A read-only AI diagnostic reported a fetch failure and Morgen HTTP 429 (rate limit exceeded). The user confirmed the test events had not been removed. These failed reads do not prove the calendar is empty.

The UI had discarded the error flag from its fetch helper and displayed a successful empty state. Both event lists now show “Unable to Load Events” and say availability is unknown on failure. The creation form also retains a visible calendar-loading failure message. Regression tests distinguish failed reads from genuinely empty calendars. No automatic API retry or creation retry was added.

## Remaining checks

- Resume live reads after the rate limit clears and capture Search Events and Create Event screenshots. Only one Store screenshot is complete.
- Verify the new failure UI in Raycast; automated component checks pass.
- Test the manual AI confirmation dialog. The live creation used Raycast Auto tool permissions, so no manual dialog was shown. The confirmation function itself is covered by unit tests.
- Test events in timezones different from the machine timezone and DST boundaries. Current live evidence covers the local timezone only.
- The two test events were not deleted by this workflow.

Local validation after the failure-state fix: 7 tests, TypeScript, Raycast lint, and build passed. Store submission has not been performed.
