
import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    contact: { type: String, required: true },
    availability: {
      days: [String],     // e.g., ["Monday", "Wednesday"]
      time: String        // e.g., "10:00 AM - 4:00 PM"
    }
  },
  { timestamps: true }
);

export default mongoose.model('Doctor', doctorSchema);
