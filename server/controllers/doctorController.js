import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const createDoctor = async (req, res) => {
  try {
    const { name, specialization, experience, contact, availability, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: 'Doctor email and password are required' });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: 'A user with this email already exists' });
    }
    // Create doctor in Doctor collection
    const doctor = await Doctor.create({ name, specialization, experience, contact, availability });
    // Create user for authentication, referencing the doctor
    const user = await User.create({
      name,
      email,
      password, // Do NOT hash here, let the schema pre-save hook handle it
      role: 'doctor',
      specialization,
      doctorId: doctor._id // Add reference to doctor
    });
    res.status(201).json({ doctor, user });
  } catch (err) {
    console.error('Error creating doctor:', err); // Log the real error
    res.status(500).json({ msg: 'Error creating doctor', error: err.message }); // Send error message to frontend
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching doctors', error: err.message });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!doctor) return res.status(404).json({ msg: 'Doctor not found' });

    res.json(doctor);
  } catch (err) {
    res.status(500).json({ msg: 'Error updating doctor', error: err.message });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    // Delete the doctor document
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ msg: 'Doctor not found' });

    // Delete the associated user document
    await User.findOneAndDelete({ doctorId: req.params.id });

    res.json({ msg: 'Doctor and associated user deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting doctor', error: err.message });
  }
};

export const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { _id: req.user.id },
      {
        experience: req.body.experience,
        availability: req.body.availability,
      },
      { new: true }
    );
    if (!doctor) return res.status(404).json({ msg: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ msg: 'Error updating doctor profile', error: err.message });
  }
};
