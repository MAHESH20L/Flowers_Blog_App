const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Blog = require('../models/Blog');

// Get all users with names, birthdays, and posts
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'name birthday');
    const blogs = await Blog.find({}, 'author message createdAt');

    const usersWithPosts = users.map(user => ({
      _id: user._id,
      name: user.name,
      birthday: user.birthday,
      posts: blogs.filter(blog => blog.author === user.name).map(blog => ({
        message: blog.message,
        createdAt: blog.createdAt
      }))
    }));
    res.json(usersWithPosts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users and posts" });
  }
});

// Update user details by admin
router.put('/users/:id', async (req, res) => {
  const { name, birthday } = req.body;

  try {
    const user = await User.findByIdAndUpdate(req.params.id, { name, birthday }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update user' });
  }
});

module.exports = router;
