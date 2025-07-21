import { useEffect, useState } from 'react';
import API from '../api/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await API.get('/api/auth/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      await API.delete(`/api/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await API.put(`/api/auth/approve-farmer/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.map(u => u._id === id ? { ...u, isVerified: true } : u));
    } catch (err) {
      alert('Failed to approve farmer');
    }
  };

  if (loading) return <div className="p-8">Loading users...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Users & Farmers</h1>
      <table className="min-w-full bg-white rounded-xl shadow-lg">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} className="border-t">
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.role}</td>
              <td className="px-4 py-2">{user.isActive ? 'Active' : 'Inactive'}</td>
              <td className="px-4 py-2">
                <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:underline">Delete</button>
                {user.role === 'farmer' && !user.isVerified && (
                  <button onClick={() => handleApprove(user._id)} className="text-green-600 hover:underline ml-2">Approve</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 