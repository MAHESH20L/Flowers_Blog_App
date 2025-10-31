const express = require('express');
const multer = require('multer');
const Blog = require('../models/Blog');
const path = require('path');

const router = express.Router();

// Configure multer for uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// POST: Create blog
router.post('/', upload.single('image'), async (req, res) => {
    const { message, author } = req.body; // You can get 'author' from authentication middleware if JWT is used
    let imageUrl = '';
    if (req.file) imageUrl = `/uploads/${req.file.filename}`;
    const blog = new Blog({ message, imageUrl, author });
    await blog.save();
    res.json(blog);
});

// GET: Get all blogs
router.get('/', async (req, res) => {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
});

module.exports = router;
