/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Morgen API Key - API key from the Developers API page at platform.morgen.so. Requires a Morgen plan with API access. */
  "morgenApiKey": string,
  /** Calendar Scope - Optional exact calendar name. When set, only matching calendars are available to commands and AI tools. Leave empty to use all calendars. */
  "calendarName"?: string,
  /** Scoped Calendar Display Name - Optional display label for a scoped calendar. Does not rename the calendar in Morgen. Requires Calendar Scope. */
  "calendarAlias"?: string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `list-today-events` command */
  export type ListTodayEvents = ExtensionPreferences & {}
  /** Preferences accessible in the `create-event` command */
  export type CreateEvent = ExtensionPreferences & {}
  /** Preferences accessible in the `search-events` command */
  export type SearchEvents = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `list-today-events` command */
  export type ListTodayEvents = {}
  /** Arguments passed to the `create-event` command */
  export type CreateEvent = {}
  /** Arguments passed to the `search-events` command */
  export type SearchEvents = {}
}

