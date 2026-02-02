import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import CertificateProcessingService from '../services/CertificateProcessingService.js';
import Farm from '../models/Farm.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const certificateService = new CertificateProcessingService();

/**
 * Upload and process a certificate file
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const uploadCertificate = async (req, res) => {
  try {
    const { farmId } = req.params;
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No certificate file uploaded' 
      });
    }

    // Check if farm exists and user has permission
    const farm = await Farm.findById(farmId);
    if (!farm) {
      // Clean up uploaded file
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ 
        success: false,
        message: 'Farm not found' 
      });
    }

    // Verify that the current user owns this farm
    if (farm.ownerId.toString() !== req.user._id.toString()) {
      // Clean up uploaded file
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(403).json({ 
        success: false,
        message: 'You do not have permission to upload certificates to this farm' 
      });
    }

    try {
      // Process the certificate
      const certificateData = await certificateService.processCertificate(req.file.path);
      
      // Add the certificate to the farm
      if (!farm.certificates) {
        farm.certificates = [];
      }
      
      farm.certificates.push({
        file: path.basename(req.file.path),
        uploadDate: new Date(),
        score: certificateData.score,
        grade: certificateData.grade,
        details: certificateData.details,
        isPGSCertificate: certificateData.isPGSCertificate,
        authorizationInfo: certificateData.authorizationInfo,
        scoreComponents: certificateData.scoreComponents
      });
      
      // Update the overall certification score to the highest score
      const highestScore = Math.max(
        farm.certificationScore || 0,
        certificateData.score || 0
      );
      
      farm.certificationScore = highestScore;
      
      // Update the farm's certifications array if not already present
      if (certificateData.details.certificateType && 
          (!farm.certifications || !farm.certifications.includes(certificateData.details.certificateType))) {
        farm.certifications = [
          ...(farm.certifications || []),
          certificateData.details.certificateType
        ];
      }
      
      await farm.save();
      
      // Return success response with processed certificate data
      return res.status(201).json({
        success: true,
        message: 'Certificate uploaded and processed successfully',
        certificate: {
          ...certificateData,
          _id: farm.certificates[farm.certificates.length - 1]._id
        }
      });
    } catch (processingError) {
      console.error('Certificate processing error:', processingError);
      
      // If processing fails, still store the certificate file reference
      const basicCertificateData = {
        file: path.basename(req.file.path),
        uploadDate: new Date(),
        processingError: processingError.message || 'Failed to process certificate'
      };
      
      if (!farm.certificates) {
        farm.certificates = [];
      }
      
      farm.certificates.push(basicCertificateData);
      await farm.save();
      
      // Return partial success with error details
      return res.status(207).json({
        success: false,
        message: 'Certificate uploaded but processing failed',
        error: processingError.message,
        certificate: basicCertificateData
      });
    }
  } catch (err) {
    console.error('Certificate upload error:', err);
    
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    return res.status(500).json({ 
      success: false,
      message: 'Error uploading certificate',
      error: err.message 
    });
  }
};
  
/**
 * Get all certificates for a farm
 */
/**
 * Get all certificates for a farm
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const getFarmCertificates = async (req, res) => {
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
};
  
  /**
   * Delete a certificate from a farm
   */
/**
 * Delete a certificate from a farm
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const deleteCertificate = async (req, res) => {
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
    const filePath = path.join('uploads/certificates', filename);
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
};

/**
 * Reprocess an existing certificate: re-run OCR and scoring on the stored file
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const reprocessCertificate = async (req, res) => {
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

    // Reprocess the certificate using the certificate service
    try {
      const certificateData = await certificateService.processCertificate(filePath);
      
      // Update certificate with new data
      const certIndex = farm.certificates.findIndex(c => c._id.toString() === certificateId);
      if (certIndex !== -1) {
        farm.certificates[certIndex] = {
          ...farm.certificates[certIndex],
          score: certificateData.score,
          grade: certificateData.grade,
          details: certificateData.details,
          isPGSCertificate: certificateData.isPGSCertificate,
          authorizationInfo: certificateData.authorizationInfo,
          scoreComponents: certificateData.scoreComponents,
          reprocessedAt: new Date()
        };
      }

      // Recalculate farm overall score
      farm.certificationScore = farm.certificates.length > 0 
        ? Math.max(...farm.certificates.map(c => c.score || 0))
        : 0;

      await farm.save();

      return res.status(200).json({
        success: true,
        message: 'Certificate reprocessed successfully',
        certificate: farm.certificates[certIndex],
        certificationScore: farm.certificationScore
      });
    } catch (processingError) {
      console.error('Certificate reprocessing error:', processingError);
      return res.status(400).json({ 
        success: false, 
        message: 'Failed to reprocess certificate', 
        error: processingError.message 
      });
    }
  } catch (error) {
    console.error('Failed to reprocess certificate:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to reprocess certificate', 
      error: error.message 
    });
  }
};