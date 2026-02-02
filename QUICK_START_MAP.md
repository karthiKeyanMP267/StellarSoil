# 🚀 Quick Start - Map Feature

## ▶️ Start the Application

### 1. Start Backend (Terminal 1)
```bash
cd server
npm run dev
```

### 2. Start Frontend (Terminal 2)
```bash
cd client
npm run dev
```

---

## 🗺️ Test the Map Feature

### Option 1: Product Discovery with Map
1. Open browser: **http://localhost:5174/discover-products**
2. Click "Allow" when browser asks for location permission
3. Type "tomato" or "carrot" in the search box
4. Click **Search** button
5. Click the **📍 Map icon** in the search bar
6. **Result:** Bottom sheet appears with interactive map showing:
   - 🔵 Your location (blue marker)
   - 🟢 Farms with products (color-coded by certification)
   - 💬 Click any marker to see product details

### Option 2: Farm Discovery with Map
1. Open browser: **http://localhost:5174/discover-farms**
2. Allow location permission
3. Adjust filters:
   - **Radius:** 10 km (slide to increase/decrease)
   - **Min Certification:** 20 (for certified farms only)
4. Click **Apply Filters**
5. Click **🗺️ Map** toggle button (top right)
6. **Result:** Full-screen map showing:
   - 🟡 Premium farms (score ≥ 35)
   - 🟢 Certified farms (score ≥ 20)
   - 🔵 Verified farms (score ≥ 10)
   - 💬 Click markers for farm details

---

## 🎯 What to Expect

### Map Features You'll See:
✅ **User Location Marker** - Blue pin at your coordinates  
✅ **Search Radius Circle** - Dashed blue circle showing search area  
✅ **Color-Coded Farm Markers** - Certification-based colors  
✅ **Rich Popups** - Click markers to see:
   - Farm/Product name
   - Certification badge
   - Distance from you
   - Ranking score
   - Price (for products)
   - "View Details" button

### Marker Colors:
- 🟡 **Gold** = Premium (cert score ≥ 35)
- 🟢 **Green** = Certified (cert score ≥ 20)
- 🔵 **Blue** = Verified (cert score ≥ 10)
- ⚪ **Gray** = Standard (cert score < 10)

---

## 📊 Sample Test Coordinates

If location permission denied, you can manually test with these coordinates:

### Bangalore, India
```
Latitude: 12.9716
Longitude: 77.5946
```

### Coimbatore, India
```
Latitude: 11.0168
Longitude: 76.9558
```

### Mumbai, India
```
Latitude: 19.0760
Longitude: 72.8777
```

**How to use:** 
*Note: Currently auto-detects location. To manually set, you'd need to modify the component temporarily.*

---

## 🧪 API Testing

Test the backend API directly with curl:

### 1. Get Products Near Bangalore
```bash
curl "http://localhost:5000/api/products/nearby?longitude=77.5946&latitude=12.9716&radius=10&query=tomato&limit=20"
```

### 2. Get Farms Near Coimbatore
```bash
curl "http://localhost:5000/api/farms/nearby?longitude=76.9558&latitude=11.0168&radius=5&minScore=20&limit=10"
```

**Expected Response:**
```json
{
  "count": 5,
  "radius": 10,
  "userLocation": { "longitude": 77.5946, "latitude": 12.9716 },
  "products": [
    {
      "_id": "...",
      "name": "Tomato",
      "price": 25,
      "distanceKm": 2.3,
      "finalScore": 37.7,
      "farm": {
        "name": "Green Valley Farm",
        "certificationScore": 40,
        "location": { "coordinates": [77.6, 12.98] }
      }
    }
  ]
}
```

---

## 🔍 Troubleshooting

### Issue: "No products found"
**Cause:** No data in database  
**Fix:** Run migrations and seed data:
```bash
cd server
npm run migrate:models
npm run seed  # If you have seed script
```

