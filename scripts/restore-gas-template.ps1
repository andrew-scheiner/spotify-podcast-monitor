function Get-TemplateRoot {
    return Resolve-Path -Path (Join-Path $PSScriptRoot '..') | Select-Object -ExpandProperty Path
}

$TemplateRoot = Get-TemplateRoot

$files = @{
    '.\.clasp.json' = @'
{
  "scriptId": "ENTER_SCRIPT_ID_HERE",
  "rootDir": "",
  "scriptExtensions": [".js", ".gs"],
  "htmlExtensions": [".html"],
  "jsonExtensions": [".json"],
  "filePushOrder": [],
  "skipSubdirectories": false
}
'@;
    '.\appsscript.json' = @'
{
  "timeZone": "Etc/UTC",
  "exceptionLogging": "STACKDRIVER",
    "runtimeVersion": "V8",
    "dependencies": {
        "libraries": [
            {
                "userSymbol": "GASLibrary",
                "libraryId": "124dIgQdSYpMXAf9J0vFewzyHG0PopddN50UQLw0d1wOZz89rZLEpkMAE",
                "developmentMode": true
            },
            {
                "userSymbol": "GASConfigLibrary",
                "libraryId": "19mt3oek1jSRRq97idSa9vzDuYtO8o7NYAxH-3cIVwj24I_02l5CAgHY4",
                "developmentMode": true
            }
        ]
    }
}
'@;
    '.\README.md' = @'
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
- `scripts` is used only for template automation and is not copied into new projects
'@;
    '.\src\Config.gs' = @'
// Vanilla template configuration file.
// Add shared constants and configuration values here.

const SS = SpreadsheetApp.getActiveSpreadsheet();

const TEMPLATE_NOTE = 'This is a vanilla GAS template. Replace with your project config.';
'@;
    '.\src\Main.gs' = @'
/**
 * Vanilla Google Apps Script template entry point.
 * Replace or extend this file with your project's functions.
 */
function onOpen(e) {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('Template')
        .addItem('Say Hello', 'sayHello')
        .addToUi();
}

function sayHello() {
    SpreadsheetApp.getUi().alert('Hello from the GAS template!');
}
'@;
    '.\src\SheetUtilities.gs' = @'
// Placeholder sheet utility functions.

function resetFilter() {
    // Add reset filter logic here.
}

function sortActiveSheet() {
    // Add sheet sorting logic here.
}
'@;
    '.\src\Triggers.gs' = @'
function onEdit(e) {
    // Placeholder onEdit trigger logic.
    // e.range, e.value, and other event data are available here.
}
'@;
    '.\src\LibraryGlobals.d.ts' = @'
/**
 * Ambient declarations for Apps Script library aliases used by this project.
 *
 * Keep this file in sync with appsscript.json dependencies.libraries[].userSymbol.
 * These declarations are editor-only and do not affect runtime behavior.
 */

declare const GASLibrary: any;
declare const GASConfigLibrary: any;
'@;
}

foreach ($entry in $files.GetEnumerator()) {
    $targetPath = Join-Path $TemplateRoot $entry.Key
    $content = $entry.Value.TrimStart("`r","`n")
    Set-Content -Path $targetPath -Value $content -Encoding utf8
}

Remove-Item -LiteralPath (Join-Path $TemplateRoot 'node_modules') -Recurse -Force -ErrorAction SilentlyContinue
Get-ChildItem -LiteralPath (Join-Path $TemplateRoot 'src') -File -Filter '*.js' -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue

Write-Host 'Template restore complete.' -ForegroundColor Green
