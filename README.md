# Google Apps Script Project Template

This repository is a reusable starter for Google Apps Script projects. It provides a consistent local structure for building Apps Script solutions in VS Code, using CLASP for synchronization and a PowerShell helper to scaffold a new project from the template.

## What the template includes

- [src](src): the local Apps Script source folder for project code
- [appsscript.json](appsscript.json): the Apps Script manifest for the project
- [scripts/create-gas-project.ps1](scripts/create-gas-project.ps1): creates a new project from the template
- [scripts/restore-gas-template.ps1](scripts/restore-gas-template.ps1): restores the template after a new project is created

## How it works

The scaffold script copies the template into a new folder, prepares project-specific files, creates a CLASP configuration, optionally pulls an existing Apps Script project by script ID, and then restores the template so it remains reusable for future projects.

The scaffold script also runs `npm install` automatically so the project is ready to use immediately. When you edit `appsscript.json`, keep it at the project root and save it as UTF-8 without a BOM so CLASP can parse it correctly.

## When to use it

Use this template when you want a repeatable starting point for Apps Script projects that will be developed locally, managed with CLASP, and published to GitHub.

See [gas-project-template.md](gas-project-template.md) for the detailed instructions for creating a new project from this template.
