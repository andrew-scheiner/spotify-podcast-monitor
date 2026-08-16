# Spotify Podcast Monitor

A Google Apps Script project for monitoring podcast episodes and sending updates from a Google Sheet.

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