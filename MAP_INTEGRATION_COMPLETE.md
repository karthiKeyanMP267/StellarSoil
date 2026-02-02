# 🗺️ Leaflet Map Integration - Complete

## 📦 Installation

```bash
cd client
npm install leaflet react-leaflet@4.2.1 --legacy-peer-deps
```

**Note:** We use `react-leaflet@4.2.1` for compatibility with React 18.

---

## 📁 Files Created/Modified

### 1. **New Component: FarmMap.jsx**
**Location:** `client/src/components/FarmMap.jsx`

**Features:**
- 🗺️ Interactive map with OpenStreetMap tiles
- 📍 User location marker with blue circle showing search radius
- 🎯 Farm/product markers with certification-based colors
- 💬 Rich popups with farm details, distance, ranking score
- 🎨 Color-coded markers:
  - 🟡 Gold (Premium): certificationScore ≥ 35
  - 🟢 Green (Certified): certificationScore ≥ 20
  - 🔵 Blue (Verified): certificationScore ≥ 10
  - ⚪ Gray (Standard): certificationScore < 10

**Props:**
```javascript
<FarmMap
  farms={[]}           // Array of farms or products with farm data
  userLocation={{}}    // {lat, lng} user's coordinates
  radius={10000}       // Radius in meters
  onFarmClick={fn}     // Callback when farm marker clicked
  selectedFarm={{}}    // Highlight selected farm
/>
```

---

### 2. **Updated: ProductDiscovery.jsx**
**Location:** `client/src/pages/ProductDiscovery.jsx`

**Changes:**
- ✅ Imported `FarmMap` component
- ✅ Map toggle button in search bar
- ✅ Bottom sheet map view (fixed position, 384px height)
- ✅ Passes product data to map with farm locations

**Map View:**
```jsx
{showMap && (
  <div className="fixed bottom-0 left-0 right-0 h-96 bg-white border-t shadow-lg z-50 p-4">
    <FarmMap
      farms={products}
      userLocation={userLocation}
      radius={filters.radius}
      onFarmClick={(farm) => setSelectedProduct(farm)}
    />
  </div>
)}
```

---

### 3. **New Page: FarmDiscovery.jsx**
**Location:** `client/src/pages/FarmDiscovery.jsx`

**Features:**
- 🎛️ Toggle between Grid View and Map View
- 📊 Sidebar filters (radius, minScore, limit)
- 🗺️ Full-screen map view (calc(100vh-200px) height)
- 📋 Grid view with farm cards showing:
  - Certification badges
  - Distance and ranking score
  - Owner information
  - Contact details
  - "View on Map" button

**Routes:**
```javascript
// View products near you
/discover-products

// View certified farms near you
/discover-farms
```

---

### 4. **Updated: App.jsx**
**Changes:**
```javascript
import ProductDiscovery from './pages/ProductDiscovery';
import FarmDiscovery from './pages/FarmDiscovery';

// Routes
<Route path="/discover-products" element={<ProductDiscovery />} />
<Route path="/discover-farms" element={<FarmDiscovery />} />
```

---

### 5. **Updated: index.css**
**Changes:**
```css
@import 'leaflet/dist/leaflet.css';
```

---

## 🎯 Key Features

### Certification-Based Marker Colors
```javascript
const createCustomIcon = (certificationScore) => {
  const color = certificationScore >= 35 ? '#EAB308' : // gold
                certificationScore >= 20 ? '#22C55E' : // green
                certificationScore >= 10 ? '#3B82F6' : // blue
                '#6B7280'; // gray
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`...`)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};
```

### Radius Visualization
```javascript
<Circle
  center={[userLocation.lat, userLocation.lng]}
  radius={radius}
  pathOptions={{
    color: '#3B82F6',
    fillColor: '#93C5FD',
    fillOpacity: 0.1,
    dashArray: '10, 10'
  }}
/>
```

### Dynamic Popups
Each marker shows:
- Farm/Product name
- Certification badge with score
- Distance from user
- Ranking score (finalScore)
- Price (for products)
- Owner details
- "View Details" button

---

## 🚀 Usage Examples

### ProductDiscovery Component
```javascript
// 1. User enables location
// 2. Search for products (e.g., "tomato")
// 3. Click map icon in search bar
// 4. See products on map with color-coded markers
// 5. Click marker to see details
// 6. Add to cart from popup
```

### FarmDiscovery Component
```javascript
// 1. User enables location
// 2. Adjust filters (radius: 10km, minScore: 20)
// 3. Toggle to Map View
// 4. See certified farms with rankings
// 5. Click marker to see farm details
// 6. Toggle back to Grid View for detailed cards
```

---

## 🔧 Technical Details

### Map Configuration
```javascript
<MapContainer
  center={[lat, lng]}
  zoom={12}
  scrollWheelZoom={true}
  style={{ height: '100%', width: '100%' }}
>
  <TileLayer
    attribution='&copy; OpenStreetMap contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
</MapContainer>
```

