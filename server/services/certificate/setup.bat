@echo off
echo Installing dependencies for Certificate Validation System...

:: Check if Tesseract is installed
where tesseract >nul 2>&1
if %errorlevel% neq 0 (
    echo Tesseract OCR not found.
    echo Please download and install Tesseract OCR from:
    echo https://github.com/UB-Mannheim/tesseract/wiki
    echo.
    echo After installation, make sure it's added to your PATH.
    echo.
)

:: Check if ImageMagick is installed
where magick >nul 2>&1
if %errorlevel% neq 0 (
    echo ImageMagick not found.
    echo Please download and install ImageMagick from:
    echo https://imagemagick.org/script/download.php
    echo.
    echo During installation, ensure 'Add to PATH' is selected.
    echo.
)

:: Install npm dependencies
echo Installing Node.js dependencies...
cd /d "%~dp0"
call npm install pdf-parse csv-parser

echo Setup complete!