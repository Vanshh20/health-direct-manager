const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: 'patient',
    enum: ['patient', 'doctor', 'admin', 'manager'],
  },
  surname: {
    type: String,
    trim: true,
    required: true, // Mandatory for manager profile
  },
  name: {
    type: String,
    trim: true,
    required: true, // Mandatory for manager profile
  },
  patronymicName: {
    type: String,
    trim: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    default: 'Male', // Default as per requirement
    required: true, // Mandatory for manager profile
  },
  dateOfBirth: {
    type: Date,
    required: true, // Mandatory for manager profile
  },
  age: {
    type: Number,
    required: true, // Mandatory for manager profile
  },
  residence: {
    type: String,
    trim: true,
    required: true, // Mandatory for manager profile (City of Residence)
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  additionalPhone: {
    type: String,
    trim: true,
  },
  profilePicture: {
    type: Buffer,
  },
  profileCompleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);