# Create a comprehensive scoring matrix showing different certificate types and their scores

import pandas as pd

# Create a scoring matrix for different certificate types
scoring_matrix = {
    'Certificate Type': [
        'NPOP Organic (Government)', 'PGS Organic (Participatory)', 'TNOCD Organic (Tamil Nadu)',
        'APEDA Organic (Export)', 'Agmark Grade 1', 'Agmark Grade 2', 'Agmark Grade 3',
        'IndGAP Certified', 'Global GAP', 'Bharat GAP', 'FCAC (Capacity)', 'Seed Certification',
        'Fair Trade', 'Rainforest Alliance', 'ISO Certified'
    ],
    'Base Score': [95, 85, 90, 95, 90, 80, 70, 85, 90, 80, 70, 75, 70, 80, 90],
    'Authority Type': [
        'Government', 'Community', 'State Agency', 'Government', 'Government', 'Government', 'Government',
        'Accredited Private', 'International', 'Government', 'Government', 'Government',
        'International', 'International', 'International'
    ],
    'Typical Validity': ['1 year', '1 year', '1 year', '1 year', '1 year', '1 year', '1 year',
                        '3 years', '3 years', '3 years', '3 years', '1 year', '3 years', '3 years', '3 years'],
    'Market Premium': ['High', 'Medium', 'High', 'Very High', 'Medium', 'Low', 'Low',
                      'Medium', 'High', 'Medium', 'Low', 'Low', 'High', 'High', 'High']
}

scoring_df = pd.DataFrame(scoring_matrix)

# Sort by base score for better visualization
scoring_df = scoring_df.sort_values('Base Score', ascending=False)

print("=== CERTIFICATE SCORING MATRIX ===")
print(scoring_df.to_string(index=False))

# Save as CSV for reference
scoring_df.to_csv('certificate_scoring_matrix.csv', index=False)
print(f"\n✅ Scoring matrix saved to certificate_scoring_matrix.csv")

# Create farm size categories table
farm_size_data = {
    'Farm Category': ['Marginal', 'Small', 'Semi-Medium', 'Medium', 'Large'],
    'Size Range (Hectares)': ['0-1', '1-2', '2-4', '4-10', '10+'],
    'Score Multiplier': [1.1, 1.05, 1.0, 0.95, 0.9],
    'Government Support': ['High', 'High', 'Medium', 'Medium', 'Low'],
    'Typical Crops': ['Vegetables, Spices', 'Rice, Wheat', 'Mixed Crops', 'Cash Crops', 'Commercial Farming']
}

farm_size_df = pd.DataFrame(farm_size_data)
print("\n=== FARM SIZE CATEGORIES ===")
print(farm_size_df.to_string(index=False))

farm_size_df.to_csv('farm_size_categories.csv', index=False)
print(f"\n✅ Farm size categories saved to farm_size_categories.csv")