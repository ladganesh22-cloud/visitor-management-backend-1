const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const schema = mongoose.Schema;

const userSchema = new schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'security', 'host', 'visitor'],
    default: 'security'
  }
}, { timestamps: true });

// Registration method
userSchema.statics.createRegisterUser = async function (name, email, password, role) {

  if (!name || !email || !password) {
    throw new Error('All fields are required.');
  }

  if (!validator.isEmail(email)) {
    throw new Error('Invalid email format.');
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error('Password is not strong enough.');
  }

  const existingUser = await this.findOne({ email });

  if (existingUser) {
    throw new Error('Email already in use');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await this.create({ name, email, password: hashedPassword, role });
  return user;
};

// Login method
userSchema.statics.loginUser = async function (email, password) {

  if (!email || !password) {
    throw new Error('All fields are required.');
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw new Error('Invalid email or password.');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Invalid email or password.');
  }

  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
