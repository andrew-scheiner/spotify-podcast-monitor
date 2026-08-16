# Spotify Podcast Monitor

This repository contains the Google Apps Script source for a Google Sheets-based podcast monitoring workflow. The script checks a list of podcast shows, finds newly published episodes, and sends email updates to configured listeners.

## What it does

- Reads podcast data from the `Podcasts` sheet
- Looks up new episodes from Spotify show IDs
- Stores the latest checked episode date
- Sends notifications to listeners based on the `Listener` column
- Adds a custom menu in Google Sheets for manual actions
- Runs the main check function automatically on early Sunday morning via a time-driven trigger

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

## Usage

1. Open the bound Google Sheet.
2. Use the custom menu to run the check manually or reset the last run date.
3. Optionally set a time-driven trigger for recurring checks.

## Notes

- The project uses the Apps Script libraries configured in `appsscript.json`.
- A weekly trigger is intended for automatic episode checks.
