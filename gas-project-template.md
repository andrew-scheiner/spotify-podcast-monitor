# Creating a new project from this template

Use this guide when you want to copy this repository into a new Google Apps Script project.

## Prerequisites

- PowerShell
- Node.js and npm
- CLASP installed and authenticated if you plan to pull from or push to an Apps Script project
- A destination folder for the new project

## Create a new project

From the template folder, run:

```powershell
cd "C:\Users\andre\Dev\Templates\gas-project-template"
.\scripts\create-gas-project.ps1 -ProjectName "My Project" -DestinationPath "C:\Users\andre\Dev\Projects\Business" -ScriptId "<SCRIPT_ID>"
```

### Parameters

- `ProjectName`: the name of the new folder that will be created
- `DestinationPath`: the parent folder where the project should be created
- `ScriptId`: optional. If provided, the script attempts to pull the corresponding Apps Script project into the new folder

## What the script does

- copies the template contents into a new folder, excluding `.git`, `node_modules`, and `scripts`
- writes a project-specific README for the new project
- creates `.clasp.json` for CLASP
- optionally pulls the remote Apps Script project into the new folder
- restores the template so it remains ready for future use

## After the project is created

1. Open the new project folder.
2. Install dependencies with `npm install`.
3. If needed, authenticate CLASP with `npx clasp login`.
4. Review the generated files, especially `src/`, `appsscript.json`, and `.clasp.json`.
5. Make sure `appsscript.json` stays in the project root, not inside `src/`.
6. Save `appsscript.json` as plain UTF-8 without a BOM so CLASP can parse it correctly.
7. Initialize Git and push to GitHub when you are ready.

## CLASP and file layout notes

- Keep Apps Script source files in the local `src` folder.
- The manifest file must stay in the project root and must not be duplicated under `src/`.
- Save `appsscript.json` without a UTF-8 BOM; some editors can add one automatically, which CLASP rejects as an invalid manifest.
- If CLASP reports a manifest conflict or missing file, confirm that the project layout matches the generated `.clasp.json` and that the root manifest is valid JSON.
- If you change the manifest after the initial pull, review the overwrite prompt when pushing.

## Notes

- `node_modules` is not part of the template and is not copied into new projects.
- The `scripts` directory is used only for template automation and is not copied into new projects.
