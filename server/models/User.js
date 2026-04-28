const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  nickname: {
    type: String,
    trim: true,
    maxlength: [50, 'Nickname cannot exceed 50 characters']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  settings: {
    darkMode: { type: Boolean, default: false },
    notificationsEnabled: { type: Boolean, default: true },
    timezone: { type: String, default: 'UTC' }
  },
  // Gamification fields
  gamification: {
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    badges: [{
      id: { type: String, required: true },
      name: { type: String, required: true },
      description: String,
      icon: String,
      earnedAt: { type: Date, default: Date.now }
    }]
  },
  // Social fields
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
