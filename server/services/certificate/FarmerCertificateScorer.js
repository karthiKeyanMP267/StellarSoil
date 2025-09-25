import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

/**
 * FarmerCertificateScorer - A scoring system for farmer certificates based on Indian 
 * certification standards and practices.
 */
class FarmerCertificateScorer {
  constructor() {
    this.certificateTypes = {
      "NPOP": { name: "NPOP Organic", score: 95, authority: "Government" },
      "APEDA": { name: "APEDA Organic", score: 95, authority: "Government" },
      "PGS": { name: "PGS Organic", score: 85, authority: "Community" },
      "TNOCD": { name: "TNOCD Organic", score: 90, authority: "State Agency" },
      "AGMARK": { name: "Agmark", score: 80, authority: "Government" },
      "INDGAP": { name: "IndGAP", score: 85, authority: "Accredited Private" },
      "GLOBALGAP": { name: "Global GAP", score: 90, authority: "International" },
      "BHARATGAP": { name: "Bharat GAP", score: 80, authority: "Government" },
      "FCAC": { name: "Farmer Capacity Assessment", score: 70, authority: "Government" },
      "SEED": { name: "Seed Certification", score: 75, authority: "Government" },
      "FAIRTRADE": { name: "Fair Trade", score: 70, authority: "International" },
      "RAINFOREST": { name: "Rainforest Alliance", score: 80, authority: "International" },
      "ISO": { name: "ISO Certified", score: 90, authority: "International" },
    };
    
    this.farmSizeCategories = this.loadFarmSizeCategories();
  }

  /**
   * Loads farm size categories and their score multipliers from CSV
   */
  loadFarmSizeCategories() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const categoriesPath = path.join(__dirname, '../../data/farm_size_categories.csv');
    const categories = {};
    
