# Spotify Podcast Monitor

A Google Apps Script project bound to a Google Sheet which monitors podcast channels and emails notifications of new episodes to specified recipients.

## Project structure

- `src/Main.gs` - main workflow, menu actions, and episode checks
- `src/Config.gs` - listener emails and sorting configuration
- `src/Sources.gs` - helper functions for data sources
- `src/Triggers.gs` - `onOpen` and `onEdit` handlers
- `appsscript.json` - Apps Script project configuration

## Requirements

- A Google Apps Script project
- Node.js and `clasp`
- A Google Sheet with the required columns:
  - `Spotify Show ID`
  - `Podcast Name`
  - `Last Episode Date`
  - `Listener`
  - `Status` (use `Active`, `Ignore`, or `Stopped`)

## Development

```bash
npm install
clasp pull
clasp push
```

Library alias autocomplete is driven by `src/LibraryGlobals.d.ts`. Keep it aligned with
`appsscript.json > dependencies > libraries > userSymbol` values.

## Sources
The original code was sourced from: Code source	https://chatgpt.com/c/689e19e8-2600-8321-b691-9095567927c3
The API was sourced from: https://developer.spotify.com/dashboard/564b24576a534223a639ccd9372d294a