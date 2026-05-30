# Script de Publicação Automática para o GitHub via API REST
# VK Restaurante - Cardápio Digital

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Gold
Write-Host "   VK RESTAURANTE - PUBLICADOR AUTOMÁTICO DO GITHUB       " -ForegroundColor Gold
Write-Host "==========================================================" -ForegroundColor Gold
Write-Host ""

# 1. Obter informações de autenticação
$username = Read-Host "Digite seu nome de usuário do GitHub"
if ([string]::IsNullOrWhiteSpace($username)) {
    Write-Error "Nome de usuário inválido."
}

Write-Host "Insira seu Token de Acesso Pessoal (PAT) do GitHub." -ForegroundColor Cyan
Write-Host "(Certifique-se de que o token tenha a permissão 'repo')" -ForegroundColor Gray
$pat = Read-Host "Digite seu PAT (o texto ficará oculto)" -AsSecureString
if ($null -eq $pat) {
    Write-Error "Token inválido."
}

# Converter SecureString para String pura para uso nas chamadas REST
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($pat)
$plainPat = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

$repoName = "vk-restaurante-cardapio"
Write-Host "Criando o repositório '$repoName' no GitHub..." -ForegroundColor Yellow

$headers = @{
    "Authorization" = "token $plainPat"
    "Accept"        = "application/vnd.github.v3+json"
    "User-Agent"    = "PowerShell-Upload-Script"
}

# 2. Criar o repositório via API
$createRepoBody = @{
    name        = $repoName
    description = "Cardápio Digital completo e premium do VK Restaurante"
    private     = $false
} | ConvertTo-Json

try {
    $repoUrl = "https://api.github.com/user/repos"
    $response = Invoke-RestMethod -Uri $repoUrl -Method Post -Headers $headers -Body $createRepoBody -ContentType "application/json"
    Write-Host "✓ Repositório criado com sucesso em: $($response.html_url)" -ForegroundColor Green
} catch {
    # Se o repositório já existir, tentamos continuar enviando os arquivos
    if ($_.Exception.Message -like "*422*") {
        Write-Host "! O repositório '$repoName' já existe no seu perfil do GitHub. Continuando com o upload dos arquivos..." -ForegroundColor Yellow
    } else {
        Write-Error "Erro ao criar o repositório: $_"
    }
}

# 3. Mapear arquivos do projeto
$filesToUpload = Get-ChildItem -Path . -Recurse -File | Where-Object {
    $_.Name -ne "publish.ps1" -and
    $_.FullName -notlike "*\.git*" -and
    $_.FullName -notlike "*\.system_generated*"
}

Write-Host "Encontrados $($filesToUpload.Count) arquivos para upload." -ForegroundColor Cyan
Write-Host "Iniciando upload..." -ForegroundColor Yellow

foreach ($file in $filesToUpload) {
    # Obter caminho relativo para a API do GitHub
    $relativePath = Resolve-Path -Path $file.FullName -Relative
    $relativePath = $relativePath -replace "^\.\\", "" -replace "\\", "/"
    
    Write-Host "Enviando: $relativePath..." -ForegroundColor Gray
    
    # Ler bytes do arquivo e converter para Base64
    $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
    $base64Content = [System.Convert]::ToBase64String($bytes)
    
    $uploadBody = @{
        message = "Upload automático do arquivo $relativePath"
        content = $base64Content
    } | ConvertTo-Json
    
    $uploadUrl = "https://api.github.com/repos/$username/$repoName/contents/$relativePath"
    
    # Verificar se o arquivo já existe para obter seu sha (caso precise sobrescrever)
    try {
        $existingFile = Invoke-RestMethod -Uri $uploadUrl -Method Get -Headers $headers
        if ($existingFile -and $existingFile.sha) {
            # Se existe, precisamos enviar o SHA no corpo da requisição de atualização
            $uploadBody = @{
                message = "Atualizando o arquivo $relativePath"
                content = $base64Content
                sha     = $existingFile.sha
            } | ConvertTo-Json
        }
    } catch {
        # Se for 404 (não existe), é normal, continuamos o upload padrão sem sha
    }

    try {
        $uploadResponse = Invoke-RestMethod -Uri $uploadUrl -Method Put -Headers $headers -Body $uploadBody -ContentType "application/json"
        Write-Host "✓ $relativePath enviado!" -ForegroundColor Green
    } catch {
        Write-Host "✗ Falha ao enviar $relativePath : $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "🎉 PROJETO PUBLICADO COM SUCESSO NO GITHUB! 🎉" -ForegroundColor Green
Write-Host "Link do Repositório: https://github.com/$username/$repoName" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Green
Write-Host ""
