import { exec } from 'child_process';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Check Tesseract installation
console.log('Checking Tesseract OCR...');
exec('tesseract --version', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Tesseract OCR is not installed or not in PATH');
    console.error(`  Error: ${error.message}`);
  } else {
    console.log('✅ Tesseract OCR is installed:');
    console.log(stdout);
  }
});

// Check ImageMagick installation
console.log('\nChecking ImageMagick...');
exec('magick --version', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ ImageMagick is not installed or not in PATH');
    console.error(`  Error: ${error.message}`);
  } else {
    console.log('✅ ImageMagick is installed:');
    console.log(stdout);
  }
});

console.log('\nChecking Node.js dependencies...');
try {
  require('pdf-parse');
  console.log('✅ pdf-parse is installed');
} catch (err) {
  console.error('❌ pdf-parse is not installed');
}

try {
  require('csv-parser');
  console.log('✅ csv-parser is installed');
} catch (err) {
  console.error('❌ csv-parser is not installed');
}

try {
  require('uuid');
  console.log('✅ uuid is installed');
} catch (err) {
  console.error('❌ uuid is not installed');
}