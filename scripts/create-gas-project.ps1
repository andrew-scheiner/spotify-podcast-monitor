param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectName,

    [Parameter(Mandatory=$true)]
    [string]$DestinationPath,

    [string]$ScriptId
)

function Get-TemplateRoot {
    $scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
    return Resolve-Path -Path $scriptPath | Select-Object -ExpandProperty Path
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

$exclude = @('.git', 'node_modules', 'scripts')
Get-ChildItem -Force -Path $TemplateRoot | Where-Object { $exclude -notcontains $_.Name } | ForEach-Object {
    $dest = Join-Path $TargetRoot $_.Name
    if ($_.PSIsContainer) {
        Copy-Item -Path $_.FullName -Destination $dest -Recurse -Force
    } else {
        Copy-Item -Path $_.FullName -Destination $dest -Force
    }
}

if ($ScriptId) {
    $claspFile = Join-Path $TargetRoot '.clasp.json'
    if (Test-Path $claspFile) {
        Write-Host "Updating .clasp.json with script ID: $ScriptId" -ForegroundColor Yellow
        $json = Get-Content -Path $claspFile -Raw | ConvertFrom-Json
        $json.scriptId = $ScriptId
        $json | ConvertTo-Json -Depth 10 | Set-Content -Path $claspFile -Encoding utf8

        Write-Host 'Pulling Apps Script project into the new folder...' -ForegroundColor Cyan
        Push-Location $TargetRoot
        try {
            npx clasp pull
        } catch {
            Write-Warning 'clasp pull failed. Ensure CLASP is installed and authenticated.'
        }
        Pop-Location
    } else {
        Write-Warning '.clasp.json not found in the new project. Skipping scriptId update.'
    }
}

Write-Host "New project created at: $TargetRoot" -ForegroundColor Green
Write-Host 'Restoring template back to vanilla...' -ForegroundColor Cyan
& "$TemplateRoot\scripts\restore-gas-template.ps1"
Write-Host 'Template restored to vanilla.' -ForegroundColor Green
Write-Host "Next steps: cd '$TargetRoot', npm install, verify project files, initialize Git, and push to GitHub." -ForegroundColor Cyan
