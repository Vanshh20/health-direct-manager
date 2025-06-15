const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

async function addManager() {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');

    const email = 'manager@gmail.com'; // Change to desired email
    const password = 'Manager@123'; // Change to desired password

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      console.log('Manager already exists');
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Calculate age from date of birth
    const dateOfBirth = new Date('1980-01-01'); // Example date, update as needed
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }

    // Create new manager
    user = new User({
      email,
      password: hashedPassword,
      role: 'manager',
      name: 'John', // Required: First Name
      surname: 'Doe', // Required: Surname
      patronymicName: '', // Optional
      gender: 'Male', // Required, default
      dateOfBirth, // Required: Date of Birth
      age, // Auto-calculated
      residence: 'New York', // Required: City of Residence
      phoneNumber: '1234567890', // Optional
      additionalPhone: '', // Optional
      profilePicture: null, // Default to null
      profileCompleted: true, // Manager profile considered complete
    });

    await user.save();
    console.log('Manager added successfully:', email);

    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error adding manager:', error.message, error.stack);
  }
}

addManager();