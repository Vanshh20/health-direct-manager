const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Doctor = require('../models/Doctor');
const { body, validationResult } = require('express-validator');

// @route   GET /api/doctors
// @desc    Get all doctors
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    res.json({ doctors });
  } catch (error) {
    console.error('Error fetching doctors:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/doctors/:id
// @desc    Get a single doctor by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json({ doctor });
  } catch (error) {
    console.error('Error fetching doctor:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Invalid doctor ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/doctors
// @desc    Create a new doctor
// @access  Private
router.post(
  '/',
  [
    auth,
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('specialty').trim().notEmpty().withMessage('Specialty is required'),
    body('serviceType')
      .isArray({ min: 1 })
      .withMessage('At least one service type is required')
      .custom(value => value.every(type => ['Online', 'Offline'].includes(type)))
      .withMessage('Invalid service type'),
    body('email').isEmail().withMessage('Invalid email'),
    body('feesAmount')
      .isFloat({ min: 0 })
      .withMessage('Fees amount must be a positive number'),
    body('currency')
      .isIn(['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'])
      .withMessage('Invalid currency'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation errors', errors: errors.array() });
    }

    try {
      const {
        firstName,
        middleName,
        lastName,
        specialty,
        serviceType,
        email,
        phone,
        feesAmount,
        currency,
      } = req.body;

      // Check if email already exists
      const existingDoctor = await Doctor.findOne({ email });
      if (existingDoctor) {
        return res.status(400).json({ message: 'Doctor with this email already exists' });
      }

      const doctor = new Doctor({
        firstName,
        middleName,
        lastName,
        specialty,
        serviceType,
        email,
        phone,
        feesAmount,
        currency,
      });

      await doctor.save();
      res.status(201).json({ doctor });
    } catch (error) {
      console.error('Error creating doctor:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/doctors/:id
// @desc    Update a doctor
// @access  Private
router.put(
  '/:id',
  [
    auth,
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('specialty').trim().notEmpty().withMessage('Specialty is required'),
    body('serviceType')
      .isArray({ min: 1 })
      .withMessage('At least one service type is required')
      .custom(value => value.every(type => ['Online', 'Offline'].includes(type)))
      .withMessage('Invalid service type'),
    body('email').isEmail().withMessage('Invalid email'),
    body('feesAmount')
      .isFloat({ min: 0 })
      .withMessage('Fees amount must be a positive number'),
    body('currency')
      .isIn(['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'])
      .withMessage('Invalid currency'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation errors', errors: errors.array() });
    }

    try {
      const {
        firstName,
        middleName,
        lastName,
        specialty,
        serviceType,
        email,
        phone,
        feesAmount,
        currency,
      } = req.body;

      // Check if email is taken by another doctor
      const existingDoctor = await Doctor.findOne({ email, _id: { $ne: req.params.id } });
      if (existingDoctor) {
        return res.status(400).json({ message: 'Doctor with this email already exists' });
      }

      const doctor = await Doctor.findById(req.params.id);
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }

      doctor.firstName = firstName;
      doctor.middleName = middleName || '';
      doctor.lastName = lastName;
      doctor.specialty = specialty;
      doctor.serviceType = serviceType;
      doctor.email = email;
      doctor.phone = phone || '';
      doctor.feesAmount = feesAmount;
      doctor.currency = currency;

      await doctor.save();
      res.json({ doctor });
    } catch (error) {
      console.error('Error updating doctor:', error.message);
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Invalid doctor ID' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   DELETE /api/doctors/:id
// @desc    Delete a doctor
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    await Doctor.deleteOne({ _id: req.params.id });
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Error deleting doctor:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Invalid doctor ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;