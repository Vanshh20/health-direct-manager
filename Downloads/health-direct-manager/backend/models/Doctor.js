const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  middleName: { type: String, trim: true },
  lastName: { type: String, required: true, trim: true },
  specialty: { type: String, required: true, trim: true },
  serviceType: [{ type: String, required: true, enum: ['Online', 'Offline'] }],
  email: { 
    type: String, 
    required: true, 
    trim: true, 
    lowercase: true, 
    unique: true 
  },
  phone: { type: String, trim: true },
  feesAmount: { type: Number, required: true, min: 0 },
  currency: { type: String, required: true, enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Doctor', doctorSchema);