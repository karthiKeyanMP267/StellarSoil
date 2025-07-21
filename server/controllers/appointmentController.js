import Appointment from '../models/Appointment.js';

export const bookAppointment = async (req, res) => {
  try {
    const { doctor, date, time } = req.body;

    const newAppointment = await Appointment.create({
      user: req.user._id,
      doctor,
      date,
      time
    });

    res.status(201).json(newAppointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error booking appointment' });
  }
};

export const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 });

    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching appointments' });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('user', 'name email')
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 });

    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching all appointments' });
  }
};

export const markAppointmentCompleted = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'Completed' },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ msg: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ msg: 'Error marking appointment as completed' });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ msg: 'Appointment not found' });

    // Only the user who booked or the doctor can delete
    if (
      appointment.user.toString() !== req.user._id.toString() &&
      appointment.doctor.toString() !== req.user.doctorId?.toString()
    ) {
      return res.status(403).json({ msg: 'Not authorized to delete this appointment' });
    }
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting appointment' });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user.doctorId;
    if (!doctorId) return res.status(400).json({ msg: 'Doctor ID not found for user' });
    const appointments = await Appointment.find({ doctor: doctorId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching doctor appointments' });
  }
};

export const getDoctorStats = async (req, res) => {
  try {
    const doctorId = req.user.doctorId;
    if (!doctorId) return res.status(400).json({ msg: 'Doctor ID not found for user' });
    const all = await Appointment.find({ doctor: doctorId });
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const totalAppointments = all.length;
    const todayAppointments = all.filter(a => a.date === todayStr).length;
    const completedAppointments = all.filter(a => a.status === 'Completed').length;
    res.json({ totalAppointments, todayAppointments, completedAppointments });
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching doctor stats' });
  }
};

export const rescheduleAppointment = async (req, res) => {
  try {
    const { date, time } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ msg: 'Appointment not found' });

    // Only the doctor assigned to this appointment can reschedule
    if (appointment.doctor.toString() !== req.user.doctorId?.toString()) {
      return res.status(403).json({ msg: 'Not authorized to reschedule this appointment' });
    }

    appointment.date = date;
    appointment.time = time;
    appointment.status = 'Pending'; // Optionally reset status
    await appointment.save();
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ msg: 'Error rescheduling appointment' });
  }
};

export const rescheduleAppointmentByUser = async (req, res) => {
  try {
    const { date, time } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ msg: 'Appointment not found' });

    // Only the user who booked can reschedule
    if (appointment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Not authorized to reschedule this appointment' });
    }

    appointment.date = date;
    appointment.time = time;
    appointment.status = 'Pending'; // Optionally reset status
    await appointment.save();
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ msg: 'Error rescheduling appointment' });
  }
};
