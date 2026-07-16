@echo off
title DiskIngressos - GitHub Push Helper
echo ==========================================================
echo 🚀 DISKINGRESSOS - ENVIAR PROJETO PARA O GITHUB
echo ==========================================================
echo.

:: Check if git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Git nao encontrado! Por favor, instale o Git.
    echo Acesse: https://git-scm.com/downloads
    pause
    exit /b
)

:: Confirm files to commit
echo [1/3] Preparando commits locais...
git add .
git commit -m "chore: Preparando deploy para nuvem Render" 2>nul
echo ✔ Commits locais prontos.
echo.

:: Get Remote URL
echo [2/3] Configuracao de Repositorio
echo Crie um repositorio vazio no seu GitHub (ex: https://github.com/usuario/sac-erp)
set /p REPO_URL="Cole a URL do seu repositorio do GitHub aqui: "

if "%REPO_URL%"=="" (
    echo [ERRO] URL invalida. Tente novamente.
    pause
    exit /b
)

:: Remove existing origin if any, and add new
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M master

echo.
echo [3/3] Enviando arquivos para o GitHub...
echo (Se solicitado, autorize o login do GitHub na janela do navegador)
echo.
git push -u origin master

if %errorlevel% eq 0 (
    echo.
    echo ==========================================================
    echo 🎉 CODIGO ENVIADO COM SUCESSO PARA O GITHUB!
    echo ==========================================================
    echo Agora acesse o painel do Render (https://dashboard.render.com)
    echo e faca o deploy conectando o seu repositorio.
    echo ==========================================================
) else (
    echo.
    echo [AVISO/ERRO] Falha no push. Verifique se o repositorio no GitHub esta vazio
    echo ou se suas credenciais do GitHub estao corretas.
)

pause
