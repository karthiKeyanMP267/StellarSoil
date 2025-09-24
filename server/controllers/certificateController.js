const path = require('path');
const fs = require('fs');
const CertificateOCRService = require('../services/ocr/CertificateOCRService');
const FarmerCertificateScorer = require('../services/certificate/FarmerCertificateScorer');
const Farm = require('../models/Farm');

/**
 * Controller for handling certificate uploads, validation and scoring
 */
const certificateController = {
  /**
   * Upload a certificate for a farm and process it to get a score
   */
  uploadCertificate: async (req, res) => {
    try {
      const { farmId } = req.params;
      
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          message: 'No certificate file uploaded' 
        });
      }

      // Check if farm exists and user has permission
      const farm = await Farm.findById(farmId);
      if (!farm) {
        return res.status(404).json({ 
          success: false, 
          message: 'Farm not found' 
        });
      }

      // Verify that the current user owns this farm
      if (farm.ownerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
          success: false, 
          message: 'You do not have permission to upload certificates to this farm' 
        });
      }

      const ocrService = new CertificateOCRService();
      const scorer = new FarmerCertificateScorer();
      
      // Process the certificate
      const ocrText = await ocrService.processCertificate(req.file.path);
      const scoreResult = scorer.processCertificate(ocrText);
      
      if (!scoreResult.success) {
        return res.status(400).json({
          success: false,
          message: 'Failed to process certificate',
          error: scoreResult.error
        });
      }
      
      // Save the certificate details to the farm
      farm.certificates = farm.certificates || [];
      farm.certificates.push({
        file: req.file.filename,
        uploadDate: new Date(),
        score: scoreResult.certificate_score,
        grade: scoreResult.grade,
        details: scoreResult.details
      });
      
      // Update the farm's overall certification score
      // Use the highest certificate score if multiple certificates exist
      farm.certificationScore = Math.max(
        farm.certificationScore || 0,
        scoreResult.certificate_score
      );
      
      await farm.save();
      
      // Return the score result
      return res.status(200).json({
        success: true,
        message: 'Certificate processed successfully',
        certificate_score: scoreResult.certificate_score,
        grade: scoreResult.grade,
        details: scoreResult.details,
        recommendations: scoreResult.recommendations
      });
    } catch (error) {
      console.error('Certificate upload failed:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to process certificate',
        error: error.message
      });
    }
  },
  
  /**
   * Get all certificates for a farm
   */
  getFarmCertificates: async (req, res) => {
    try {
      const { farmId } = req.params;
      
      const farm = await Farm.findById(farmId);
      if (!farm) {
        return res.status(404).json({ 
          success: false, 
          message: 'Farm not found' 
        });
      }
      
      return res.status(200).json({
        success: true,
        certificates: farm.certificates || [],
        certificationScore: farm.certificationScore || 0
      });
    } catch (error) {
      console.error('Failed to get farm certificates:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get farm certificates',
        error: error.message
      });
    }
  },
  
  /**
   * Delete a certificate from a farm
   */
  deleteCertificate: async (req, res) => {
    try {
      const { farmId, certificateId } = req.params;
      
      const farm = await Farm.findById(farmId);
      if (!farm) {
        return res.status(404).json({ 
          success: false, 
          message: 'Farm not found' 
        });
      }
      
      // Verify that the current user owns this farm
      if (farm.ownerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
          success: false, 
          message: 'You do not have permission to delete certificates from this farm' 
        });
      }
      
      if (!farm.certificates || farm.certificates.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'No certificates found for this farm' 
        });
      }
      
      // Find the certificate
      const certificateIndex = farm.certificates.findIndex(
        cert => cert._id.toString() === certificateId
      );
      
      if (certificateIndex === -1) {
        return res.status(404).json({ 
          success: false, 
          message: 'Certificate not found' 
        });
      }
      
      // Get the file name to delete
      const filename = farm.certificates[certificateIndex].file;
      
      // Remove the certificate from the array
      farm.certificates.splice(certificateIndex, 1);
      
      // Recalculate the highest certification score
      farm.certificationScore = farm.certificates.length > 0 
        ? Math.max(...farm.certificates.map(cert => cert.score))
        : 0;
      
      await farm.save();
      
      // Delete the file from the file system
      const filePath = path.join(__dirname, '../uploads/certificates', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      return res.status(200).json({
        success: true,
        message: 'Certificate deleted successfully',
        certificationScore: farm.certificationScore
      });
    } catch (error) {
      console.error('Failed to delete certificate:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete certificate',
        error: error.message
      });
    }
  }
};

/**
 * Reprocess an existing certificate: re-run OCR and scoring on the stored file
 */
certificateController.reprocessCertificate = async (req, res) => {
  try {
    const { farmId, certificateId } = req.params;

    const farm = await Farm.findById(farmId);
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    // Ownership check
    if (farm.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You do not have permission to reprocess certificates on this farm' });
    }

    if (!farm.certificates || farm.certificates.length === 0) {
      return res.status(404).json({ success: false, message: 'No certificates found for this farm' });
    }

    const cert = farm.certificates.find(c => c._id.toString() === certificateId);
    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    // Build file path and re-run OCR/scoring
    const filePath = path.join(__dirname, '../uploads/certificates', cert.file);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Stored certificate file is missing' });
    }

    const ocrService = new CertificateOCRService();
    const scorer = new FarmerCertificateScorer();

    const ocrText = await ocrService.processCertificate(filePath);
    const scoreResult = scorer.processCertificate(ocrText);

    if (!scoreResult.success) {
      return res.status(400).json({ success: false, message: 'Failed to process certificate', error: scoreResult.error });
    }

    // Update certificate entry
    cert.score = scoreResult.certificate_score;
    cert.grade = scoreResult.grade;
    cert.details = scoreResult.details;
    cert.reprocessedAt = new Date();

    // Recalculate farm overall score
    farm.certificationScore = farm.certificates.length > 0 
      ? Math.max(...farm.certificates.map(c => c.score || 0))
      : 0;

    await farm.save();

    return res.status(200).json({
      success: true,
      message: 'Certificate reprocessed successfully',
      certificate: cert,
      certificationScore: farm.certificationScore
    });
  } catch (error) {
    console.error('Failed to reprocess certificate:', error);
    return res.status(500).json({ success: false, message: 'Failed to reprocess certificate', error: error.message });
  }
};

module.exports = certificateController;