/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Morgen API Key - Your Morgen API key from morgen.so */
  "morgenApiKey": string
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

