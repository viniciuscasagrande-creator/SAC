# 🏢 DiskIngressos - Assistente de Configuração de Túnel Fixo Cloudflare
# Execute este script para criar e configurar seu túnel nomeado permanente.

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🚀 DISKINGRESSOS - CONFIGURAÇÃO DE TÚNEL FIXED CLOUDFLARE" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Verifica se o cloudflared está instalado
Write-Host "[1/6] Verificando executável 'cloudflared'..." -ForegroundColor Yellow
$cfPath = Get-Command cloudflared -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source

if (-not $cfPath) {
    Write-Host "ℹ️ cloudflared não encontrado no PATH. Fazendo download automático do executável oficial..." -ForegroundColor Yellow
    $url = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.msi"
    $output = "$env:TEMP\cloudflared-setup.msi"
    
    Write-Host "Downloading MSI setup..." -ForegroundColor Gray
    Invoke-WebRequest -Uri $url -OutFile $output
    
    Write-Host "Installing cloudflared globally..." -ForegroundColor Gray
    Start-Process msiexec.exe -ArgumentList "/i `"$output`" /quiet /qn /norestart" -Wait
    
    # Reload environment path
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
    
    Write-Host "✔ cloudflared instalado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "✔ cloudflared já instalado em: $cfPath" -ForegroundColor Green
}

# 2. Login na conta Cloudflare
Write-Host "`n[2/6] Autenticação na sua conta Cloudflare..." -ForegroundColor Yellow
Write-Host "👉 Uma janela de navegador será aberta. Faça login e selecione o seu domínio corporativo." -ForegroundColor Cyan
Start-Sleep -Seconds 2
Start-Process cloudflared -ArgumentList "tunnel login" -Wait

# 3. Solicitação de Domínio
Write-Host "`n[3/6] Configuração de Domínio..." -ForegroundColor Yellow
$domain = Read-Host "Digite o domínio que você autorizou no Cloudflare (Ex: diskingressos.com.br)"
if (-not $domain) {
    Write-Host "❌ Domínio inválido. Encerrando." -ForegroundColor Red
    Exit
}

# 4. Criação do Túnel Fixo
Write-Host "`n[4/6] Criando Túnel Fixo 'diskingressos-dev'..." -ForegroundColor Yellow
$tunnelCreateOut = & cloudflared tunnel create diskingressos-dev 2>&1
Write-Host $tunnelCreateOut -ForegroundColor Gray

# Extrai o ID do túnel do log
$tunnelId = ""
if ($tunnelCreateOut -match "Created tunnel diskingressos-dev with id ([a-f0-9\-]+)") {
    $tunnelId = $Matches[1]
} else {
    # Tenta obter se já existir
    $list = & cloudflared tunnel list 2>&1
    if ($list -match "([a-f0-9\-]+)\s+diskingressos-dev") {
        $tunnelId = $Matches[1]
    }
}

if (-not $tunnelId) {
    Write-Host "❌ Não foi possível capturar o ID do túnel. Verifique se ele já foi criado." -ForegroundColor Red
    Exit
}
Write-Host "✔ ID do Túnel Identificado: $tunnelId" -ForegroundColor Green

# 5. Escrita do arquivo de configuração config.yml
Write-Host "`n[5/6] Gravando arquivo de configuração config.yml..." -ForegroundColor Yellow
$userProfile = [System.Environment]::GetFolderPath("UserProfile")
$cfFolder = Join-Path $userProfile ".cloudflared"

if (-not (Test-Path $cfFolder)) {
    New-Item -ItemType Directory -Path $cfFolder | Out-Null
}

$configFile = Join-Path $cfFolder "config.yml"
$configContent = @"
tunnel: $tunnelId
credentials-file: $cfFolder\$tunnelId.json

ingress:
  # Rota do Painel React (Vite)
  - hostname: sac.$domain
    service: http://localhost:5173
    
  # Rota do ERP Estático
  - hostname: erp.$domain
    service: http://localhost:8080
    
  # Rota da API Backend
  - hostname: api-sac.$domain
    service: http://localhost:3000
    
  # Rota padrão para erro 404
  - service: http_status:404
"@

Set-Content -Path $configFile -Value $configContent -Encoding utf8
Write-Host "✔ Configurações gravadas em: $configFile" -ForegroundColor Green

# 6. Criação das rotas DNS
Write-Host "`n[6/6] Mapeando rotas CNAME no DNS do Cloudflare..." -ForegroundColor Yellow
Write-Host "Mapeando sac.$domain..." -ForegroundColor Gray
& cloudflared tunnel route dns diskingressos-dev "sac.$domain" | Out-Null
Write-Host "Mapeando erp.$domain..." -ForegroundColor Gray
& cloudflared tunnel route dns diskingressos-dev "erp.$domain" | Out-Null
Write-Host "Mapeando api-sac.$domain..." -ForegroundColor Gray
& cloudflared tunnel route dns diskingressos-dev "api-sac.$domain" | Out-Null

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "🎉 CONFIGURAÇÃO CONCLUÍDA COM SUCESSO!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "Para iniciar seu túnel permanente a qualquer momento, rode:" -ForegroundColor Cyan
Write-Host "  cloudflared tunnel run diskingressos-dev" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Green
