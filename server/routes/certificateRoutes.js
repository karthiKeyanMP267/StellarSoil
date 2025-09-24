const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
  '/:farmId/upload',
  authMiddleware.protect, // Must be logged in
  upload.single('certificate'), // Single file upload
  certificateController.uploadCertificate
);

// Get all certificates for a farm
router.get(
  '/:farmId',
  certificateController.getFarmCertificates
);

// Delete a certificate from a farm
router.delete(
  '/:farmId/:certificateId',
  authMiddleware.protect, // Must be logged in
  certificateController.deleteCertificate
);

// Reprocess a certificate (re-run OCR & scoring)
router.post(
  '/:farmId/:certificateId/reprocess',
  authMiddleware.protect,
  certificateController.reprocessCertificate
);

module.exports = router;