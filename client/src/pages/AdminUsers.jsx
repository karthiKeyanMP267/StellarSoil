import { useEffect, useState } from 'react';
import API from '../api/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
  const res = await API.get('/admin/users');
        setUsers(res.data);
      } catch (err) {
        setError(err.response?.data?.msg || err.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
  await API.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.msg || err.message || 'Failed to delete user');
    }
  };

  const handleApprove = async (id) => {
    try {
  await API.put(`/admin/approve-farmer/${id}`);
      setUsers(users.map(u => u._id === id ? { ...u, isVerified: true } : u));
    } catch (err) {
      alert(err.response?.data?.msg || err.message || 'Failed to approve farmer');
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