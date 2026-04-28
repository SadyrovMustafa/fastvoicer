param(
  [Parameter(Mandatory = $true)]
  [ValidateSet("up", "down", "reset", "prod", "logs", "ps", "restart")]
  [string]$Action
)

switch ($Action) {
  "up" { & "$PSScriptRoot\dev.ps1" }
  "down" { & "$PSScriptRoot\down.ps1" }
  "reset" { & "$PSScriptRoot\reset.ps1" }
  "prod" { & "$PSScriptRoot\prod.ps1" }
  "logs" { & "$PSScriptRoot\logs.ps1" }
  "ps" { & "$PSScriptRoot\ps.ps1" }
  "restart" { & "$PSScriptRoot\restart.ps1" }
}
