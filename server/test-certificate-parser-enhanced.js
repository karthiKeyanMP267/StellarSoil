// Certificate parsing test script - Enhanced version
// This script demonstrates what information is extracted from different types of farm certificates
// by showing the OCR parsing results and scoring output

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import CertificateOCRService from './services/ocr/CertificateOCRService.js';
import FarmerCertificateScorer from './services/certificate/FarmerCertificateScorer.js';
import PGSCertificateExtension from './services/certificate/PGSCertificateExtension.js';

// Create certificates directory if it doesn't exist
const certificatesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'certificates');
if (!fs.existsSync(certificatesDir)) {
  fs.mkdirSync(certificatesDir, { recursive: true });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sample certificates for testing
const sampleCertificates = [
  {
    name: "NPOP Organic Certificate",
    text: `
ORGANIC CERTIFICATION
Certificate No: NPOP/APEDA/2023/1234
Issued by: Agricultural and Processed Food Products Export Development Authority (APEDA)
Date of Issue: 01/05/2023
Valid until: 30/04/2025

This is to certify that:
Farmer Name: Rajesh Kumar
Farm Location: Village Sundarpur, District Pune, Maharashtra
Farm Size: 2.5 hectares

Crops: Rice, Wheat, Vegetables

Has been inspected and found to comply with the requirements of the
National Programme for Organic Production (NPOP) Standards.

This certificate confirms that the agricultural products referred to above
have been produced in accordance with the organic farming practices
under the NPOP standards.

Signature: _________________
Certifying Officer
`
  },
  {
    name: "IndGAP Certificate",
    text: `
INDGAP CERTIFICATION
Registration No.: INDGAP/QCI/2023/789123
Issued by: Quality Council of India (QCI)
Issue Date: 15/03/2023
Valid Until: 14/03/2025

Farmer Details:
Name: Anita Sharma
Farm: Green Earth Farm
Location: Dist. Coimbatore, Tamil Nadu
Farm Size: 1.2 acres

Products Certified:
Tomato, Chilli, Okra
Area of Cultivation: 1.2 acres

Certification Status: INDGAP Standard (Level 1)
Certification Scope: Fruits & Vegetables

This certificate confirms compliance with Good Agricultural Practices as per
IndGAP Certification Scheme.
`
  },
  {
    name: "PGS Organic Certificate",
    text: `
PGS-INDIA
Participatory Guarantee System for India
ORGANIC CERTIFICATE

Certificate ID: PGS/LG/12345/2024
Certified by: Samridhi Local Group, Patna
Status: GREEN - Organic
Valid from: 01/01/2024 to 31/12/2025

Farmer: Mahesh Patel
Village: Bakhtiyarpur
District: Patna, Bihar

Farm Area: 0.8 hectare
Crops Certified: Mango, Lentils, Potatoes

This farm has been verified through participatory
peer reviews and found to comply with PGS-India
Organic Standards.
`
  },
  // Add PGS Authorization Certificate type
  {
    name: "PGS Authorization Certificate",
    text: `
National Centre of Organic Farming
PGS- Secretariat
Department of Agriculture Cooperation & Farmer Welfare
Government of India
Sector 19, Hapur Road, Kamla Nehru Nagar, Ghaziabad - 201 002

Authorization No    : PGSI/N(PU)-1728
Authorization Date  : 09-06-2016

Certificate of Authorization

PGS-India National Advisory Committee (PGS-NAC) is pleased to authorize Kheti Virasat Mission, Jaitu-Faridkot (Punjab)-151202 as Regional Council under PGS-India Programme for Punjab, Haryana and Chandigarh.

The certificate of authorization shall remain valid for a period of three years from the date of authorization.

Executive Secretary
PGS-India
`
  },
  // Add another PGS Authorization Certificate type
  {
    name: "PGS Regional Council Certificate",
    text: `
Government of India
Department of Agriculture & Farmers Welfare
National Centre for Organic and Natural Farming
PGS-India Secretariat
Sector 19, Hapur Road, Kamla Nehru Nagar, Ghaziabad - 201 002

Certificate of Authorization

National Executive Committee (NEC) of PGS-India is pleased to authorize ANDHRA PRADESH STATE ORGANIC PRODUCTS CERTIFICATION AUTHORITY (APSSOCA), ANDHRA PRADESH as Regional Council under PGS-India programme as per revised guidelines.

1. Authorization No.: RC/2023/1389
2. Date of Authorization: 12.11.2024
3. Scope of Certification: Crop Production, Processing & handling

This certificate of authorization shall remain valid for a period of three years from the date of authorization. The validity of the certificate solely depends on compliance to PGS-India certification as per required standards and is subject to annual surveillance Audit/ Inspections.

(Dr. Gagnesh Sharma)
Director, NCONF
Executive Secretary, PGS-India
`
  }
];

// Create a mock certificate file for testing
const mockCertificatePath = path.join(__dirname, 'test-certificate.txt');
try {
    // Start with first certificate
    fs.writeFileSync(mockCertificatePath, sampleCertificates[0].text);
    console.log('Created test certificate file for OCR processing');
} catch (err) {
    console.error('Error creating test file:', err);
    process.exit(1);
}

/**
 * Mask sensitive certificate/authorization numbers for privacy
 * Shows only first few and last few characters, replacing middle with asterisks
 * @param {string} certNumber - The certificate or authorization number
 * @param {number} prefixLength - Number of prefix characters to show (default: 3)
 * @param {number} suffixLength - Number of suffix characters to show (default: 4)
 * @returns {string} - Masked certificate number
 */
function maskCertificateNumber(certNumber, prefixLength = 3, suffixLength = 4) {
    if (!certNumber || typeof certNumber !== 'string') return 'Unknown';
    
    // Remove any whitespace
    const number = certNumber.trim();
    
    if (number.length <= prefixLength + suffixLength) {
        return number; // Too short to mask meaningfully
    }
    
    const prefix = number.substring(0, prefixLength);
    const suffix = number.substring(number.length - suffixLength);
    const maskedLength = number.length - prefixLength - suffixLength;
    const maskedPart = '*'.repeat(maskedLength);
    
    return `${prefix}${maskedPart}${suffix}`;
}

async function testCertificateParsing(customCertificatePath = null) {
    console.log('\n=== CERTIFICATE PARSING TEST ===\n');
    
    const ocrService = new CertificateOCRService();
    const scorer = new FarmerCertificateScorer();
    
    // If a custom certificate file is provided, test that first
    if (customCertificatePath && fs.existsSync(customCertificatePath)) {
        console.log(`\n\n==== TESTING USER PROVIDED CERTIFICATE: ${path.basename(customCertificatePath)} ====\n`);
        try {
            console.log('STEP 1: OCR Processing');
            console.log('-----------------------');
            console.log(`Processing file: ${customCertificatePath}`);
            
            let ocrText;
            try {
                // Process the provided certificate file through OCR
                ocrText = await ocrService.processCertificate(customCertificatePath);
                console.log('OCR processing successful!');
            } catch (error) {
                console.error(`OCR processing failed: ${error.message}`);
                console.log('OCR may not be properly installed or the file format is not supported.');
                console.log('Make sure Tesseract OCR is installed and the file is an image or PDF.');
                console.log('\nProceeding with sample certificates instead...');
            }
            
            if (ocrText) {
                console.log('\nExtracted Text:');
                console.log('-----------------------');
                console.log(ocrText);
                console.log('-----------------------\n');
                
                // Process the extracted text
                console.log('STEP 2: Feature Extraction');
                console.log('-----------------------');
                
                // Check if it's a PGS Authorization certificate first
                if (ocrText.includes('Certificate of Authorization') && 
                    (ocrText.includes('PGS-India') || ocrText.includes('PGS India'))) {
                    console.log('Detected a PGS Authorization Certificate');
                    const pgsFeatures = PGSCertificateExtension.extractPGSAuthorizationFeatures(ocrText);
                    console.log('Extracted PGS Authorization Features:');
                    console.log(JSON.stringify(pgsFeatures, null, 2));
                    console.log('-----------------------\n');
                    
                    console.log('STEP 3: Score Calculation');
                    console.log('-----------------------');
                    const pgsScoreResult = PGSCertificateExtension.scorePGSAuthorizationCertificate(pgsFeatures);
                    console.log(`Certificate Score: ${pgsScoreResult.score}`);
                    console.log(`Grade: ${pgsScoreResult.grade}`);
                    
                    // Show masked authorization number
                    if (pgsFeatures.authorizationNumber) {
                        console.log(`\nAuthorization Number (Masked): ${PGSCertificateExtension.maskAuthorizationNumber(pgsFeatures.authorizationNumber)}`);
                    }
                    
                    // Show score components
                    console.log('\nScore Components:');
                    for (const component in pgsScoreResult.components) {
                        const { weight, score, reason } = pgsScoreResult.components[component];
                        console.log(`- ${component}: ${score} (weight: ${weight}) - ${reason}`);
                    }
                    console.log('-----------------------\n');
                    
                    console.log('STEP 4: Final Certificate Details');
                    console.log('-----------------------');
                    console.log(JSON.stringify(pgsScoreResult.features, null, 2));
                    
                    // Successfully processed user certificate
                    console.log('\nUser certificate processed successfully.');
                    return; // Skip sample certificates
                } else {
                    // Regular farmer certificate
                    const features = scorer.extractCertificateFeatures(ocrText);
                    console.log('Extracted Features:');
                    console.log(JSON.stringify(features, null, 2));
                    console.log('-----------------------\n');
                    
                    console.log('STEP 3: Score Calculation');
                    console.log('-----------------------');
                    const scoreResult = scorer.calculateCertificateScore(features);
                    console.log(`Certificate Score: ${scoreResult.score}`);
                    console.log(`Grade: ${scoreResult.grade}`);
                    
                    // Show masked certificate number if available
                    if (features.certificateNumber) {
                        console.log(`\nCertificate Number (Masked): ${maskCertificateNumber(features.certificateNumber)}`);
                    }
                    
                    // Show score components
                    console.log('\nScore Components:');
                    for (const component in scoreResult.components) {
                        const { weight, score, reason } = scoreResult.components[component];
                        console.log(`- ${component}: ${score} (weight: ${weight}) - ${reason}`);
                    }
                    console.log('-----------------------\n');
                    
                    console.log('STEP 4: Final Certificate Details');
                    console.log('-----------------------');
                    console.log(JSON.stringify(scoreResult.features, null, 2));
                    
                    // Successfully processed user certificate
                    console.log('\nUser certificate processed successfully.');
                    return; // Skip sample certificates
                }

                
                // Don't proceed with sample certificates if user file was successfully processed
                if (ocrText.length > 100) {  // Only if we got meaningful text
                    console.log('\nUser certificate processed successfully. Skipping sample certificates.');
                    return;
                }
            }
        } catch (error) {
            console.error('Error processing user certificate:', error);
            console.log('Proceeding with sample certificates instead...');
        }
    }
    
    // Loop through all sample certificates to test
    for (let i = 0; i < sampleCertificates.length; i++) {
        const certificate = sampleCertificates[i];
        console.log(`\n\n==== TESTING CERTIFICATE ${i+1}: ${certificate.name} ====\n`);
        
        try {
            // Write current certificate to file
            fs.writeFileSync(mockCertificatePath, certificate.text);
            
            console.log('STEP 1: OCR Processing');
            console.log('-----------------------');
            let ocrText;
            
            try {
                // Try to process the file through OCR (may not work if dependencies not installed)
                ocrText = await ocrService.processCertificate(mockCertificatePath);
                console.log('OCR Result:');
            } catch (error) {
                console.log('OCR processing failed (expected if Tesseract not installed).');
                console.log('Using mock text instead.');
                ocrText = certificate.text;
            }
            
            console.log('\nExtracted Text:');
            console.log('-----------------------');
            console.log(ocrText);
            console.log('-----------------------\n');
            
            console.log('STEP 2: Feature Extraction');
            console.log('-----------------------');
            const features = scorer.extractCertificateFeatures(ocrText);
            console.log('Extracted Features:');
            console.log(JSON.stringify(features, null, 2));
            console.log('-----------------------\n');
            
            console.log('STEP 3: Score Calculation');
            console.log('-----------------------');
            const scoreResult = scorer.calculateCertificateScore(features);
            console.log(`Certificate Score: ${scoreResult.score}`);
            console.log(`Grade: ${scoreResult.grade}`);
            console.log('\nScore Components:');
            for (const component in scoreResult.components) {
                const { weight, score, reason } = scoreResult.components[component];
                console.log(`- ${component}: ${score} (weight: ${weight}) - ${reason}`);
            }
            console.log('-----------------------\n');
            
            console.log('STEP 4: Final Certificate Details');
            console.log('-----------------------');
            console.log(JSON.stringify(scoreResult.features, null, 2));
            
        } catch (error) {
            console.error(`Error processing certificate ${i+1}:`, error);
        }
    }
    
    console.log('\n\n==== SUMMARY ====');
    console.log('Certificate parsing demonstrated with 5 different certificate types:');
    console.log('1. NPOP Organic Certificate - Government issued high-value certification');
    console.log('2. IndGAP Certificate - Quality Council of India certification');
    console.log('3. PGS Organic Certificate - Participatory Guarantee System');
    console.log('4. PGS Authorization Certificate - Regional Council authorization');
    console.log('5. PGS Regional Council Certificate - State authority certification');
    console.log('\nThe parser extracts:');
    console.log('- Certificate type/scheme (NPOP, INDGAP, PGS, etc.)');
    console.log('- Certificate/Authorization number (with privacy masking option)');
    console.log('- Issuing authority');
    console.log('- Validity dates');
    console.log('- Farmer/Organization name');
    console.log('- Location/Region information');
    console.log('- Farm size and units (when applicable)');
    console.log('- Crops/products certified (when applicable)');
    console.log('- Organic status');
    
    // Clean up the test file
    try {
        fs.unlinkSync(mockCertificatePath);
        console.log('\nCleanup: Test certificate file removed.');
    } catch (err) {
        console.error('Error removing test file:', err);
    }
}

// Check if a certificate path is provided as a command line argument
const userProvidedCertificate = process.argv[2];
if (userProvidedCertificate) {
    console.log(`Certificate file provided: ${userProvidedCertificate}`);
    testCertificateParsing(userProvidedCertificate);
} else {
    console.log('No certificate file provided, using sample certificates');
    testCertificateParsing();
}