# Certificate Parser User Guide

## Overview
The StellarSoil Certificate Parser is designed to analyze and score various types of agricultural certificates, with special emphasis on PGS (Participatory Guarantee System) certificates. The system extracts key information from certificate images and provides a quality score that can be used to evaluate the credential's authenticity and value.

## Features
- **OCR Processing**: Extract text from certificate images (requires Tesseract OCR installation)
- **Information Extraction**: Identify certificate numbers, issuers, validity dates, and more
- **Certificate Scoring**: Calculate a quality score based on certificate type, validity, completeness, etc.
- **Privacy Protection**: Mask sensitive certificate numbers for display
- **Multiple Certificate Types**: Support for NPOP, IndGAP, PGS certificates and more
- **Special PGS Handling**: Dedicated processing for PGS Authorization certificates

## Supported Certificate Types
1. **NPOP Organic Certificate**: Government-issued organic certification
2. **IndGAP Certificate**: Quality Council of India certification for GAP
3. **PGS Organic Certificate**: Participatory Guarantee System farmer certificates
4. **PGS Authorization Certificate**: PGS Regional Council authorization
5. **PGS Regional Council Certificate**: State authority certification

## Usage
Run the certificate parser with a certificate image:
```
node server/test-certificate-parser-enhanced.js path/to/certificate-image.jpg
```

### Example Output
```
=== CERTIFICATE PARSING TEST ===

==== TESTING USER PROVIDED CERTIFICATE: certificate_example.jpg ====

STEP 1: OCR Processing
-----------------------
Processing file: certificate_example.jpg
OCR processing successful!

STEP 2: Feature Extraction
-----------------------
Detected a PGS Authorization Certificate
Extracted PGS Authorization Features:
{
  "certificateType": "PGS",
  "authorizationType": "Regional Council",
  "authorizationNumber": "PGSI/N(PU)-1728",
  "authorizationDate": "09-06-2016",
  "validityPeriod": 3,
  "expiryDate": "09-06-2019",
  ...
}

STEP 3: Score Calculation
-----------------------
Certificate Score: 69
Grade: C

Authorization Number (Masked): PGS******728

Score Components:
- certificateType: 95 (weight: 0.25) - PGS-India Government Authorization
- validity: 0 (weight: 0.3) - Certificate expired
- authenticity: 100 (weight: 0.25) - Government-issued with authorization number
- completeness: 100 (weight: 0.2) - 4 of 4 required fields present

STEP 4: Final Certificate Details
-----------------------
{
  "certificateType": "PGS-India Regional Council",
  "authorizationNumber": "PGSI/N(PU)-1728",
  "maskedAuthNumber": "PGS******728",
  "issuer": "PGS-India Secretariat, Government of India",
  "validFrom": "09-06-2016",
  "validUntil": "09-06-2019",
  "organization": "Kheti Virasat Mission, Jaitu-Faridkot (Punjab)-151202",
  "region": "PGS-India",
  "scope": "General",
  "isGovernmentIssued": true
}
```

## Security Features
For privacy protection, certificate numbers are masked when displayed, showing only:
- First 3-4 characters
- Last 2-3 characters
- Middle characters replaced with asterisks (*)

Example: `PGSI/N(PU)-1728` becomes `PGS******728`

## System Requirements
- Node.js environment
- Optional: Tesseract OCR for image processing (https://github.com/tesseract-ocr/tesseract)