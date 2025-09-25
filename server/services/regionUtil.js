// Heuristic region extractor for Indian addresses
// Tries to detect state and district/city from a free-form address string.

const IN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu','Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry'
];

// Build lowered lookup
const STATES_LOWER = IN_STATES.map(s => s.toLowerCase());

export function extractRegionFromAddress(address = '') {
  if (!address || typeof address !== 'string') return {};
  const addr = address.trim();
  const lower = addr.toLowerCase();

  // Find a matching state name substring
  let state = null;
  for (let i = 0; i < STATES_LOWER.length; i++) {
    if (lower.includes(STATES_LOWER[i])) {
      state = IN_STATES[i];
      break;
    }
  }

  // Try to guess district/city as one of the comma-separated parts that isn't the state
  const parts = addr.split(',').map(p => p.trim()).filter(Boolean);
  let district = null;
  if (parts.length) {
    // Prefer the last 2-3 parts for city/district
    const candidates = parts.slice(-3);
    for (const part of candidates) {
      const pl = part.toLowerCase();
      if (!STATES_LOWER.includes(pl) && !/\b(\d{5,6})\b/.test(pl)) { // skip pincode
        // simple filter to avoid words like 'india'
        if (!['india','bharat'].includes(pl)) {
          district = part;
          break;
        }
      }
    }
  }

  // We don't have a reliable market name; use district as market hint
  const market = district || undefined;
  return { state: state || undefined, district: district || undefined, market };
}

export default { extractRegionFromAddress };
