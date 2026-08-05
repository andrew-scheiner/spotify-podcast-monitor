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

Library alias autocomplete is driven by `src/LibraryGlobals.d.ts`. Keep it aligned with
`appsscript.json > dependencies > libraries > userSymbol` values.

## After creation

1. `cd` into the new project folder
2. run `npm install`
3. verify files and project-specific settings
4. initialize Git and push to GitHub

## Notes

- `node_modules` is not part of the template and is excluded from new copies
- The PowerShell scripts `scripts/create-gas-project.ps1` and `scripts/restore-gas-template.ps1` are template-maintained automation files. They are not required in newly created projects and should remain in the template repository rather than being copied into project folders