const { exec } = require('child_process');

// Check Tesseract installation
exec('tesseract --version', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Tesseract OCR is not installed or not in PATH');
    console.error(`  Error: ${error.message}`);
    console.log('\nInstallation instructions for Tesseract OCR:');
    console.log('1. Download from: https://github.com/UB-Mannheim/tesseract/releases');
    console.log('2. Install and check "Add to PATH" option');
    console.log('3. Restart your terminal after installation');
  } else {
    console.log('✅ Tesseract OCR is installed:');
    console.log(stdout);
  }
});

// Check ImageMagick installation
exec('magick --version', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ ImageMagick is not installed or not in PATH');
    console.error(`  Error: ${error.message}`);
    console.log('\nInstallation instructions for ImageMagick:');
    console.log('1. Download from: https://imagemagick.org/script/download.php#windows');
    console.log('2. Install and check "Add application directory to your system path" option');
    console.log('3. Restart your terminal after installation');
  } else {
    console.log('✅ ImageMagick is installed:');
    console.log(stdout);
  }
});

console.log('\nNode.js dependencies check:');
try {
  require('pdf-parse');
  console.log('✅ pdf-parse is installed');
} catch (err) {
  console.error('❌ pdf-parse is not installed. Run: npm install pdf-parse');
}

try {
  require('csv-parser');
  console.log('✅ csv-parser is installed');
} catch (err) {
  console.error('❌ csv-parser is not installed. Run: npm install csv-parser');
}

try {
  require('uuid');
  console.log('✅ uuid is installed');
} catch (err) {
  console.error('❌ uuid is not installed. Run: npm install uuid');
}

console.log('\nNote: If Tesseract OCR or ImageMagick are not found,');
console.log('      you need to install them manually and restart your terminal.');