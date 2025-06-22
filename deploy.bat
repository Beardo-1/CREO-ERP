@echo off
echo ========================================
echo    CREO ERP - DEPLOYMENT SCRIPT
echo ========================================
echo.

echo Building production version...
call npm run build

if %ERRORLEVEL% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo Build completed successfully!
echo.
echo Your production files are in the 'dist' folder.
echo.
echo DEPLOYMENT OPTIONS:
echo 1. Drag 'dist' folder to Netlify.com
echo 2. Upload 'dist' contents to your web hosting
echo 3. Use 'npx serve dist' to test locally
echo.
echo Would you like to preview the build locally? (y/n)
set /p choice=

if /i "%choice%"=="y" (
    echo Starting local preview...
    npx serve dist -p 3000
) else (
    echo Deployment ready! Upload the 'dist' folder contents to your hosting provider.
)

pause 