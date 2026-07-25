param(
    [Parameter(Mandatory = $true)]
    [string]$ProjectName,

    [Parameter(Mandatory = $true)]
    [string]$DestinationPath,

    [string]$ScriptId
)

function Get-TemplateRoot {
    return Resolve-Path -Path (Join-Path $PSScriptRoot '..') | Select-Object -ExpandProperty Path
}

$TemplateRoot = Get-TemplateRoot
$DestinationRoot = Resolve-Path -Path $DestinationPath | Select-Object -ExpandProperty Path
$TargetRoot = Join-Path $DestinationRoot $ProjectName

if (Test-Path $TargetRoot) {
    Write-Error "Target project folder already exists: $TargetRoot"
    exit 1
}

Write-Host "Creating new project: $ProjectName" -ForegroundColor Cyan
Write-Host "Destination: $TargetRoot" -ForegroundColor Cyan

New-Item -Path $TargetRoot -ItemType Directory -Force | Out-Null

$exclude = @('.git', 'node_modules', 'scripts', 'gas-project-template.md')
Get-ChildItem -Force -Path $TemplateRoot | Where-Object { $exclude -notcontains $_.Name } | ForEach-Object {
    $dest = Join-Path $TargetRoot $_.Name
    if ($_.PSIsContainer) {
        Copy-Item -Path $_.FullName -Destination $dest -Recurse -Force
    }
    else {
        Copy-Item -Path $_.FullName -Destination $dest -Force
    }
}

$projectReadme = @"
# $ProjectName

A Google Apps Script project created from the GAS template.

## Getting started
1. Authenticate CLASP once with `npx clasp login` if you have not already done so.
2. Edit the Apps Script files in the `src` folder and deploy when ready

## Project files
- `src/` contains the Apps Script source files
- `appsscript.json` defines the Apps Script project manifest
"@

Set-Content -Path (Join-Path $TargetRoot 'README.md') -Value $projectReadme -Encoding utf8

if (Test-Path (Join-Path $TargetRoot 'scripts')) {
    Remove-Item -LiteralPath (Join-Path $TargetRoot 'scripts') -Recurse -Force -ErrorAction SilentlyContinue
}

$claspFile = Join-Path $TargetRoot '.clasp.json'
$claspConfig = @{
    scriptId           = if ($ScriptId) { $ScriptId } else { 'ENTER_SCRIPT_ID_HERE' }
    rootDir            = ''
    scriptExtensions   = @('.js', '.gs')
    htmlExtensions     = @('.html')
    jsonExtensions     = @('.json')
    filePushOrder      = @()
    skipSubdirectories = $false
}
$claspConfig | ConvertTo-Json -Depth 10 | Set-Content -Path $claspFile -Encoding utf8

Write-Host 'Installing project dependencies...' -ForegroundColor Cyan
Push-Location $TargetRoot
try {
    npm install --no-audit --no-fund
    if ($LASTEXITCODE -ne 0) {
        throw "npm install failed with exit code $LASTEXITCODE"
    }
}
finally {
    Pop-Location
}

if ($ScriptId) {
    Write-Host "Updating .clasp.json with script ID: $ScriptId" -ForegroundColor Yellow

    Write-Host 'Pulling Apps Script project into the new folder...' -ForegroundColor Cyan
    Push-Location $TargetRoot
    try {
        npx --no-install clasp pull
    }
    catch {
        throw 'clasp pull failed. Ensure CLASP is installed and authenticated.'
    }
    Pop-Location
}

New-Item -ItemType Directory -Path (Join-Path $TargetRoot 'src') -Force | Out-Null
$sourceDirectory = Join-Path $TargetRoot 'src'
$pulledScriptFiles = Get-ChildItem -LiteralPath $TargetRoot -Recurse -File -Filter '*.js' | Where-Object { $_.FullName -notmatch '[\\/]node_modules[\\/]' }
foreach ($scriptFile in $pulledScriptFiles) {
    $destinationPath = Join-Path $sourceDirectory ([System.IO.Path]::ChangeExtension($scriptFile.Name, '.gs'))
    if (Test-Path $destinationPath) {
        Remove-Item -LiteralPath $destinationPath -Force -ErrorAction SilentlyContinue
    }
    Move-Item -LiteralPath $scriptFile.FullName -Destination $destinationPath -Force
}

Write-Host "New project created at: $TargetRoot" -ForegroundColor Green
Write-Host 'Restoring template back to vanilla...' -ForegroundColor Cyan
& "$TemplateRoot\scripts\restore-gas-template.ps1"
Write-Host 'Template restored to vanilla.' -ForegroundColor Green
Write-Host "Next steps: cd '$TargetRoot', verify project files, initialize Git, and push to GitHub." -ForegroundColor Cyan
