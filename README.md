# Google Apps Script Project Template

A reusable starter for Google Apps Script projects using CLASP and VS Code.

## Create a new project

From the template folder, run:

```powershell
cd "C:\Users\andre\Dev\Templates\gas-project-template"
.\scripts\create-gas-project.ps1 -ProjectName "My Project" -DestinationPath "C:\Users\andre\Dev\Projects\Business" -ScriptId "<SCRIPT_ID>"
```

The script will:

- copy the vanilla template into the new project folder
- update `.clasp.json` with the provided Apps Script project ID
- optionally pull the Apps Script project into the new folder
- restore the template back to vanilla after project creation

If you do not have an existing Apps Script project ID, omit the `-ScriptId` parameter to create a new empty project folder from the template.

## After creation

1. `cd` into the new project folder
2. run `npm install`
3. verify files and project-specific settings
4. initialize Git and push to GitHub as needed

## Prerequisites

- Node.js and `npx` installed
- CLASP installed and authenticated if you want to pull an existing Apps Script project:

```powershell
npx clasp login
```

## Notes

- `node_modules` is not part of the template and is excluded from new copies
- `scripts` is used only for template automation and is not copied into new projects
- The template is restored to its vanilla starter state after each new project is created
