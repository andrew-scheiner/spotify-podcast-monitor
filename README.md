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
- move any pulled Apps Script source files into `src/` and rename them to `.gs` so they appear in VS Code
- restore the template back to vanilla after project creation

Library alias autocomplete is driven by `src/LibraryGlobals.d.ts`. Keep it aligned with
`appsscript.json > dependencies > libraries > userSymbol` values.

## After creation

1. `cd` into the new project folder
2. run `npm install`
3. verify files and project-specific settings
4. if you provided a Script ID, confirm CLASP pulled the cloud project files into `src/` as `.gs` files
5. if you need to sync later, run `npx --no-install clasp pull` and ensure the pulled files are placed in `src/`
6. initialize Git and push to GitHub

## Notes

- `node_modules` is not part of the template and is excluded from new copies
- `scripts` is used only for template automation and is not copied into new projects
