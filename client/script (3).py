# Let's create a comprehensive certificate scoring system for farmers based on research

import json
import re
import datetime
from typing import Dict, List, Tuple, Any

class FarmerCertificateScorer:
    """
    A comprehensive scoring system for farmer certificates based on Indian government 
    certification standards and practices.
    """
    
    def __init__(self):
        # Define scoring weights for different certificate types
        self.certificate_weights = {
            'organic_farming': {
                'npop_certified': 95,
                'pgs_certified': 85,
                'tnocd_certified': 90,
                'apeda_certified': 95,
                'rainforest_alliance': 80,
                'trustea': 75,
                'bio_suisse': 85,
                'naturland': 80
            },
            'agmark_grading': {
                'grade_1': 90,
                'grade_2': 80,
                'grade_3': 70,
                'special_grade': 95
            },
            'good_agricultural_practices': {
                'indgap_certified': 85,
                'global_gap': 90,
                'bharat_gap': 80
            },
            'farmer_capacity': {
                'fcac_certified': 70,
                'kisan_credit_card': 60,
                'fpo_member': 65,
                'krishi_vigyan_kendra': 60
            },
            'specialty_certificates': {
                'seed_certification': 75,
                'fair_trade': 70,
                'export_certification': 85,
                'iso_certified': 90
            }
        }
        
        # Define semantic scoring criteria
        self.semantic_criteria = {
            'validity_status': {'valid': 100, 'expired': 0, 'pending': 50},
            'issuing_authority_credibility': {
                'government_agency': 100,
                'accredited_private': 80,
                'international_body': 95,
                'unknown': 30
            },
            'certificate_completeness': {
                'complete_info': 100,
                'partial_info': 60,
                'minimal_info': 30
            },
            'farming_practices': {
                'organic': 100,
                'sustainable': 85,
                'conventional_with_certification': 70,
                'conventional': 40
            }
        }
        
        # Define farm size categories (as per Indian classification)
        self.farm_size_weights = {
            'marginal': {'size_range': (0, 1), 'weight': 1.1},      # Up to 1 hectare
            'small': {'size_range': (1, 2), 'weight': 1.05},       # 1-2 hectares  
            'semi_medium': {'size_range': (2, 4), 'weight': 1.0},  # 2-4 hectares
            'medium': {'size_range': (4, 10), 'weight': 0.95},     # 4-10 hectares
            'large': {'size_range': (10, float('inf')), 'weight': 0.9}  # Above 10 hectares
        }

    def extract_certificate_features(self, extracted_text: str) -> Dict[str, Any]:
        """
        Extract relevant features from the OCR-extracted certificate text
        """
        features = {
            'certificate_type': None,
            'issuing_authority': None,
            'validity_date': None,
            'farmer_name': None,
            'farm_size': None,
            'crop_types': [],
            'certification_grade': None,
            'certificate_number': None,
            'organic_status': False,
            'location': None
        }
        
        text_lower = extracted_text.lower()
        
        # Extract certificate type
        if any(keyword in text_lower for keyword in ['organic', 'npop', 'pgs']):
            features['certificate_type'] = 'organic_farming'
            features['organic_status'] = True
        elif any(keyword in text_lower for keyword in ['agmark', 'grading', 'grade']):
            features['certificate_type'] = 'agmark_grading'
        elif any(keyword in text_lower for keyword in ['gap', 'good agricultural']):
            features['certificate_type'] = 'good_agricultural_practices'
        elif any(keyword in text_lower for keyword in ['fcac', 'capacity assessment']):
            features['certificate_type'] = 'farmer_capacity'
        
        # Extract issuing authority
        authorities = {
            'apeda': 'apeda_certified',
            'tnocd': 'tnocd_certified', 
            'tamil nadu organic': 'tnocd_certified',
            'ministry of agriculture': 'government_agency',
            'department of agriculture': 'government_agency',
            'rainforest alliance': 'rainforest_alliance',
            'trustea': 'trustea'
        }
        
        for authority, code in authorities.items():
            if authority in text_lower:
                features['issuing_authority'] = code
                break
        
        # Extract dates (validity)
        date_patterns = [
            r'\d{1,2}[-/]\d{1,2}[-/]\d{4}',
            r'\d{4}[-/]\d{1,2}[-/]\d{1,2}',
            r'\d{1,2}\s+\w+\s+\d{4}'
        ]
        
        for pattern in date_patterns:
            matches = re.findall(pattern, extracted_text)
            if matches:
                features['validity_date'] = matches[-1]  # Take the last date found
                break
        
        # Extract farmer name (usually appears after "name" or "farmer")
        name_pattern = r'(?:name|farmer)[:\s]+([A-Za-z\s]+?)(?:\n|certificate|farm)'
        name_match = re.search(name_pattern, extracted_text, re.IGNORECASE)
        if name_match:
            features['farmer_name'] = name_match.group(1).strip()
        
        # Extract farm size (look for hectare, acre mentions)
        size_pattern = r'(\d+\.?\d*)\s*(hectare|acre|ha)'
        size_match = re.search(size_pattern, text_lower)
        if size_match:
            size = float(size_match.group(1))
            unit = size_match.group(2)
            # Convert acres to hectares if needed
            if unit in ['acre']:
                size = size * 0.4047  # 1 acre = 0.4047 hectares
            features['farm_size'] = size
        
        # Extract certificate number
        cert_num_pattern = r'(?:certificate|cert|reg)\.?\s*(?:no|number)[:\s]*([A-Z0-9/-]+)'
        cert_match = re.search(cert_num_pattern, extracted_text, re.IGNORECASE)
        if cert_match:
            features['certificate_number'] = cert_match.group(1).strip()
        
        # Extract location
        location_pattern = r'(?:district|state|location)[:\s]+([A-Za-z\s]+?)(?:\n|pin|zip)'
        location_match = re.search(location_pattern, extracted_text, re.IGNORECASE)
        if location_match:
            features['location'] = location_match.group(1).strip()
        
        return features

    def calculate_validity_score(self, validity_date: str) -> Tuple[int, str]:
        """
        Calculate validity score based on certificate expiry date
        """
        if not validity_date:
            return 50, "validity_unknown"
        
        try:
            # Try to parse different date formats
            date_formats = ['%d-%m-%Y', '%d/%m/%Y', '%Y-%m-%d', '%d %B %Y']
            cert_date = None
            
            for fmt in date_formats:
                try:
                    cert_date = datetime.datetime.strptime(validity_date, fmt)
                    break
                except ValueError:
                    continue
            
            if not cert_date:
                return 50, "validity_unknown"
            
            current_date = datetime.datetime.now()
            
            if cert_date > current_date:
                # Certificate is valid
                days_remaining = (cert_date - current_date).days
                if days_remaining > 365:
                    return 100, "valid_long_term"
                elif days_remaining > 90:
                    return 90, "valid_medium_term"
                else:
                    return 70, "valid_short_term"
            else:
                # Certificate is expired
                days_expired = (current_date - cert_date).days
                if days_expired <= 30:
                    return 20, "recently_expired"
                else:
                    return 0, "expired"
                    
        except Exception:
            return 50, "validity_unknown"

    def get_farm_size_category(self, farm_size: float) -> str:
        """
        Categorize farm size according to Indian standards
        """
        if not farm_size:
            return 'unknown'
        
        for category, info in self.farm_size_weights.items():
            min_size, max_size = info['size_range']
            if min_size <= farm_size < max_size:
                return category
        return 'large'

    def calculate_certificate_score(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculate comprehensive certificate score based on extracted features
        """
        total_score = 0
        max_possible_score = 0
        scoring_breakdown = {}
        
        # 1. Base Certificate Type Score (40% weight)
        base_weight = 0.4
        certificate_type = features.get('certificate_type')
        issuing_authority = features.get('issuing_authority')
        
        if certificate_type and issuing_authority:
            if certificate_type in self.certificate_weights:
                if issuing_authority in self.certificate_weights[certificate_type]:
                    base_score = self.certificate_weights[certificate_type][issuing_authority]
                    total_score += base_score * base_weight
                    scoring_breakdown['certificate_type_score'] = base_score
                else:
                    # Default score for unknown authority within known type
                    base_score = 60
                    total_score += base_score * base_weight
                    scoring_breakdown['certificate_type_score'] = base_score
            else:
                # Unknown certificate type
                base_score = 40
                total_score += base_score * base_weight
                scoring_breakdown['certificate_type_score'] = base_score
        else:
            base_score = 30
            total_score += base_score * base_weight
            scoring_breakdown['certificate_type_score'] = base_score
        
        max_possible_score += 100 * base_weight
        
        # 2. Validity Score (25% weight)
        validity_weight = 0.25
        validity_score, validity_status = self.calculate_validity_score(features.get('validity_date'))
        total_score += validity_score * validity_weight
        scoring_breakdown['validity_score'] = validity_score
        scoring_breakdown['validity_status'] = validity_status
        max_possible_score += 100 * validity_weight
        
        # 3. Certificate Completeness Score (20% weight)
        completeness_weight = 0.2
        required_fields = ['farmer_name', 'certificate_number', 'issuing_authority', 'validity_date']
        present_fields = sum(1 for field in required_fields if features.get(field))
        completeness_percentage = (present_fields / len(required_fields)) * 100
        
        if completeness_percentage >= 100:
            completeness_score = 100
        elif completeness_percentage >= 75:
            completeness_score = 80
        elif completeness_percentage >= 50:
            completeness_score = 60
        else:
            completeness_score = 30
            
        total_score += completeness_score * completeness_weight
        scoring_breakdown['completeness_score'] = completeness_score
        max_possible_score += 100 * completeness_weight
        
        # 4. Farm Size Multiplier (10% weight)
        farm_size_weight = 0.1
        farm_size = features.get('farm_size')
        farm_category = self.get_farm_size_category(farm_size)
        
        if farm_category != 'unknown':
            size_multiplier = self.farm_size_weights[farm_category]['weight']
            size_score = 100 * size_multiplier
        else:
            size_score = 50  # Default for unknown farm size
            
        total_score += size_score * farm_size_weight
        scoring_breakdown['farm_size_score'] = size_score
        scoring_breakdown['farm_category'] = farm_category
        max_possible_score += 100 * farm_size_weight
        
        # 5. Organic/Sustainable Practices Bonus (5% weight)
        practices_weight = 0.05
        if features.get('organic_status'):
            practices_score = 100
        elif certificate_type == 'good_agricultural_practices':
            practices_score = 85
        else:
            practices_score = 60
            
        total_score += practices_score * practices_weight
        scoring_breakdown['practices_score'] = practices_score
        max_possible_score += 100 * practices_weight
        
        # Calculate final normalized score (0-100)
        final_score = min(100, (total_score / max_possible_score) * 100)
        
        # Determine score grade
        if final_score >= 90:
            grade = 'A+'
            reliability = 'Excellent'
        elif final_score >= 80:
            grade = 'A'
            reliability = 'Very Good'
        elif final_score >= 70:
            grade = 'B'
            reliability = 'Good'
        elif final_score >= 60:
            grade = 'C'
            reliability = 'Fair'
        else:
            grade = 'D'
            reliability = 'Poor'
        
        return {
            'final_score': round(final_score, 2),
            'grade': grade,
            'reliability': reliability,
            'scoring_breakdown': scoring_breakdown,
            'extracted_features': features,
            'recommendations': self.generate_recommendations(features, final_score)
        }

    def generate_recommendations(self, features: Dict[str, Any], score: float) -> List[str]:
        """
        Generate recommendations for improving certificate score
        """
        recommendations = []
        
        if score < 70:
            recommendations.append("Consider obtaining additional certifications to improve credibility")
        
        if not features.get('validity_date'):
            recommendations.append("Ensure certificate validity dates are clearly mentioned")
        
        if not features.get('organic_status') and features.get('certificate_type') != 'organic_farming':
            recommendations.append("Consider organic farming certification for premium market access")
        
        if not features.get('farm_size'):
            recommendations.append("Include farm size information for better assessment")
        
        if features.get('certificate_type') == 'farmer_capacity':
            recommendations.append("Complement with production-based certifications like Agmark or Organic")
        
        return recommendations

# Test the system with sample certificate text
def test_certificate_scorer():
    """
    Test function to demonstrate the certificate scoring system
    """
    # Sample certificate text (mimicking OCR output)
    sample_texts = [
        """
        ORGANIC FARMING CERTIFICATE
        Certificate No: NPOP/NAB/003/2024/OF/789
        Farmer Name: Raman Kumar
        Farm Size: 2.5 hectares
        Issued by: Tamil Nadu Organic Certification Department (TNOCD)
        Valid until: 15-03-2025
        Crop: Rice, Wheat
        Location: Coimbatore District, Tamil Nadu
        Certified Organic under NPOP standards
        """,
        
        """
        AGMARK GRADING CERTIFICATE
        Certificate Number: AGM/TN/2024/456
        Producer: Lakshmi Devi
        Product: Basmati Rice
        Grade: Grade 1
        Farm Area: 1.8 acres
        Issued: Department of Agriculture, Tamil Nadu
        Valid from: 01-01-2024 to 31-12-2024
        """,
        
        """
        FARMER CAPACITY ASSESSMENT CERTIFICATE
        FCAC Registration: FCAC/KA/2023/123
        Name: Suresh Patel  
        Skills Certified: Organic Farming, Crop Management
        Issued by: SAMETI Karnataka
        Date: 20-08-2023
        Valid for: 3 years
        """
    ]
    
    scorer = FarmerCertificateScorer()
    results = []
    
    for i, text in enumerate(sample_texts, 1):
        print(f"\n=== CERTIFICATE {i} ANALYSIS ===")
        
        # Extract features
        features = scorer.extract_certificate_features(text)
        print(f"Extracted Features: {json.dumps(features, indent=2)}")
        
        # Calculate score
        score_result = scorer.calculate_certificate_score(features)
        results.append(score_result)
        
        print(f"\nSCORING RESULTS:")
        print(f"Final Score: {score_result['final_score']}/100")
        print(f"Grade: {score_result['grade']}")
        print(f"Reliability: {score_result['reliability']}")
        print(f"Scoring Breakdown: {json.dumps(score_result['scoring_breakdown'], indent=2)}")
        print(f"Recommendations: {score_result['recommendations']}")
        print("-" * 60)
    
    return results

# Run the test
test_results = test_certificate_scorer()