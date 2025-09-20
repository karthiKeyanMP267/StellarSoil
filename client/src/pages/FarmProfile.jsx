import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function FarmProfile() {
  const { user, setUser, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [farm, setFarm] = useState(null);

  // Auth guard
  useEffect(() => {
    if (!token || !user || user.role !== 'farmer') {
      navigate('/');
    }
  }, [token, user, navigate]);

  // Fetch farm profile
  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await API.get('/farms/profile/me');
        if (!isMounted) return;
        setFarm(res.data);
        // Sync key fields into user if missing
        setUser(prev => {
          if (!prev) return prev;
          const patch = {};
          if (!prev.farmName && res.data?.name) patch.farmName = res.data.name;
          if (!prev.farmDescription && res.data?.description) patch.farmDescription = res.data.description;
          if (!prev.location && res.data?.address) patch.location = res.data.address;
          if (Object.keys(patch).length) {
            const merged = { ...prev, ...patch };
            const stored = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({ ...stored, ...patch }));
            return merged;
          }
          return prev;
        });
      } catch (err) {
        if (!isMounted) return;
        if (err?.response?.status === 404) {
          setFarm(null);
        } else {
          setError(err?.response?.data?.msg || 'Failed to load farm profile');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProfile();
    return () => { isMounted = false; };
  }, [setUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-700">{error}</div>
      </div>
    );
  }

  if (!farm) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="p-4 rounded-lg border border-orange-200 bg-orange-50 text-orange-700">
          No farm profile found. Please go to Dashboard to complete your farm profile.
        </div>
      </div>
    );
  }

  // Derived helpers
  const coords = farm?.location?.coordinates;
  const lat = Array.isArray(coords) ? coords[1] : null;
  const lng = Array.isArray(coords) ? coords[0] : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-emerald-600">
            {farm.name}
          </h1>
          <p className="text-beige-600 mt-1">{farm.farmType?.charAt(0).toUpperCase() + farm.farmType?.slice(1)} Farm</p>
        </div>
        <button
          className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          onClick={() => navigate('/farmer?edit=1')}
        >
          Edit Profile
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="p-5 rounded-xl bg-white border border-beige-200">
            <h2 className="font-semibold text-beige-800 mb-2">About</h2>
            <p className="text-beige-700 whitespace-pre-line">{farm.description || '—'}</p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-beige-200">
            <h2 className="font-semibold text-beige-800 mb-2">Details</h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-beige-500">Address</div>
                <div className="text-beige-800">{farm.address || '—'}</div>
              </div>
              <div>
                <div className="text-beige-500">Phone</div>
                <div className="text-beige-800">{farm.contactPhone || '—'}</div>
              </div>
              <div>
                <div className="text-beige-500">Email</div>
                <div className="text-beige-800">{farm.email || '—'}</div>
              </div>
              <div>
                <div className="text-beige-500">Website</div>
                <div className="text-green-700">
                  {farm.website ? <a className="hover:underline" href={farm.website} target="_blank" rel="noreferrer">{farm.website}</a> : '—'}
                </div>
              </div>
              <div>
                <div className="text-beige-500">Farm Size</div>
                <div className="text-beige-800">{farm.farmSize || '—'}</div>
              </div>
              <div>
                <div className="text-beige-500">Rating</div>
                <div className="text-beige-800">{farm.rating?.toFixed?.(1) || '—'}</div>
              </div>
            </div>
          </div>

          {(farm.specialties?.length || farm.certifications?.length) && (
            <div className="grid sm:grid-cols-2 gap-6">
              {farm.specialties?.length > 0 && (
                <div className="p-5 rounded-xl bg-white border border-beige-200">
                  <h2 className="font-semibold text-beige-800 mb-2">Specialties</h2>
                  <div className="flex flex-wrap gap-2">
                    {farm.specialties.map((s, i) => (
                      <span key={i} className="px-2 py-1 text-xs rounded-full bg-green-50 text-green-700 border border-green-200">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {farm.certifications?.length > 0 && (
                <div className="p-5 rounded-xl bg-white border border-beige-200">
                  <h2 className="font-semibold text-beige-800 mb-2">Certifications</h2>
                  <div className="flex flex-wrap gap-2">
                    {farm.certifications.map((c, i) => (
                      <span key={i} className="px-2 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-white border border-beige-200">
            <h2 className="font-semibold text-beige-800 mb-2">Location</h2>
            {lat && lng ? (
              <div className="text-sm text-beige-700">Lat: {lat}, Lng: {lng}</div>
            ) : (
              <div className="text-sm text-beige-500">Coordinates not set</div>
            )}
            <div className="text-sm text-beige-700 mt-2">{farm.address || '—'}</div>
          </div>
          <div className="p-5 rounded-xl bg-white border border-beige-200">
            <h2 className="font-semibold text-beige-800 mb-2">Owner</h2>
            <div className="text-sm text-beige-700">{farm.owner?.name || user?.name}</div>
            <div className="text-sm text-beige-700">{farm.owner?.email || user?.email}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
