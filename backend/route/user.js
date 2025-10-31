const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = express.Router();

// Signup endpoint
router.post('/signup', async (req, res) => {
  const { name, birthday, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, birthday, password: hashedPassword });
    await user.save();
    res.json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(400).json({ error: 'Name already exists or invalid data' });
  }
});

// Login endpoint with admin check
router.post('/login', async (req, res) => {
  const { name, password } = req.body;

  // Admin credentials inline check
  if (name === 'mahesh_pattimani' && password === 'mahesh@12') {
    return res.json({
      message: 'Admin login successful!',
      user: { name: 'mahesh_pattimani', isAdmin: true }
    });
  }

  // Normal user login
  const user = await User.findOne({ name });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

  res.json({
    message: 'Login successful!',
    user: {
      name: user.name,
      birthday: user.birthday,
      _id: user._id,
      isAdmin: false
    }
  });
});

module.exports = router;
