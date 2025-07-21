import { useEffect, useState } from 'react';
import API from '../api';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);

  // Fetch user's appointments on mount
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await API.get('/appointments/my');
        setAppointments(res.data);
      } catch (err) {
        alert('Failed to load appointments');
      }
    };

    fetchAppointments();
  }, []);

  const cancelAppointment = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;

    try {
      await API.delete(`/appointments/${id}`);
      setAppointments((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      alert('Failed to cancel appointment');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4">My Appointments</h2>

      {appointments.length === 0 ? (
        <p>No appointments booked.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <div
              key={appt._id}
              className="border rounded p-4 shadow flex justify-between items-center"
            >
              <div>
                <p><strong>Doctor:</strong> {appt.doctor?.name || 'Unknown'}</p>
                <p><strong>Date:</strong> {appt.date}</p>
                <p><strong>Time:</strong> {appt.time}</p>
              </div>
              <button
                onClick={() => cancelAppointment(appt._id)}
                className="bg-red-600 text-white px-4 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
