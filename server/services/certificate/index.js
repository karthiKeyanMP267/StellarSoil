/**
 * Certificate System - Index Module
 * Exports all components of the certificate validation system
 */

import CertificateOCRServiceImport from '../ocr/CertificateOCRService.js';
import FarmerCertificateScorerImport from './FarmerCertificateScorer.js';

export const CertificateOCRService = new CertificateOCRServiceImport();
export const FarmerCertificateScorer = new FarmerCertificateScorerImport();