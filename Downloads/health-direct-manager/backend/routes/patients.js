const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// Get all patients
router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Failed to fetch patients', error: error.message });
  }
});

// Get a single patient by ID
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ message: 'Failed to fetch patient', error: error.message });
  }
});

// Add a new patient
router.post('/', async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      gender,
      dateOfBirth,
      telephone,
      additionalPhone,
      email,
      comments,
    } = req.body;

    const patient = new Patient({
      firstName,
      middleName,
      lastName,
      gender,
      dateOfBirth,
      telephone,
      additionalPhone,
      email,
      comments,
    });

    await patient.save();
    res.status(201).json({ message: 'Patient added successfully', patient });
  } catch (error) {
    console.error('Error adding patient:', error);
    res.status(400).json({ message: 'Failed to add patient', error: error.message });
  }
});

module.exports = router;