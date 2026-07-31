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

- copies the template contents into a new folder, excluding `.git`, `node_modules`, `scripts`, and `gas-project-template.md`
- writes a project-specific README for the new project
- creates `.clasp.json` for CLASP
- optionally pulls the remote Apps Script project into the new folder
- restores the template so it remains ready for future use

## After the project is created

1. Open the new project folder.
2. Open the new project in VS Code.
3. Review the pulled Apps Script source files next.
4. Authenticate CLASP once with `npx clasp login` if you have not already done so.
5. Review the generated files, especially `src/`, `appsscript.json`, and `.clasp.json`.
6. Make sure `appsscript.json` stays in the project root, not inside `src/`.
7. Save `appsscript.json` as plain UTF-8 without a BOM so CLASP can parse it correctly.
8. Initialize Git, create a GitHub remote, and push the project when you are ready. For example: `gh repo create <repo-name> --private --source . --remote origin --push`.

## CLASP and file layout notes

- Keep Apps Script source files in the local `src` folder.
- The manifest file must stay in the project root and must not be duplicated under `src/`.
- Save `appsscript.json` without a UTF-8 BOM; some editors can add one automatically, which CLASP rejects as an invalid manifest.
- The scaffold script installs dependencies automatically, so the created project is ready for `npx --no-install clasp pull` and `npx --no-install clasp push`.
- If CLASP reports a manifest conflict or missing file, confirm that the project layout matches the generated `.clasp.json` and that the root manifest is valid JSON.
- If you change the manifest after the initial pull, review the overwrite prompt when pushing.

## Notes

- `node_modules` is not part of the template and is not copied into new projects.
- The `scripts` directory is used only for template automation and is not copied into new projects.
- `gas-project-template.md` is template-only process documentation and is excluded from production project copies.

## Date handling guidance for new projects

- When writing dates to Google Sheets, keep values as real Date objects whenever possible rather than converting them to strings too early.
- Prefer shared GAS library date helpers or equivalent normalization logic so dates are written consistently across time zones.
- If you need to write a date to a sheet, normalize it to a local calendar date and write it as a Date value to avoid timezone-related day shifts.
