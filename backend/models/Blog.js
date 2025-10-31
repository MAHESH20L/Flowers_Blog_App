const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    message: String,
    imageUrl: String,
    author: String, // should reference user or be filled in after authentication
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blog', blogSchema);