### Issue: Map not showing
**Cause:** Leaflet CSS not loaded  
**Fix:** Already added to `client/src/index.css`:
```css
@import 'leaflet/dist/leaflet.css';
```

### Issue: Markers not appearing
**Cause:** Farm locations not in GeoJSON format  
**Fix:** Check database:
```javascript
// Correct format
{
  location: {
    type: 'Point',
    coordinates: [77.5946, 12.9716] // [lng, lat]
  }
}
```

### Issue: "Location permission denied"
**Cause:** Browser blocked location  
**Fix:** 
1. Click 🔒 icon in address bar
2. Change location permission to "Allow"
3. Refresh page

---

## 📱 Mobile Testing

### On Mobile Device:
1. Find your computer's local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Update Vite config to allow network access (already done)
3. Access from phone: `http://YOUR_IP:5174/discover-products`
4. Allow location permission
5. Test map on mobile with touch gestures:
   - **Pinch** to zoom
   - **Drag** to pan
   - **Tap** markers to see details

---

## 🎨 Customization Options

### Change Map Style
Edit `FarmMap.jsx`:
```javascript
// Current: OpenStreetMap
url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

// Alternative: Satellite view
url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"

// Alternative: Dark mode
url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
```

### Adjust Search Radius
Edit filters in components:
```javascript
// ProductDiscovery.jsx
const [filters, setFilters] = useState({
  radius: 10000, // Change to 5000 for 5km, 20000 for 20km
  ...
});
```

### Change Marker Colors
Edit `createCustomIcon` function in `FarmMap.jsx`:
```javascript
const color = certificationScore >= 35 ? '#EAB308' : // Change colors here
              certificationScore >= 20 ? '#22C55E' :
              ...
```

---

## 📚 Next Steps

1. **Add Navigation Links**
   - Update Navbar to include map routes
   - Add badges for "New Feature"

2. **Enhance Popups**
   - Add product images
   - Show stock availability
   - Add "Add to Cart" button in popup

3. **Save Favorite Locations**
   - Let users save common search locations
   - Quick access to saved coordinates

4. **Clustering**
   - For areas with many farms, add marker clustering
   - Install: `npm install react-leaflet-cluster`

5. **Route Planning**
   - Show route from user to selected farm
   - Integrate with Google Maps/Apple Maps

---

## ✅ Quick Checklist

Before showing to evaluators:

- [ ] Backend running (`npm run dev` in server)
- [ ] Frontend running (`npm run dev` in client)
- [ ] Location permission allowed in browser
- [ ] Database has farms with GeoJSON locations
- [ ] Farms have certificationScore values
- [ ] Products linked to farms
- [ ] 2dsphere index exists on farms.location
- [ ] Test both `/discover-products` and `/discover-farms`
- [ ] Verify map shows markers with correct colors
- [ ] Click markers to test popups
- [ ] Test filters (radius, minScore)

---

## 🎤 Demo Script

> "Let me show you our intelligent farm discovery system. We use **Leaflet** for interactive mapping with **MongoDB's $geoNear** for efficient geo-spatial queries.
> 
> First, I'll search for tomatoes near my location. *[Type 'tomato' and click search]* 
> 
> Now, clicking this map icon shows all farms selling tomatoes within 10km. Notice the **color-coded markers** - gold for premium certified farms, green for certified, blue for verified.
> 
> *[Click a marker]* The popup shows distance, certification score, and our unique **ranking algorithm** that balances certification quality with proximity: `finalScore = certificationScore - (distance/100)`.
> 
> Let's switch to the dedicated farm view. *[Navigate to /discover-farms]* Here I can toggle to full-screen map mode. The blue circle shows my search radius - I can adjust this in real-time. *[Adjust slider]* All computation happens at the database level using MongoDB's native geo-spatial indexes, so this scales to millions of records efficiently.
> 
> This demonstrates production-grade architecture where distance is treated as a filter, not a feature - exactly how mapping should be done at scale."

---

**Ready to test!** Open http://localhost:5174/discover-products and start exploring! 🎉
