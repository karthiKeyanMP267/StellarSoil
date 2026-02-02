import { useEffect, useState } from 'react';
import API from '../api/api';
import FarmsMap from '../components/FarmsMap';

const Farms = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (userLocation) {
      const fetchFarms = async () => {
        try {
          // Fetch nearby farms using user's location
          const nearbyRes = await API.get('/farms/nearby', {
            params: {
              latitude: userLocation.lat,
              longitude: userLocation.lon,
              radius: 10000 // 10km in meters
            }
          });
          
          // Fetch all farms
          const allRes = await API.get('/farms');
          
          // Combine and deduplicate farms
          const nearbyFarms = nearbyRes.data;
          const allFarms = allRes.data;
          const uniqueFarms = [...new Map([...nearbyFarms, ...allFarms].map(farm => [farm._id, farm])).values()];
          
          setFarms(uniqueFarms);
        } catch (err) {
          setError('Failed to load farms');
          console.error('Error fetching farms:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchFarms();
    }
  }, [userLocation]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => setUserLocation(null)
      );
    }
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading farms...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }

  // Haversine formula for distance in km
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    function deg2rad(deg) { return deg * (Math.PI/180); }
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2-lat1);
    const dLon = deg2rad(lon2-lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Calculate distances and filter nearby farms (within 10km)
  let farmsWithDistance = farms.map(farm => {
    let distance = null;
    if (userLocation && farm.location && farm.location.coordinates) {
      distance = getDistanceFromLatLonInKm(
        userLocation.lat,
        userLocation.lon,
        farm.location.coordinates[1],
        farm.location.coordinates[0]
      );
    }
    return { ...farm, distance };
  });

  const nearbyFarms = farmsWithDistance.filter(farm => farm.distance !== null && farm.distance <= 10);
  const otherFarms = farmsWithDistance.filter(farm => farm.distance === null || farm.distance > 10);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 to-emerald-50 p-0 md:p-8">
      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center text-center py-12 md:py-20 bg-gradient-to-r from-green-200/60 to-emerald-100/60 rounded-b-3xl shadow-xl mb-8">
        <img src="/public/hero-farm.jpg" alt="Farms" className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none rounded-b-3xl" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 drop-shadow mb-4 flex items-center justify-center gap-2">
            <span className="inline-block"><svg xmlns='http://www.w3.org/2000/svg' className='inline w-10 h-10 text-green-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 21v-2a4 4 0 014-4h10a4 4 0 014 4v2M16 3a4 4 0 11-8 0 4 4 0 018 0z' /></svg></span>
            Browse Farms
          </h1>
          <p className="text-lg md:text-xl text-green-700/80 font-medium max-w-2xl mx-auto">Discover local farms, explore their produce, and connect with nature. Find the freshest food near you!</p>
        </div>
      </div>
      <FarmsMap farms={farms} userLocation={userLocation} />

      {/* Nearby Farms Section */}
      {userLocation && nearbyFarms.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-green-700 mb-4">Nearby Farms (within 10km)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {nearbyFarms.map(farm => (
              <div key={farm._id} className="group bg-white rounded-3xl shadow-xl p-7 border border-green-100 hover:shadow-2xl hover:scale-[1.025] transition-all duration-300 flex flex-col gap-2 relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 shadow">
                    <svg xmlns='http://www.w3.org/2000/svg' className='inline w-4 h-4 mr-1 text-green-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3z' /></svg>
                    {farm.distance ? farm.distance.toFixed(2) : '--'} km
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-green-800 mb-1 flex items-center gap-2">
                  <svg xmlns='http://www.w3.org/2000/svg' className='inline w-6 h-6 text-green-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z' /></svg>
                  {farm.name}
                </h2>
                <p className="text-gray-600 mb-1 flex items-center gap-1">
                  <svg xmlns='http://www.w3.org/2000/svg' className='inline w-5 h-5 text-emerald-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 12.414a4 4 0 10-1.414 1.414l4.243 4.243a1 1 0 001.414-1.414z' /></svg>
                  {farm.address ? farm.address : (farm.location && farm.location.coordinates ? `(${farm.location.coordinates[1]}, ${farm.location.coordinates[0]})` : 'N/A')}
                </p>
                <p className="text-gray-700 mb-2 italic">{farm.description || 'No description provided.'}</p>
                <button
                  className="mt-auto px-5 py-2 bg-gradient-to-r from-amber-500 to-green-500 text-white rounded-full font-semibold shadow hover:from-green-500 hover:to-amber-500 hover:scale-105 transition-all duration-200"
                  onClick={() => {
                    if (farm.location && farm.location.coordinates) {
                      const url = `https://www.google.com/maps/search/?api=1&query=${farm.location.coordinates[1]},${farm.location.coordinates[0]}`;
                      window.open(url, '_blank');
                    }
                  }}
                >
                  <span className="inline-flex items-center gap-1">
                    <svg xmlns='http://www.w3.org/2000/svg' className='inline w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 12.414a4 4 0 10-1.414 1.414l4.243 4.243a1 1 0 001.414-1.414z' /></svg>
                    Show on Map
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Farms Section */}
      <h2 className="text-2xl font-bold text-green-700 mb-4">All Farms</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {otherFarms.map(farm => (
          <div key={farm._id} className="group bg-white rounded-3xl shadow-xl p-7 border border-green-100 hover:shadow-2xl hover:scale-[1.025] transition-all duration-300 flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 shadow">
                <svg xmlns='http://www.w3.org/2000/svg' className='inline w-4 h-4 mr-1 text-green-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3z' /></svg>
                {farm.distance ? farm.distance.toFixed(2) : '--'} km
              </span>
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-1 flex items-center gap-2">
              <svg xmlns='http://www.w3.org/2000/svg' className='inline w-6 h-6 text-green-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z' /></svg>
              {farm.name}
            </h2>
            <p className="text-gray-600 mb-1 flex items-center gap-1">
              <svg xmlns='http://www.w3.org/2000/svg' className='inline w-5 h-5 text-emerald-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 12.414a4 4 0 10-1.414 1.414l4.243 4.243a1 1 0 001.414-1.414z' /></svg>
              {farm.address ? farm.address : (farm.location && farm.location.coordinates ? `(${farm.location.coordinates[1]}, ${farm.location.coordinates[0]})` : 'N/A')}
            </p>
            <p className="text-gray-700 mb-2 italic">{farm.description || 'No description provided.'}</p>
            <button
              className="mt-auto px-5 py-2 bg-gradient-to-r from-amber-500 to-green-500 text-white rounded-full font-semibold shadow hover:from-green-500 hover:to-amber-500 hover:scale-105 transition-all duration-200"
              onClick={() => {
                if (farm.location && farm.location.coordinates) {
                  const url = `https://www.google.com/maps/search/?api=1&query=${farm.location.coordinates[1]},${farm.location.coordinates[0]}`;
                  window.open(url, '_blank');
                }
              }}
            >
              <span className="inline-flex items-center gap-1">
                <svg xmlns='http://www.w3.org/2000/svg' className='inline w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 12.414a4 4 0 10-1.414 1.414l4.243 4.243a1 1 0 001.414-1.414z' /></svg>
                Show on Map
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Farms;
