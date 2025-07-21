import express from 'express';
import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';

// Get available slots for a doctor on a specific date
export const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;
    if (!date) return res.status(400).json({ msg: 'Date is required' });

    // Fetch doctor availability
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ msg: 'Doctor not found' });

    // Accept both DD-MM-YYYY and YYYY-MM-DD, but also support slashes and dots
    let dateObj;
    if (date.includes('-')) {
      const parts = date.split('-');
      if (parts[0].length === 4) {
        // YYYY-MM-DD
        dateObj = new Date(date);
      } else {
        // DD-MM-YYYY
        dateObj = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      }
    } else if (date.includes('/')) {
      const parts = date.split('/');
      if (parts[2].length === 4) {
        // DD/MM/YYYY
        dateObj = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      } else {
        dateObj = new Date(date);
      }
    } else if (date.includes('.')) {
      const parts = date.split('.');
      if (parts[2].length === 4) {
        // DD.MM.YYYY
        dateObj = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      } else {
        dateObj = new Date(date);
      }
    } else {
      dateObj = new Date(date);
    }
    // Fix: Map short weekday names to full names for comparison
    const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    const doctorDaysFull = doctor.availability.days.map(d => {
      switch (d.toLowerCase().slice(0,3)) {
        case 'mon': return 'Monday';
        case 'tue': return 'Tuesday';
        case 'wed': return 'Wednesday';
        case 'thu': return 'Thursday';
        case 'fri': return 'Friday';
        case 'sat': return 'Saturday';
        case 'sun': return 'Sunday';
        default: return d;
      }
    });
    // DEBUG: Log incoming date, doctorId, weekday, and doctor availability
    console.log('DEBUG: doctorId', doctorId, 'date', date, 'parsedWeekday', weekday, 'doctorDays', doctor.availability.days, 'doctorDaysFull', doctorDaysFull, 'doctorTime', doctor.availability.time);
    if (!doctorDaysFull.includes(weekday)) {
      return res.json([]); // No slots if doctor not available that day
    }

    // Parse available time range (e.g., '10:00 AM - 4:00 PM')
    const [start, end] = doctor.availability.time.split(' - ');
    const parseTime = t => {
      const [h, m] = t.split(/:| /);
      let hour = parseInt(h, 10);
      if (t.includes('PM') && hour !== 12) hour += 12;
      if (t.includes('AM') && hour === 12) hour = 0;
      return hour;
    };
    const startHour = parseTime(start);
    const endHour = parseTime(end);

    // Generate slots within available time
    const slots = [];
    for (let h = startHour; h < endHour; h++) {
      const slotStart = `${h.toString().padStart(2, '0')}:00`;
      const slotEnd = `${(h+1).toString().padStart(2, '0')}:00`;
      slots.push(`${slotStart} - ${slotEnd}`);
    }

    // Find booked slots for this doctor and date
    const appointments = await Appointment.find({ doctor: doctorId, date });
    const bookedTimes = appointments.map(a => a.time);

    // Mark slots as available or not
    const availableSlots = slots.map(slot => ({
      slot,
      available: !bookedTimes.includes(slot)
    }));

    res.json(availableSlots);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching slots', error: err.message });
  }
};
