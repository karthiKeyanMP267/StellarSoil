#!/bin/bash

# Install Tesseract OCR
if command -v apt-get &> /dev/null; then
    echo "Installing Tesseract OCR (Ubuntu/Debian)..."
    sudo apt-get update
    sudo apt-get install -y tesseract-ocr
    sudo apt-get install -y imagemagick
elif command -v brew &> /dev/null; then
    echo "Installing Tesseract OCR (macOS)..."
    brew install tesseract
    brew install imagemagick
else
    echo "Please install Tesseract OCR manually:"
    echo "Windows: https://github.com/UB-Mannheim/tesseract/wiki"
    echo "Linux: Use your package manager to install tesseract-ocr"
    echo "macOS: brew install tesseract"
    echo ""
    echo "Also install ImageMagick:"
    echo "Windows: https://imagemagick.org/script/download.php"
    echo "Linux: Use your package manager to install imagemagick"
    echo "macOS: brew install imagemagick"
fi

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
cd "$(dirname "$0")"
npm install pdf-parse csv-parser

echo "Setup complete!"