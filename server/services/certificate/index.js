/**
 * Certificate System - Index Module
 * Exports all components of the certificate validation system
 */

const CertificateOCRService = require('../ocr/CertificateOCRService');
const FarmerCertificateScorer = require('./FarmerCertificateScorer');

module.exports = {
  CertificateOCRService: new CertificateOCRService(),
  FarmerCertificateScorer: new FarmerCertificateScorer()
};