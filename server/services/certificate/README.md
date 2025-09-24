# Farm Certification Scoring System

This system provides OCR processing for farm certificates, scoring them based on various factors, and using the scores to enhance product visibility in search results.

## Setup Instructions

### Prerequisites

1. **Tesseract OCR**: Required for extracting text from certificate images.
   - Windows: Download from [UB-Mannheim Tesseract](https://github.com/UB-Mannheim/tesseract/wiki)
   - Linux: `sudo apt-get install tesseract-ocr`
   - macOS: `brew install tesseract`

2. **ImageMagick**: Required for converting PDFs to images.
   - Windows: Download from [ImageMagick Website](https://imagemagick.org/script/download.php)
   - Linux: `sudo apt-get install imagemagick`
   - macOS: `brew install imagemagick`

3. **Node.js Dependencies**:
   ```bash
   cd server/services/certificate
   npm install
   ```

### Installation

1. Run the appropriate setup script for your operating system:
   - Windows: `server\services\certificate\setup.bat`
   - Linux/macOS: `chmod +x server/services/certificate/setup.sh && ./server/services/certificate/setup.sh`

2. Make sure the upload directories exist:
   ```javascript
   const uploadsDir = path.join(__dirname, 'uploads');
   const certificatesDir = path.join(uploadsDir, 'certificates');
   const tempDir = path.join(uploadsDir, 'temp');

   if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
   if (!fs.existsSync(certificatesDir)) fs.mkdirSync(certificatesDir);
   if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
   ```

3. Ensure MongoDB schema has been updated with the latest Farm model.

## Core Components

1. **CertificateOCRService**: Extracts text from certificate images and PDFs.
2. **FarmerCertificateScorer**: Scores certificates based on type, validity, and other factors.
3. **certificateController**: Handles API requests for certificate upload and validation.
4. **productController**: Incorporates certification scores in product searches.
5. **FarmCertificateManager**: React component for uploading and displaying certificates.

## API Endpoints

### Certificate Routes

- `POST /api/certificates/:farmId/upload` - Upload a certificate for a farm
- `GET /api/certificates/:farmId` - Get all certificates for a farm
- `DELETE /api/certificates/:farmId/:certificateId` - Delete a certificate

### Product Search with Certification

- `GET /api/products/search` - Search products with optional certification score filtering
- `GET /api/products/nearby` - Get nearby products with certification score consideration

## Certification Scoring

The certification score is based on:

1. **Certificate Type** (30%): Value of different certification types
   - NPOP Organic: 95 points
   - Global GAP: 90 points
   - APEDA Organic: 90 points
   - PGS Organic: 85 points
   - ...etc.

2. **Validity** (25%): Is the certificate still valid?
   - More than 3 months remaining: 100 points
   - Less than 3 months remaining: Proportional score
   - Expired: 0 points

3. **Completeness** (20%): Are all required fields present?
   - Required fields: certificate number, issuer, farmer name, validity date
   - Optional fields: farm size, crops

4. **Farm Size Bonus** (10%): Small farms get a positive bias
   - Micro farms (< 1 hectare): 1.15× multiplier
   - Small farms (1-2 hectares): 1.10× multiplier
   - Medium farms (2-4 hectares): 1.05× multiplier
   - Large farms (4-10 hectares): 1.00× multiplier
   - Very large farms (> 10 hectares): 0.95× multiplier

5. **Organic Status** (15%): Is the farm organic?
   - Organic: 100 points
   - Non-organic: 0 points

## Search Visibility

- Products from farms with higher certification scores get higher visibility in search results.
- Minimum visibility: 10%
- Maximum visibility: 100%
- Visibility percentage scales linearly with certification score.

## Troubleshooting

1. **OCR Not Working**: 
   - Ensure Tesseract is properly installed and in your PATH.
   - Check for language data files (eng.traineddata).

2. **PDF Processing Issues**: 
   - Verify ImageMagick is correctly installed.
   - Check file permissions on temporary directories.

3. **Certificate Not Being Recognized**: 
   - Make sure the certificate is clearly visible and well-lit.
   - Try scanning at a higher resolution.
   - If it's in a different language, install appropriate Tesseract language data.

## Contributing

To add support for more certificate types, update the `certificateWeights` object in `FarmerCertificateScorer.js` with appropriate values.
