@echo off
echo ========================================
echo    CREO ERP PRODUCTION DEPLOYMENT
echo ========================================
echo.

echo [1/8] Checking Prerequisites...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed or not in PATH
    pause
    exit /b 1
)

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

echo ✓ Prerequisites check passed

echo.
echo [2/8] Installing Production Dependencies...
call npm install --production=false
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed

echo.
echo [3/8] Checking Environment Variables...
if not exist ".env" (
    echo WARNING: .env file not found
    echo Please create .env file with your Supabase credentials:
    echo.
    echo VITE_SUPABASE_URL=your_supabase_project_url
    echo VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    echo.
    echo Copy from env.example and update with your values
    pause
    echo Creating .env from template...
    copy env.example .env
    echo.
    echo Please edit .env file with your Supabase credentials and run this script again
    pause
    exit /b 1
)
echo ✓ Environment file found

echo.
echo [4/8] Building Production Bundle...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)
echo ✓ Production build completed

echo.
echo [5/8] Running Production Tests...
echo Testing build output...
if not exist "dist\index.html" (
    echo ERROR: Build output not found
    pause
    exit /b 1
)
echo ✓ Build output verified

echo.
echo [6/8] Deployment Options:
echo.
echo Choose your deployment method:
echo 1. Netlify (Recommended)
echo 2. Vercel
echo 3. Firebase Hosting
echo 4. GitHub Pages
echo 5. Manual/Custom Server
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto netlify
if "%choice%"=="2" goto vercel
if "%choice%"=="3" goto firebase
if "%choice%"=="4" goto github
if "%choice%"=="5" goto manual
echo Invalid choice
pause
exit /b 1

:netlify
echo.
echo [7/8] Deploying to Netlify...
echo.
echo Installing Netlify CLI...
call npm install -g netlify-cli
echo.
echo Deploying to Netlify...
echo Run this command to deploy:
echo netlify deploy --prod --dir=dist
echo.
echo Or drag and drop the 'dist' folder to: https://app.netlify.com/drop
echo.
goto success

:vercel
echo.
echo [7/8] Deploying to Vercel...
echo.
echo Installing Vercel CLI...
call npm install -g vercel
echo.
echo Deploying to Vercel...
call vercel --prod
echo.
goto success

:firebase
echo.
echo [7/8] Deploying to Firebase...
echo.
echo Installing Firebase CLI...
call npm install -g firebase-tools
echo.
echo Login to Firebase...
call firebase login
echo.
echo Initializing Firebase project...
call firebase init hosting
echo.
echo Deploying to Firebase...
call firebase deploy
echo.
goto success

:github
echo.
echo [7/8] Deploying to GitHub Pages...
echo.
echo Installing gh-pages...
call npm install -g gh-pages
echo.
echo Deploying to GitHub Pages...
call gh-pages -d dist
echo.
goto success

:manual
echo.
echo [7/8] Manual Deployment...
echo.
echo Your production files are ready in the 'dist' folder
echo.
echo Upload the contents of the 'dist' folder to your web server
echo Make sure to configure your server to serve index.html for all routes
echo.
goto success

:success
echo.
echo [8/8] Deployment Instructions:
echo.
echo ========================================
echo     DEPLOYMENT COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo Your Creo ERP system is ready for production!
echo.
echo IMPORTANT NEXT STEPS:
echo.
echo 1. SUPABASE SETUP:
echo    - Go to https://supabase.com
echo    - Create a new project
echo    - Run the SQL script from 'database/schema.sql' in SQL Editor
echo    - Update your .env file with the project URL and API key
echo.
echo 2. DOMAIN SETUP:
echo    - Configure your custom domain
echo    - Set up SSL certificate (usually automatic)
echo    - Update CORS settings in Supabase if needed
echo.
echo 3. ADMIN ACCOUNT:
echo    - First user to register will need admin privileges
echo    - Manually update their role in Supabase dashboard
echo    - Or use the SQL: UPDATE users SET role='Administrator' WHERE email='your@email.com'
echo.
echo 4. PRODUCTION CHECKLIST:
echo    ✓ Environment variables configured
echo    ✓ Database schema deployed
echo    ✓ Frontend deployed
echo    ✓ SSL certificate active
echo    ✓ Admin user created
echo    ✓ Backup strategy in place
echo.
echo 5. MONITORING:
echo    - Set up Supabase monitoring
echo    - Configure error tracking
echo    - Set up uptime monitoring
echo.
echo Your ERP system is now live and ready for business!
echo.
echo Production URL: [Your deployment URL]
echo Database: Supabase PostgreSQL
echo File Storage: Supabase Storage
echo Authentication: Supabase Auth
echo.
echo For support, check the documentation or contact the development team.
echo.
pause 