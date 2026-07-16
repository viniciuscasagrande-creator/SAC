# DiskIngressos - Setup Tunnel Helper
# Run this script to configure the persistent Cloudflare Tunnel.

param(
    [string]$Domain
)

$ErrorActionPreference = "Stop"

Write-Host "=========================================================="
Write-Host "DISKINGRESSOS - CONFIGURING FIXED CLOUDFLARE TUNNEL"
Write-Host "=========================================================="

# 1. Check if cloudflared is installed
Write-Host "[1/6] Checking for 'cloudflared' executable..."
$cfPath = Get-Command cloudflared -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source

if (-not $cfPath) {
    Write-Host "cloudflared not found in PATH. Downloading official installer..."
    $url = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.msi"
    $output = "$env:TEMP\cloudflared-setup.msi"
    
    Write-Host "Downloading MSI..."
    Invoke-WebRequest -Uri $url -OutFile $output
    
    Write-Host "Installing cloudflared globally..."
    Start-Process msiexec.exe -ArgumentList "/i `"$output`" /quiet /qn /norestart" -Wait
    
    # Reload environment path
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
    
    Write-Host "cloudflared installed successfully!"
} else {
    Write-Host "cloudflared already installed at: $cfPath"
}

# 2. Login to Cloudflare account
Write-Host "[2/6] Logging in to Cloudflare..."
Write-Host "A browser window will open. Please log in and authorize your domain."
Start-Sleep -Seconds 2
Start-Process cloudflared -ArgumentList "tunnel login" -Wait

# 3. Domain Input
Write-Host "[3/6] Domain Configuration..."
if (-not $Domain) {
    $Domain = Read-Host "Enter the domain you authorized in Cloudflare (e.g. diskingressos.com.br)"
}
if (-not $Domain) {
    Write-Host "Invalid domain. Exiting."
    Exit
}
$domain = $Domain

# 4. Create Named Tunnel
Write-Host "[4/6] Creating Named Tunnel 'diskingressos-dev'..."
$tunnelCreateOut = & cloudflared tunnel create diskingressos-dev 2>&1
Write-Host $tunnelCreateOut

# Extract tunnel ID
$tunnelId = ""
if ($tunnelCreateOut -match "Created tunnel diskingressos-dev with id ([a-f0-9\-]+)") {
    $tunnelId = $Matches[1]
} else {
    $list = & cloudflared tunnel list 2>&1
    if ($list -match "([a-f0-9\-]+)\s+diskingressos-dev") {
        $tunnelId = $Matches[1]
    }
}

if (-not $tunnelId) {
    Write-Host "Could not retrieve tunnel ID. Checking list..."
    Exit
}
Write-Host "Tunnel ID captured: $tunnelId"

# 5. Write config.yml
Write-Host "[5/6] Writing config.yml configuration..."
$userProfile = [System.Environment]::GetFolderPath("UserProfile")
$cfFolder = Join-Path $userProfile ".cloudflared"

if (-not (Test-Path $cfFolder)) {
    $null = New-Item -ItemType Directory -Path $cfFolder
}

$configFile = Join-Path $cfFolder "config.yml"
$configContent = @"
tunnel: $tunnelId
credentials-file: $cfFolder\\$tunnelId.json

ingress:
  - hostname: sac.$domain
    service: http://localhost:5173
  - hostname: erp.$domain
    service: http://localhost:8080
  - hostname: api-sac.$domain
    service: http://localhost:3000
  - service: http_status:404
"@

Set-Content -Path $configFile -Value $configContent -Encoding utf8
Write-Host "Configuration saved to: $configFile"

# 6. Map CNAME DNS records
Write-Host "[6/6] Mapping CNAME records on Cloudflare DNS..."
& cloudflared tunnel route dns diskingressos-dev "sac.$domain"
& cloudflared tunnel route dns diskingressos-dev "erp.$domain"
& cloudflared tunnel route dns diskingressos-dev "api-sac.$domain"

Write-Host "=========================================================="
Write-Host "CONFIGURATION COMPLETED SUCCESSFULLY!"
Write-Host "To run your persistent tunnel at any time, run:"
Write-Host "  cloudflared tunnel run diskingressos-dev"
Write-Host "=========================================================="
