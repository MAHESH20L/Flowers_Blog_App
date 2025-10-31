const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  birthday: { type: Date, required: true },
  password: { type: String, required: true }
});


UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

// Prevent OverwriteModelError by checking existing models
const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;
