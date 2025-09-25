// Certificate parsing test script
// This script demonstrates what information is extracted from farm certificates
// by showing the OCR parsing results and scoring output

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import CertificateOCRService from './services/ocr/CertificateOCRService.js';
import FarmerCertificateScorer from './services/certificate/FarmerCertificateScorer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use sample certificate if available, otherwise create mock text
let sampleCertificateText = `
ORGANIC CERTIFICATION
Certificate No.: NPOP/APEDA/2023/1234
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
`;

// Create a mock certificate file for testing if using actual file processing
const mockCertificatePath = path.join(__dirname, 'test-certificate.txt');
try {
    fs.writeFileSync(mockCertificatePath, sampleCertificateText);
    console.log('Created test certificate file for OCR processing');
} catch (err) {
    console.error('Error creating test file:', err);
    process.exit(1);
}

async function testCertificateParsing() {
    console.log('\n=== CERTIFICATE PARSING TEST ===\n');
    
    try {
        // Initialize the services
        const ocrService = new CertificateOCRService();
        const scorer = new FarmerCertificateScorer();
        
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
            ocrText = sampleCertificateText;
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
        
        console.log('STEP 4: Recommendations');
        console.log('-----------------------');
        const recommendations = scorer.generateRecommendations(
            features, 
            scoreResult.score, 
            scoreResult.components
        );
        console.log('Recommendations:');
        recommendations.forEach((rec, idx) => {
            console.log(`${idx+1}. ${rec}`);
        });
        console.log('-----------------------\n');
        
        console.log('STEP 5: Final Certificate Details');
        console.log('-----------------------');
        console.log(JSON.stringify(scoreResult.features, null, 2));
        
        // Final parsed certificate data that would be stored in the database
        console.log('\nFINAL PARSED CERTIFICATE DATA:');
        console.log('-----------------------');
        const finalOutput = {
            certificate_score: scoreResult.score,
            grade: scoreResult.grade,
            details: scoreResult.features,
            recommendations
        };
        console.log(JSON.stringify(finalOutput, null, 2));
        
    } catch (error) {
        console.error('Error during certificate parsing test:', error);
    } finally {
        // Clean up the test file
        try {
            fs.unlinkSync(mockCertificatePath);
            console.log('\nCleanup: Test certificate file removed.');
        } catch (err) {
            console.error('Error removing test file:', err);
        }
    }
}

testCertificateParsing();