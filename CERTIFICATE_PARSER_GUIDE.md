# Certificate Parser Tool - Testing Guide

This document explains how to run and test the certificate parsing functionality used in StellarSoil for extracting and scoring farmer certificates.

## Overview

The certificate parser consists of two main components:

1. **OCR Service** - Extracts text from certificate images/PDFs
2. **Certificate Scorer** - Analyzes the extracted text to score certificates

The scoring system helps farmers understand the value and validity of their certifications in the marketplace, and provides recommendations for improvement.

## Running the Test Script

To test certificate parsing functionality:

```bash
# Navigate to the server directory
cd server

# Run the enhanced test script
node test-certificate-parser-enhanced.js
```

This will demonstrate the certificate processing workflow using sample certificate text from multiple certification types:

- NPOP Organic Certification
- IndGAP Certification
- PGS Organic Certification

## What the Parser Extracts

The certificate parser extracts the following information:

- **Certificate Type**: NPOP, PGS, IndGAP, GlobalGAP, etc.
- **Certificate Number**: Unique identifier
- **Issuing Authority**: Organization that issued the certificate
- **Validity Date**: Expiration date of certificate
- **Farmer Name**: Name of the certificate holder
- **Farm Location**: Location details of the farm
- **Farm Size**: Size of the farm with units (hectares, acres, etc.)
- **Crops/Products**: What products are certified
- **Organic Status**: Whether it's an organic certification

## Scoring Components

Each certificate is scored based on 5 components:

1. **Certificate Type** (40%): Higher value for government and internationally recognized certifications
2. **Validity** (25%): Based on how long until expiration
3. **Completeness** (20%): Whether all required fields are present
4. **Farm Size** (10%): Based on farm size category
5. **Organic Status** (5%): Whether it's an organic certification

## Grade Scale

Certificates receive a grade based on their total score:

- **A+**: 90-100
- **A**: 80-89
- **B**: 70-79
- **C**: 60-69
- **D**: 50-59
- **F**: Below 50

## Technical Implementation

The system consists of these main components:

1. `CertificateOCRService.js` - Handles OCR processing of certificates
2. `FarmerCertificateScorer.js` - Analyzes and scores the certificate text

### Adding New Certificate Types

To add support for new certificate types, update the `certificateTypes` object in `FarmerCertificateScorer.js`:

```javascript
this.certificateTypes = {
  // Add new certificate type
  "NEW_CERT_TYPE": { 
    name: "New Certificate Type", 
    score: 85, 
    authority: "Issuing Authority Type" 
  },
  // Existing types...
};
```

## Dependencies

- **OCR**: Tesseract.js for text extraction from images
- **PDF Processing**: pdf-parse for extracting text from PDFs