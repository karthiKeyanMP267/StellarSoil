# Farmer Certificate Validation and Scoring System

This system implements OCR-based certificate validation and scoring for farmers, allowing their products to be given priority in search results based on their certification scores.

## Overview

The certificate validation system provides a way to:

1. Upload and process farm certificates using OCR
2. Score certificates based on multiple factors
3. Boost product visibility based on certification scores
4. Provide transparency to consumers about farm certifications

## Features

- **OCR Processing**: Extract text from PDF and image certificates
- **Certificate Scoring**: Evaluate certificates based on type, validity, completeness, farm size, and organic status
- **Search Integration**: Products from farms with higher certification scores appear first in search results
- **Automatic Recommendations**: Provides recommendations for improving certification scores

## Directory Structure

```
server/
  ├── services/
  │   ├── certificate/
  │   │   └── FarmerCertificateScorer.js
  │   └── ocr/
  │       └── CertificateOCRService.js
  ├── controllers/
  │   └── certificateController.js
  ├── routes/
  │   └── certificateRoutes.js
  └── data/
      └── farm_size_categories.csv
```

## Installation Requirements

The system requires the following dependencies:

1. **Tesseract OCR**: For text extraction from images
   - Windows: Download and install from [Tesseract GitHub](https://github.com/UB-Mannheim/tesseract/wiki)
   - Linux: `sudo apt-get install tesseract-ocr`
   - macOS: `brew install tesseract`

2. **ImageMagick**: For PDF to image conversion
   - Windows: Download and install from [ImageMagick Website](https://imagemagick.org/script/download.php)
   - Linux: `sudo apt-get install imagemagick`
   - macOS: `brew install imagemagick`

3. **Node.js Dependencies**:
   ```bash
   npm install pdf-parse
   ```

## Usage

### API Endpoints

#### Upload Certificate

```
POST /api/certificates/:farmId/upload
```

- Requires authentication
- Upload a certificate image or PDF
- Returns certificate score and details

#### Get Farm Certificates

```
GET /api/certificates/:farmId
```

- Get all certificates for a farm
- Returns list of certificates with scores and details

#### Delete Certificate

```
DELETE /api/certificates/:farmId/:certificateId
```

- Requires authentication
- Deletes a certificate from a farm

### Product Search with Certification Scoring

When searching for products, you can now use these additional parameters:

```
GET /api/products/search?minCertScore=70&sortByCertScore=true
```

- `minCertScore`: Filter products from farms with at least this certification score
- `sortByCertScore`: Sort results by certification score (highest first)

### Featured Certified Products

Get products from farms with top certification scores:

```
GET /api/products/top-certified?limit=10&category=vegetables
```

## Certificate Scoring Criteria

Certificates are scored based on multiple weighted factors:

1. **Certificate Type** (40%):
   - Government certifications like NPOP and APEDA score highest
   - International certifications like Global GAP score well
   - Community certifications like PGS get medium scores

2. **Validity** (25%):
   - Current certificates with long validity remaining score highest
   - Expired certificates get a score of 0

3. **Completeness** (20%):
   - Based on whether all required fields are present
   - Required fields: certificate number, issuer, farmer name, validity date

4. **Farm Size** (10%):
   - Smaller farms receive a scoring boost to support small farmers
   - Based on Indian agricultural land holding categories

5. **Organic Status** (5%):
   - Organic certification receives full points

The final score is calculated as a weighted average and then adjusted by a farm size multiplier.

## Farm Size Categories

The system uses the following farm size categories (as per Indian agricultural norms):

| Category    | Size Range (hectares) | Multiplier |
|-------------|----------------------|------------|
| Marginal    | 0-1                  | 1.1        |
| Small       | 1-2                  | 1.05       |
| SemiMedium  | 2-4                  | 1.0        |
| Medium      | 4-10                 | 0.95       |
| Large       | 10+                  | 0.9        |

## Certificate Types Recognized

The system can recognize and score various Indian and international certificates:

| Certificate | Name | Score | Authority |
|-------------|------|-------|-----------|
| NPOP | NPOP Organic | 95 | Government |
| APEDA | APEDA Organic | 95 | Government |
| PGS | PGS Organic | 85 | Community |
| TNOCD | TNOCD Organic | 90 | State Agency |
| AGMARK | Agmark | 80 | Government |
| INDGAP | IndGAP | 85 | Accredited Private |
| GLOBALGAP | Global GAP | 90 | International |
| BHARATGAP | Bharat GAP | 80 | Government |
| FCAC | Farmer Capacity Assessment | 70 | Government |
| SEED | Seed Certification | 75 | Government |
| FAIRTRADE | Fair Trade | 70 | International |
| RAINFOREST | Rainforest Alliance | 80 | International |
| ISO | ISO Certified | 90 | International |

## Integration with Farm Profile

The certificate score is saved in the farm profile and used to prioritize products in search results. When consumers search for products, they can now see products from farms with higher certification scores first.