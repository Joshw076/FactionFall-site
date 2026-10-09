param([switch]$ForPublication)
$ErrorActionPreference = 'Stop'
$node = Get-Command node -ErrorAction Stop
$buildArgs = @((Join-Path $PSScriptRoot 'build.mjs'))
if ($ForPublication) { $buildArgs += '--release' }
& $node.Source @buildArgs
if ($LASTEXITCODE -ne 0) { throw 'Website build failed.' }
Compress-Archive -Path (Join-Path $PSScriptRoot 'dist\*') -DestinationPath (Join-Path $PSScriptRoot 'factionfall-pages.zip') -Force
