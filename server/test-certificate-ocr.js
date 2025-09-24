/**
 * test-certificate-ocr.js
 * A test script for the certificate OCR and scoring system
 * 
 * Usage: 
 * node test-certificate-ocr.js <path_to_certificate_image_or_pdf>
 */

const path = require('path');
const CertificateOCRService = require('./services/ocr/CertificateOCRService');
const FarmerCertificateScorer = require('./services/certificate/FarmerCertificateScorer');

// Create instances
const ocrService = new CertificateOCRService();
const scorer = new FarmerCertificateScorer();

// Get file path from command line arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Error: Please provide a path to a certificate image or PDF file.');
  console.log('Usage: node test-certificate-ocr.js <path_to_certificate_file>');
  process.exit(1);
}

const filePath = path.resolve(args[0]);

// Process the file
async function processFile() {
  try {
    console.log(`Processing certificate: ${filePath}`);
    
    // Extract text using OCR
    const extractedText = await ocrService.processCertificate(filePath);
    console.log('\n===== EXTRACTED TEXT =====');
    console.log(extractedText.substring(0, 500) + '...');
    
    // Score the certificate
    const scoreResult = scorer.processCertificate(extractedText);
    
    console.log('\n===== CERTIFICATE SCORE RESULTS =====');
    console.log(`Certificate Type: ${scoreResult.details.certificateType}`);
    console.log(`Issuer: ${scoreResult.details.issuer}`);
    console.log(`Valid Until: ${scoreResult.details.validUntil}`);
    console.log(`Farmer Name: ${scoreResult.details.farmerName}`);
    console.log(`Farm Size: ${scoreResult.details.farmSize}`);
    console.log(`Is Organic: ${scoreResult.details.isOrganic ? 'Yes' : 'No'}`);
    console.log(`Certificate Score: ${scoreResult.certificate_score}`);
    console.log(`Grade: ${scoreResult.grade}`);
    
    console.log('\n===== RECOMMENDATIONS =====');
    scoreResult.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
    
  } catch (error) {
    console.error('Error processing certificate:', error);
  }
}

processFile();