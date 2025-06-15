const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET /api/profile
// @desc    Get manager profile
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user || user.role !== 'manager') {
      return res.status(404).json({ message: 'Manager not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/profile
// @desc    Update manager profile
// @access  Private
router.put('/', auth, async (req, res) => {
  const {
    name,
    surname,
    patronymicName,
    gender,
    dateOfBirth,
    age,
    residence,
    profilePicture,
  } = req.body;

  // Validate required fields
  if (!name || !surname || !gender || !dateOfBirth || !age || !residence) {
    return res.status(400).json({ message: 'Please fill in all required fields' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'manager') {
      return res.status(404).json({ message: 'Manager not found' });
    }

    // Update fields
    user.name = name;
    user.surname = surname;
    user.patronymicName = patronymicName || '';
    user.gender = gender;
    user.dateOfBirth = new Date(dateOfBirth);
    user.age = parseInt(age);
    user.residence = residence;
    user.profilePicture = profilePicture ? Buffer.from(profilePicture, 'base64') : user.profilePicture;
    user.profileCompleted = true;

    await user.save();
    res.json({ user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;