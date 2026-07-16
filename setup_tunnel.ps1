# DiskIngressos - Setup Tunnel Helper
# Run this script to configure the persistent Cloudflare Tunnel.

param(
    [string]$Domain
)

$ErrorActionPreference = "Stop"

Write-Host "=========================================================="
Write-Host "DISKINGRESSOS - CONFIGURING FIXED CLOUDFLARE TUNNEL"
Write-Host "=========================================================="

# Define directories
$userProfile = [System.Environment]::GetFolderPath("UserProfile")
$cfFolder = Join-Path $userProfile ".cloudflared"

if (-not (Test-Path $cfFolder)) {
    $null = New-Item -ItemType Directory -Path $cfFolder
}

$cfPath = Join-Path $cfFolder "cloudflared.exe"

# 1. Download standalone cloudflared if not exists
if (-not (Test-Path $cfPath)) {
    # Check if there is already a globally installed cloudflared
    $globalCf = Get-Command cloudflared -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source
    if ($globalCf) {
        $cfPath = $globalCf
        Write-Host "Found global cloudflared at: $cfPath"
    } else {
        # Check npm cache as backup
        $npmCacheCf = "C:\Users\vinad\AppData\Local\npm-cache\_npx\8a26fc3a61fe4212\node_modules\cloudflared\bin\cloudflared.exe"
        if (Test-Path $npmCacheCf) {
            Write-Host "Copying cloudflared from npm cache..."
            Copy-Item $npmCacheCf $cfPath
        } else {
            Write-Host "cloudflared executable not found. Downloading standalone binary (approx. 30MB)..."
            $url = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"
            Invoke-WebRequest -Uri $url -OutFile $cfPath
            Write-Host "Download completed successfully!"
        }
    }
} else {
    Write-Host "Using existing cloudflared binary at: $cfPath"
}

# 2. Login to Cloudflare account
Write-Host "`n[2/6] Logging in to Cloudflare..."
Write-Host "A browser window will open. Please log in and authorize your domain."
Start-Sleep -Seconds 2
Start-Process $cfPath -ArgumentList "tunnel login" -Wait

# 3. Domain Input
Write-Host "`n[3/6] Domain Configuration..."
if (-not $Domain) {
    $Domain = Read-Host "Enter the domain you authorized in Cloudflare (e.g. diskingressos.com.br)"
}
if (-not $Domain) {
    Write-Host "Invalid domain. Exiting."
    Exit
}
$domain = $Domain

# 4. Create Named Tunnel
Write-Host "`n[4/6] Creating Named Tunnel 'diskingressos-dev'..."
$tunnelCreateOut = & $cfPath tunnel create diskingressos-dev 2>&1
Write-Host $tunnelCreateOut

# Extract tunnel ID
$tunnelId = ""
if ($tunnelCreateOut -match "Created tunnel diskingressos-dev with id ([a-f0-9\-]+)") {
    $tunnelId = $Matches[1]
} else {
    $list = & $cfPath tunnel list 2>&1
    if ($list -match "([a-f0-9\-]+)\s+diskingressos-dev") {
        $tunnelId = $Matches[1]
    }
}

if (-not $tunnelId) {
    Write-Host "Could not retrieve tunnel ID. Exiting."
    Exit
}
Write-Host "Tunnel ID captured: $tunnelId"

# 5. Write config.yml
Write-Host "`n[5/6] Writing config.yml configuration..."
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
Write-Host "`n[6/6] Mapping CNAME records on Cloudflare DNS..."
& $cfPath tunnel route dns diskingressos-dev "sac.$domain"
& $cfPath tunnel route dns diskingressos-dev "erp.$domain"
& $cfPath tunnel route dns diskingressos-dev "api-sac.$domain"

Write-Host "`n=========================================================="
Write-Host "CONFIGURATION COMPLETED SUCCESSFULLY!"
Write-Host "To run your persistent tunnel at any time, run:"
Write-Host "  & '$cfPath' tunnel run diskingressos-dev"
Write-Host "=========================================================="