    try {
      if (fs.existsSync(categoriesPath)) {
        const data = fs.readFileSync(categoriesPath, 'utf8');
        const rows = data.trim().split('\n');
        // Skip header
        for (let i = 1; i < rows.length; i++) {
          const [category, sizeRange, multiplier] = rows[i].split(',');
          const [min, max] = sizeRange.split('-');
          categories[category.trim()] = {
            minSize: parseFloat(min),
            maxSize: max === '+' ? Infinity : parseFloat(max),
            multiplier: parseFloat(multiplier)
          };
        }
      } else {
        // Default categories if file doesn't exist
        categories.Marginal = { minSize: 0, maxSize: 1, multiplier: 1.1 };
        categories.Small = { minSize: 1, maxSize: 2, multiplier: 1.05 };
        categories.SemiMedium = { minSize: 2, maxSize: 4, multiplier: 1.0 };
        categories.Medium = { minSize: 4, maxSize: 10, multiplier: 0.95 };
        categories.Large = { minSize: 10, maxSize: Infinity, multiplier: 0.9 };
      }
      return categories;
    } catch (error) {
      console.error('Error loading farm size categories:', error);
      // Return default categories
      return {
        Marginal: { minSize: 0, maxSize: 1, multiplier: 1.1 },
        Small: { minSize: 1, maxSize: 2, multiplier: 1.05 },
        SemiMedium: { minSize: 2, maxSize: 4, multiplier: 1.0 },
        Medium: { minSize: 4, maxSize: 10, multiplier: 0.95 },
        Large: { minSize: 10, maxSize: Infinity, multiplier: 0.9 }
      };
    }
  }

  /**
   * Extracts certificate features from the OCR text
   */
  extractCertificateFeatures(extractedText) {
    // Keep both original and normalized versions
    const originalText = extractedText || '';
    const text = originalText.toLowerCase();
    
    // Initialize features object
    const features = {
      certificateType: null,
      certificateNumber: null,
      issuer: null,
      validityDate: null,
      farmerName: null,
      farmSize: null,
      farmSizeUnit: null,
      location: null,
      crops: [],
      organicStatus: false,
      detectedKeywords: []
    };
    
    // Extract certificate type
    for (const key in this.certificateTypes) {
      if (text.includes(key.toLowerCase()) || text.includes(this.certificateTypes[key].name.toLowerCase())) {
        features.certificateType = key;
        features.detectedKeywords.push(key);
        break;
      }
    }
    
    // Extract certificate number using regex patterns
    const certificatePatterns = [
      /certificate\s*no\s*[:\-]?\s*([A-Za-z0-9\/\-_]+)/i,
      /certificate\s*number\s*[:\-]?\s*([A-Za-z0-9\/\-_]+)/i,
      /cert[.]?\s*no\s*[:\-]?\s*([A-Za-z0-9\/\-_]+)/i,
      /registration\s*no\s*[:\-]?\s*([A-Za-z0-9\/\-_]+)/i,
      /\b([A-Z]{2,}\/[A-Z0-9]{2,}\/\d{2,}\/[A-Z0-9]{2,}\/\d{2,})\b/
    ];
    
    for (const pattern of certificatePatterns) {
      const match = originalText.match(pattern);
      if (match && match[1]) {
        features.certificateNumber = match[1];
        break;
      }
    }
    
    // Extract validity date
    const validityPatterns = [
      /valid\s*(?:until|till|upto|up\s*to)\s*[:\-]?\s*(\d{1,2}[-\/\.]\d{1,2}[-\/\.]\d{2,4}|\d{4}[-\/\.]\d{1,2}[-\/\.]\d{1,2}|\d{1,2}\s*[A-Za-z]{3,}\s*\d{2,4})/i,
      /expiry\s*date\s*[:\-]?\s*(\d{1,2}[-\/\.]\d{1,2}[-\/\.]\d{2,4}|\d{4}[-\/\.]\d{1,2}[-\/\.]\d{1,2}|\d{1,2}\s*[A-Za-z]{3,}\s*\d{2,4})/i,
      /valid\s*from\s*[:\-]?\s*[^\n\r]*?\s*(?:to|till|until)\s*[:\-]?\s*(\d{1,2}[-\/\.]\d{1,2}[-\/\.]\d{2,4}|\d{4}[-\/\.]\d{1,2}[-\/\.]\d{1,2}|\d{1,2}\s*[A-Za-z]{3,}\s*\d{2,4})/i,
      /valid\s*for\s*[:\-]?\s*(\d+)\s*years?/i
    ];
    
    for (const pattern of validityPatterns) {
      const match = originalText.match(pattern);
      if (match && match[1]) {
        features.validityDate = match[1];
        break;
      }
    }
    
    // Extract issuer
    const issuerPatterns = [
      /issued\s*by\s*[:\-]?\s*([^,\n\r]+)/i,
      /certifying\s*agency\s*[:\-]?\s*([^,\n\r]+)/i,
      /certification\s*body\s*[:\-]?\s*([^,\n\r]+)/i
    ];
    
    for (const pattern of issuerPatterns) {
      const match = originalText.match(pattern);
      if (match && match[1]) {
        features.issuer = match[1].trim();
        break;
      }
    }
    
    // Extract farmer name
    const namePatterns = [
      /farmer\s*name\s*[:\-]?\s*([^,\n\r]+)/i,
      /name\s*[:\-]?\s*([^,\n\r]+)/i,
      /producer\s*[:\-]?\s*([^,\n\r]+)/i
    ];
    
    for (const pattern of namePatterns) {
      const match = originalText.match(pattern);
      if (match && match[1]) {
        features.farmerName = match[1].trim();
        break;
      }
    }
    
    // Extract farm size
    const sizePatterns = [
      /farm\s*(?:size|area)\s*[:\-]?\s*(\d+\.?\d*)\s*(hectares?|hectare|acres?|acre|bigha|katha)/i,
      /area\s*[:\-]?\s*(\d+\.?\d*)\s*(hectares?|hectare|acres?|acre|bigha|katha)/i
    ];
    
    for (const pattern of sizePatterns) {
      const match = originalText.match(pattern);
      if (match && match[1] && match[2]) {
        features.farmSize = parseFloat(match[1]);
        features.farmSizeUnit = match[2].toLowerCase().replace(/s$/, ''); // Remove plural 's'
        break;
      }
    }
    
    // Check for organic status
    features.organicStatus = text.includes('organic');
    
    // Extract location
    const locationPatterns = [
      /location\s*[:\-]?\s*([^\n\r]+)/i,
      /address\s*[:\-]?\s*([^\n\r]+)/i,
      /district\s*[:\-]?\s*([^\n\r]+)/i
    ];
    
    for (const pattern of locationPatterns) {
      const match = originalText.match(pattern);
      if (match && match[1]) {
        features.location = match[1].trim();
        break;
      }
    }
    
    // Extract crops
    const cropPatterns = [
      // Capture crops/products line but stop before common trailing labels like 'and area(s) of', 'area of', 'area', etc.
      /crop[s]?\s*[:\-]?\s*([^\n\r]*?)(?=\s*(?:and\s+area\(s\)\s+of|and\s+area\s+of|area\(s\)\s+of|area\s+of|area)\b|$)/i,
      /product[s]?\s*[:\-]?\s*([^\n\r]*?)(?=\s*(?:and\s+area\(s\)\s+of|and\s+area\s+of|area\(s\)\s+of|area\s+of|area)\b|$)/i
    ];
    
    for (const pattern of cropPatterns) {
      const match = originalText.match(pattern);
      if (match && match[1]) {
        const cleaned = match[1]
          .replace(/\bof\b.*$/i, '') // remove trailing fragments after 'of' if any
          .replace(/\(s\)/g, '')
          .replace(/\s{2,}/g, ' ')
          .trim();
        features.crops = cleaned
          .split(/[,&\/]/)
          .map(crop => crop.trim())
          .filter(crop => crop.length > 0);
        break;
      }
    }
    
    return features;
  }

  /**
   * Calculate validity score based on expiry date
   */
  calculateValidityScore(validityDate) {
    if (!validityDate) {
      return [50, "Unknown validity"];
    }
    
    let expiryDate;
    let message;
    
    // Handle different formats
    if (validityDate.match(/^\d+$/)) {
      // If it's just a number (years)
      const years = parseInt(validityDate);
      const today = new Date();
      expiryDate = new Date();
      expiryDate.setFullYear(today.getFullYear() + years);
      message = `Valid for ${years} years`;
    } else {
      // Try to parse date
      const dateParts = validityDate.split(/[-\/\.]/);
      
      // Different date formats
      let day, month, year;
      if (dateParts.length === 3) {
        // Handle different formats (DD-MM-YYYY, MM-DD-YYYY, YYYY-MM-DD)
        if (dateParts[0].length === 4) {
          // YYYY-MM-DD
          year = parseInt(dateParts[0]);
          month = parseInt(dateParts[1]) - 1;
          day = parseInt(dateParts[2]);
        } else if (dateParts[2].length === 4 || dateParts[2].length === 2) {
          // DD-MM-YYYY or MM-DD-YYYY (assuming DD-MM-YYYY for Indian context)
          day = parseInt(dateParts[0]);
          month = parseInt(dateParts[1]) - 1;
          
          // Handle 2-digit year
          year = parseInt(dateParts[2]);
          if (year < 100) {
            year += year < 50 ? 2000 : 1900;
          }
        }
        
        expiryDate = new Date(year, month, day);
      } else {
        return [50, "Invalid date format"];
      }
      
      message = `Valid until ${expiryDate.toLocaleDateString()}`;
    }
    
    // Calculate score based on time remaining
    const today = new Date();
    const timeRemaining = expiryDate - today;
    
    if (timeRemaining <= 0) {
      return [0, "Expired"];
    }
    
    const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const monthsRemaining = daysRemaining / 30;
    
    // Score calculation:
    // - 1 year or more remaining: 100
    // - 9-12 months remaining: 90
    // - 6-9 months remaining: 80
    // - 3-6 months remaining: 70
    // - 1-3 months remaining: 60
    // - Less than 1 month: 50
    
    let score;
    if (monthsRemaining >= 12) {
      score = 100;
    } else if (monthsRemaining >= 9) {
      score = 90;
    } else if (monthsRemaining >= 6) {
      score = 80;
    } else if (monthsRemaining >= 3) {
      score = 70;
    } else if (monthsRemaining >= 1) {
      score = 60;
    } else {
      score = 50;
    }
    
    return [score, message];
  }

  /**
   * Get farm size category based on size in hectares
   */
  getFarmSizeCategory(farmSize) {
    // Convert to hectares if needed
    let sizeInHectares = farmSize;
    
    if (sizeInHectares <= 0) {
      return "Unknown";
    }
    
    for (const category in this.farmSizeCategories) {
      const { minSize, maxSize } = this.farmSizeCategories[category];
      if (sizeInHectares >= minSize && sizeInHectares < maxSize) {
        return category;
      }
    }
    
    return "Large"; // Default if no category matched
  }

  /**
   * Calculate certificate score based on extracted features
   */
  calculateCertificateScore(features) {
    // Initialize score components
    const scoreComponents = {
      certificateType: { weight: 0.4, score: 0, reason: "Certificate type not recognized" },
      validity: { weight: 0.25, score: 0, reason: "Validity unknown" },
      completeness: { weight: 0.2, score: 0, reason: "Missing required information" },
      farmSize: { weight: 0.1, score: 0, reason: "Farm size unknown" },
      organicStatus: { weight: 0.05, score: 0, reason: "Not organic" }
    };
    
    // 1. Certificate Type Score
    if (features.certificateType && this.certificateTypes[features.certificateType]) {
      const certType = this.certificateTypes[features.certificateType];
      scoreComponents.certificateType.score = certType.score;
      scoreComponents.certificateType.reason = `${certType.name} issued by ${certType.authority}`;
    } else if (features.issuer) {
      // If we have issuer but no recognized certificate type, give partial credit
      scoreComponents.certificateType.score = 50;
      scoreComponents.certificateType.reason = `Unrecognized certificate issued by ${features.issuer}`;
    }
    
    // 2. Validity Score
    const [validityScore, validityMessage] = this.calculateValidityScore(features.validityDate);
    scoreComponents.validity.score = validityScore;
    scoreComponents.validity.reason = validityMessage;
    
    // 3. Completeness Score
    let completenessScore = 0;
    const requiredFields = ['certificateNumber', 'issuer', 'farmerName', 'validityDate'];
    const presentFields = requiredFields.filter(field => features[field] !== null && features[field] !== undefined);
    
    completenessScore = Math.floor((presentFields.length / requiredFields.length) * 100);
    scoreComponents.completeness.score = completenessScore;
    scoreComponents.completeness.reason = `${presentFields.length} of ${requiredFields.length} required fields present`;
    
    // 4. Farm Size Score - favors small farmers
    if (features.farmSize) {
      // Convert to hectares if in acres (approximate)
      let sizeInHectares = features.farmSize;
      if (features.farmSizeUnit === 'acre') {
        sizeInHectares = features.farmSize * 0.404686;
      } else if (features.farmSizeUnit === 'bigha') {
        // Approximate conversion (varies by region)
        sizeInHectares = features.farmSize * 0.16;
      } else if (features.farmSizeUnit === 'katha') {
        // Approximate conversion (varies by region)
        sizeInHectares = features.farmSize * 0.01;
      }
      
      const category = this.getFarmSizeCategory(sizeInHectares);
      const multiplier = this.farmSizeCategories[category]?.multiplier || 1.0;
      
      scoreComponents.farmSize.score = 100;
      scoreComponents.farmSize.reason = `${category} farm (${features.farmSize} ${features.farmSizeUnit})`;
      scoreComponents.farmSize.multiplier = multiplier;
    }
    
    // 5. Organic Status Score
    if (features.organicStatus) {
      scoreComponents.organicStatus.score = 100;
      scoreComponents.organicStatus.reason = "Organic certification detected";
    }
    
    // Calculate final score
    let weightedScore = 0;
    let totalWeight = 0;
    
    for (const component in scoreComponents) {
      const { weight, score } = scoreComponents[component];
      weightedScore += weight * score;
      totalWeight += weight;
    }
    
    // Apply farm size multiplier if available
    let finalScore = weightedScore / totalWeight;
    if (scoreComponents.farmSize.multiplier) {
      finalScore *= scoreComponents.farmSize.multiplier;
    }
    
    // Cap at 100
    finalScore = Math.min(100, finalScore);
    
    // Determine grade
    let grade = "C";
    if (finalScore >= 90) {
      grade = "A+";
    } else if (finalScore >= 80) {
      grade = "A";
    } else if (finalScore >= 70) {
      grade = "B";
    }
    
    return {
      score: Math.round(finalScore),
      grade,
      components: scoreComponents,
      features: {
        certificateNumber: features.certificateNumber || "Unknown",
        certificateType: features.certificateType ? this.certificateTypes[features.certificateType]?.name : "Unknown",
        issuer: features.issuer || "Unknown",
        validUntil: features.validityDate || "Unknown",
        farmerName: features.farmerName || "Unknown",
        farmSize: features.farmSize ? `${features.farmSize} ${features.farmSizeUnit}` : "Unknown",
        location: features.location || "Unknown",
        crops: features.crops.length > 0 ? features.crops.join(", ") : "Unknown",
        isOrganic: features.organicStatus
      }
    };
  }

  /**
   * Generate recommendations based on certificate score and features
   */
  generateRecommendations(features, score, components) {
    const recommendations = [];
    
    if (score < 50) {
      recommendations.push("Certificate reliability is low. Consider obtaining a government-recognized certification.");
      
      if (!features.certificateType) {
        recommendations.push("The certificate type is not recognized. Pursue nationally recognized certifications like NPOP or Agmark.");
      }
      
      if (!features.validityDate) {
        recommendations.push("Certificate validity date is missing or expired. Renew your certification.");
      }
    } else if (score < 70) {
      if (features.certificateType && this.certificateTypes[features.certificateType]?.score < 80) {
        recommendations.push(`Consider upgrading from ${features.certificateType} to a higher-value certification like NPOP or Global GAP.`);
      }
      
      // Safely use completeness score from components if provided
      const completenessScore = components && components.completeness && typeof components.completeness.score === 'number'
        ? components.completeness.score
        : null;
      if (completenessScore !== null && completenessScore < 70) {
        recommendations.push("Ensure your certificate includes all required information including certificate number, issuer details, and validity dates.");
      }
    } else {
      // Good certificate, but maybe improvements
      if (!features.organicStatus) {
        recommendations.push("Consider obtaining organic certification to increase your market value and access premium markets.");
      }
      
      if (features.farmSize) {
        // Convert farm size to hectares for categorization
        let sizeInHectares = features.farmSize;
        if (features.farmSizeUnit === 'acre') {
          sizeInHectares = features.farmSize * 0.404686;
        } else if (features.farmSizeUnit === 'bigha') {
          sizeInHectares = features.farmSize * 0.16;
        } else if (features.farmSizeUnit === 'katha') {
          sizeInHectares = features.farmSize * 0.01;
        }
        const category = this.getFarmSizeCategory(sizeInHectares);
        if (category === "Medium" || category === "Large") {
          recommendations.push("Consider applying for export-oriented certifications to maximize the potential of your larger farm.");
        }
      }
    }
    
    // Always recommend digital record-keeping
    recommendations.push("Maintain digital records of all your certifications and renew them before expiry.");
    
    return recommendations;
  }

  /**
   * Process a certificate OCR text and return the score and analysis
   */
  processCertificate(ocrText) {
    try {
      const features = this.extractCertificateFeatures(ocrText);
      const scoreResult = this.calculateCertificateScore(features);
      const recommendations = this.generateRecommendations(features, scoreResult.score, scoreResult.components);
      
      return {
        success: true,
        certificate_score: scoreResult.score,
        grade: scoreResult.grade,
        details: scoreResult.features,
        score_components: scoreResult.components,
        recommendations
      };
    } catch (error) {
      console.error('Error processing certificate:', error);
      return {
        success: false,
        error: error.message || 'Failed to process certificate',
        certificate_score: 0,
        grade: 'F'
      };
    }
  }
}

export default FarmerCertificateScorer;