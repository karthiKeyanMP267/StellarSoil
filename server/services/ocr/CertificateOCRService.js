const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { promisify } = require('util');
const pdf = require('pdf-parse');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const existsAsync = promisify(fs.exists);
const mkdirAsync = promisify(fs.mkdir);

/**
 * CertificateOCRService - A service for processing certificate documents
 * using OCR to extract text content for analysis
 */
class CertificateOCRService {
  constructor() {
    this.tempDir = path.join(__dirname, '../../uploads/temp');
    this.tesseractCmd = 'tesseract'; // Assuming tesseract is in PATH
    this.supportedImageFormats = ['.jpg', '.jpeg', '.png', '.tiff', '.bmp'];
    this.supportedDocFormats = ['.pdf'];
    
    this.ensureTempDirExists();
  }

  /**
   * Ensure the temporary directory exists
   */
  async ensureTempDirExists() {
    try {
      if (!await existsAsync(this.tempDir)) {
        await mkdirAsync(this.tempDir, { recursive: true });
      }
    } catch (error) {
      console.error('Failed to create temp directory:', error);
      throw error;
    }
  }

  /**
   * Check if the file format is supported
   */
  isFormatSupported(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return this.supportedImageFormats.includes(ext) || this.supportedDocFormats.includes(ext);
  }

  /**
   * Process a certificate file and extract text using OCR
   */
  async processCertificate(filePath) {
    if (!await existsAsync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    if (!this.isFormatSupported(filePath)) {
      throw new Error('Unsupported file format. Please upload a PDF or image (JPG, PNG, TIFF, BMP).');
    }

    const ext = path.extname(filePath).toLowerCase();
    
    if (this.supportedImageFormats.includes(ext)) {
      return await this.processImageWithTesseract(filePath);
    } else if (ext === '.pdf') {
      return await this.processPdfDocument(filePath);
    }
  }

  /**
   * Process an image file with Tesseract OCR
   */
  async processImageWithTesseract(imagePath) {
    try {
      const outputBase = path.join(this.tempDir, `ocr_${Date.now()}`);
      const outputFile = `${outputBase}.txt`;
      
      // Run tesseract with optimizations for certificates
      execSync(`${this.tesseractCmd} "${imagePath}" "${outputBase}" -l eng --oem 1 --psm 3 -c preserve_interword_spaces=1`);
      
      // Read the OCR result
      if (await existsAsync(outputFile)) {
        const text = await readFileAsync(outputFile, 'utf8');
        
        // Clean up temp file
        fs.unlink(outputFile, (err) => {
          if (err) console.error('Failed to delete temp OCR file:', err);
        });
        
        return text;
      } else {
        throw new Error('OCR processing failed: Output file not created');
      }
    } catch (error) {
      console.error('OCR processing failed:', error);
      throw new Error(`OCR processing failed: ${error.message}`);
    }
  }

  /**
   * Process a PDF document with PDF-Parse and Tesseract OCR if needed
   */
  async processPdfDocument(pdfPath) {
    try {
      // First try to extract text directly from the PDF
      const dataBuffer = await readFileAsync(pdfPath);
      const pdfData = await pdf(dataBuffer);
      
      let text = pdfData.text;
      
      // If the text is too short, the PDF might be scan-based and needs OCR
      if (text.trim().length < 100) {
        console.log('PDF appears to be scan-based. Using OCR processing...');
        
        // Convert PDF to images and run OCR
        // In a real implementation, you would use pdf2image or a similar library
        // For this demonstration, we'll use a simplistic approach
        
        const outputBase = path.join(this.tempDir, `pdf_ocr_${Date.now()}`);
        
        // Convert first page of PDF to image using ImageMagick (must be installed)
        // Note: In a production environment, you would process all pages
        try {
          execSync(`magick convert -density 300 "${pdfPath}[0]" -quality 100 "${outputBase}.png"`);
          
          // Process the converted image with Tesseract
          text = await this.processImageWithTesseract(`${outputBase}.png`);
          
          // Clean up temp file
          fs.unlink(`${outputBase}.png`, (err) => {
            if (err) console.error('Failed to delete temp PNG file:', err);
          });
        } catch (convertError) {
          console.error('Failed to convert PDF to image:', convertError);
          // Return the limited text we got directly from PDF
          console.log('Using limited text extracted directly from PDF');
        }
      }
      
      return text;
    } catch (error) {
      console.error('PDF processing failed:', error);
      throw new Error(`PDF processing failed: ${error.message}`);
    }
  }
  
  /**
   * Process a document (PDF or image) in memory
   */
  async processDocumentBuffer(buffer, fileExt) {
    try {
      // Normalize extension with dot
      if (!fileExt.startsWith('.')) {
        fileExt = `.${fileExt}`;
      }
      fileExt = fileExt.toLowerCase();
      
      if (!this.supportedImageFormats.includes(fileExt) && 
          !this.supportedDocFormats.includes(fileExt)) {
        throw new Error('Unsupported file format. Please upload a PDF or image (JPG, PNG, TIFF, BMP).');
      }
      
      const tempFile = path.join(this.tempDir, `temp_${Date.now()}${fileExt}`);
      
      // Write buffer to temp file
      await writeFileAsync(tempFile, buffer);
      
      // Process the file
      const text = await this.processCertificate(tempFile);
      
      // Clean up temp file
      fs.unlink(tempFile, (err) => {
        if (err) console.error('Failed to delete temp file:', err);
      });
      
      return text;
    } catch (error) {
      console.error('Document processing failed:', error);
      throw new Error(`Document processing failed: ${error.message}`);
    }
  }
}

module.exports = CertificateOCRService;