import express from 'express';
import * as certificateController from '../controllers/certificateController.js';
import * as authMiddleware from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configure multer for file upload
const certificateStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/certificates');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const farmId = req.params.farmId;
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `certificate_${farmId}_${timestamp}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 
    'image/png', 
    'image/tiff', 
    'image/bmp', 
    'application/pdf'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, TIFF, BMP and PDF files are allowed.'), false);
  }
};

const upload = multer({ 
  storage: certificateStorage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  }
});

// Upload a certificate for a farm
router.post(
  '/farms/:farmId/certificates',
  authMiddleware.protect, // Must be logged in
  authMiddleware.farmer, // Must be a farmer
  upload.single('certificate'), // Single file upload
  certificateController.uploadCertificate
);

// Get all certificates for a farm
router.get(
  '/farms/:farmId/certificates',
  authMiddleware.protect, // Must be logged in
  certificateController.getFarmCertificates
);

// Delete a certificate from a farm
router.delete(
  '/farms/:farmId/certificates/:certificateId',
  authMiddleware.protect, // Must be logged in
  authMiddleware.farmer, // Must be a farmer
  certificateController.deleteCertificate
);

// Reprocess a certificate (re-run OCR & scoring)
router.post(
  '/farms/:farmId/certificates/:certificateId/reprocess',
  authMiddleware.protect, // Must be logged in
  authMiddleware.farmer, // Must be a farmer
  certificateController.reprocessCertificate
);

export default router;