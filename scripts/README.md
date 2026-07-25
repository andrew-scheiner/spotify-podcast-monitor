# Template Automation Scripts

## create-gas-project.ps1

Creates a new Google Apps Script project from this template.

Usage:

```powershell
cd "C:\Users\andre\Dev\Templates\gas-project-template"
.\scripts\create-gas-project.ps1 -ProjectName "Import Invoice Hours" -DestinationPath "C:\Users\andre\Dev\Projects\Business" -ScriptId "<SCRIPT_ID>"
```

Parameters:

- `ProjectName`: name of the new project folder
- `DestinationPath`: parent folder for the new project
- `ScriptId`: optional Apps Script project ID to pull into the new project

This script:

- copies the template into the new project folder (excluding template-only assets like `gas-project-template.md`)
- creates a valid `.clasp.json` rooted at `src`
- updates `.clasp.json` with the provided script ID
- pulls the Apps Script project if an ID is provided
- moves any pulled `.js` Apps Script function files into `src` and renames them to `.gs`, leaving no root-level duplicates
- restores the template back to vanilla

## restore-gas-template.ps1

Restores the template repository to its vanilla starter state.
Use this if the template becomes contaminated with prototype-specific code.