### Recenter on Location Change
```javascript
const RecenterMap = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], map.getZoom());
    }
  }, [center, map]);
  
  return null;
};
```

### GeoJSON Coordinates
MongoDB stores coordinates as `[longitude, latitude]`, but Leaflet expects `[latitude, longitude]`:

```javascript
// MongoDB: farm.location.coordinates = [lng, lat]
const [lng, lat] = farm.location.coordinates;

// Leaflet: position = [lat, lng]
<Marker position={[lat, lng]} />
```

---

## 📊 Data Flow

### ProductDiscovery
```
User Location → API: /products/nearby → Products with farm.location
→ FarmMap → Markers with certification colors → Click → View Details
```

### FarmDiscovery
```
User Location → API: /farms/nearby → Farms with location + ranking
→ FarmMap (full screen) → Color-coded markers → Click → Grid View with details
```

---

## 🎨 Visual Design

### Map Views
1. **ProductDiscovery**: Bottom sheet (384px height)
   - Quick overlay without leaving search results
   - Easy to dismiss and return to grid

2. **FarmDiscovery**: Full screen (calc(100vh-200px))
   - Immersive map experience
   - Toggle between map and grid views

### Marker Design
- SVG location pin with certification color
- 32x32px size for visibility
- Hover effect with popup
- Selected state (optional highlighting)

---

## 🧪 Testing

### Test ProductDiscovery Map
1. Navigate to `/discover-products`
2. Enable location permission
3. Search for "carrot" or "tomato"
4. Click map icon (📍) in search bar
5. Verify:
   - ✅ Map shows user location (blue marker)
   - ✅ Blue circle shows search radius
   - ✅ Farm markers color-coded by certification
   - ✅ Popups show product details
   - ✅ Distance and ranking scores display

### Test FarmDiscovery Map
1. Navigate to `/discover-farms`
2. Enable location permission
3. Set radius = 10km, minScore = 20
4. Click "🗺️ Map" toggle
5. Verify:
   - ✅ Full-screen map view
   - ✅ Only certified farms shown (score ≥ 20)
   - ✅ Markers within 10km radius
   - ✅ Click marker shows farm details
   - ✅ "View Details" switches to grid view

---

## 🐛 Troubleshooting

### Issue: Markers not showing
**Fix:** Check GeoJSON format:
```javascript
// Correct
farm.location.coordinates = [77.5946, 12.9716] // [lng, lat]

// Wrong
farm.location.coordinates = [12.9716, 77.5946] // [lat, lng]
```

### Issue: Map not loading
**Fix:** Ensure Leaflet CSS imported:
```css
@import 'leaflet/dist/leaflet.css';
```

### Issue: Default marker icons missing
**Fix:** Already handled in `FarmMap.jsx`:
```javascript
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
```

---

## 🚀 Next Steps

1. **Test with real data**
   ```bash
   npm run migrate:models  # Convert data to GeoJSON
   npm run test:geo        # Verify geo queries
   ```

2. **Populate test farms**
   - Add farms with `location: { type: 'Point', coordinates: [lng, lat] }`
   - Set certificationScore values
   - Link products to farms

3. **Test API endpoints**
   ```bash
   # Products near Bangalore
   curl "http://localhost:5000/api/products/nearby?longitude=77.5946&latitude=12.9716&radius=10"
   
   # Farms near Coimbatore
   curl "http://localhost:5000/api/farms/nearby?longitude=76.9558&latitude=11.0168&radius=5&minScore=20"
   ```

4. **Add to navigation**
   - Update Navbar with links to `/discover-products` and `/discover-farms`
   - Add map icons or badges

---

## 📈 Performance

### Optimization
- ✅ Uses OpenStreetMap (free, fast tiles)
- ✅ Lazy popup rendering (only on click)
- ✅ Custom SVG icons (no image requests)
- ✅ RecenterMap prevents unnecessary re-renders

### Scalability
- Works with MongoDB $geoNear (already implemented)
- Only shows top N results (20-50 farms max)
- Client-side rendering minimal (map handles most work)

---

## 🎓 Key Learnings

1. **GeoJSON Standard**
   - MongoDB: `[longitude, latitude]`
   - Leaflet: `[latitude, longitude]`
   - Always convert coordinates properly

2. **React-Leaflet Version**
   - v5.x requires React 19
   - v4.2.1 works with React 18
   - Use `--legacy-peer-deps` for compatibility

3. **Marker Customization**
   - Base64 SVG icons for dynamic colors
   - No external image requests
   - Scales with certification tiers

4. **Responsive Design**
   - Bottom sheet for mobile/small screens
   - Full screen for dedicated map view
   - Toggle between views for best UX

---

## ✅ Status

**Implementation:** ✅ Complete  
**Testing:** ⏳ Ready for testing  
**Documentation:** ✅ Complete  
**Routes Added:** ✅ `/discover-products`, `/discover-farms`

**Next:** Test with real MongoDB data using $geoNear queries! 🚀
