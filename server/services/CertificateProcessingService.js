import CertificateOCRService from './ocr/CertificateOCRService.js';
import FarmerCertificateScorer from './certificate/FarmerCertificateScorer.js';
import PGSCertificateExtension from './certificate/PGSCertificateExtension.js';
import fs from 'fs';
import path from 'path';

/**
 * Service to process and score farm certificates
 * Handles OCR, feature extraction, scoring, and formatting of results
 */
class CertificateProcessingService {
  constructor() {
    this.ocrService = new CertificateOCRService();
    this.scorer = new FarmerCertificateScorer();
  }

  /**
   * Process a certificate file and extract its features and score
   * @param {string} certificateFilePath - Path to the certificate image/PDF file
   * @returns {Object} Certificate processing results
   */
  async processCertificate(certificateFilePath) {
    try {
      // Basic checks
      if (!certificateFilePath || !fs.existsSync(certificateFilePath)) {
        throw new Error('Certificate file not found');
      }

      // Step 1: Process with OCR
      const ocrText = await this.ocrService.processCertificate(certificateFilePath);
      if (!ocrText || ocrText.length < 20) {
        throw new Error('OCR processing failed or extracted text too short');
      }

      // Step 2: Determine certificate type and extract features
      let features;
      let scoreResult;
      let isPGSAuth = false;

      // Check if it's a PGS Authorization certificate
      if (ocrText.includes('Certificate of Authorization') && 
          (ocrText.includes('PGS-India') || ocrText.includes('PGS India'))) {
        isPGSAuth = true;
        features = PGSCertificateExtension.extractPGSAuthorizationFeatures(ocrText);
        scoreResult = PGSCertificateExtension.scorePGSAuthorizationCertificate(features);
      } else {
        // Regular farmer certificate
        features = this.scorer.extractCertificateFeatures(ocrText);
        scoreResult = this.scorer.calculateCertificateScore(features);
      }

      // Step 3: Format the result for storage
      const result = {
        file: path.basename(certificateFilePath),
        uploadDate: new Date(),
        score: scoreResult.score,
        grade: scoreResult.grade,
        details: {
          certificateType: isPGSAuth 
            ? scoreResult.features.certificateType 
            : (scoreResult.features.certificateType || 'Unknown'),
          issuer: isPGSAuth
            ? scoreResult.features.issuer 
            : (scoreResult.features.issuer || null),
          validUntil: isPGSAuth 
            ? scoreResult.features.validUntil 
            : (scoreResult.features.validUntil || null),
          farmerName: isPGSAuth 
            ? scoreResult.features.organization 
            : (scoreResult.features.farmerName || null),
          farmLocation: isPGSAuth
            ? scoreResult.features.region
            : (scoreResult.features.location || null),
          farmSize: isPGSAuth 
            ? null
            : (scoreResult.features.farmSize || null),
          isOrganic: isPGSAuth 
            ? true
            : (scoreResult.features.isOrganic || false)
        },
        // Special fields for PGS certificates
        isPGSCertificate: isPGSAuth,
        authorizationInfo: isPGSAuth ? {
          authorizationType: features.authorizationType || null,
          authorizationNumber: features.authorizationNumber || null,
          maskedAuthNumber: features.authorizationNumber 
            ? PGSCertificateExtension.maskAuthorizationNumber(features.authorizationNumber)
            : null,
          validityPeriod: features.validityPeriod || null,
        } : null,
        // Save score components for debugging/display
        scoreComponents: Object.entries(scoreResult.components).map(([name, component]) => ({
          name,
          score: component.score,
          weight: component.weight,
          reason: component.reason
        }))
      };

      // Remove null fields for cleaner storage
      this.cleanObject(result.details);
      
      if (result.authorizationInfo) {
        this.cleanObject(result.authorizationInfo);
      }
      
      return result;
    } catch (err) {
      console.error('Certificate processing error:', err);
      throw new Error(`Failed to process certificate: ${err.message}`);
    }
  }

  /**
   * Clean an object by removing null/undefined/empty values
   * @param {Object} obj - The object to clean
   */
  cleanObject(obj) {
    if (!obj) return;
    
    Object.keys(obj).forEach(key => {
      if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
        delete obj[key];
      }
    });
  }
}

export default CertificateProcessingService;