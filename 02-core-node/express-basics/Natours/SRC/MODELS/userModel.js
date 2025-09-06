const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name field is required'],
  },
  email: {
    type: String,
    required: [true, 'Email field is required'],
  },
  photo: {
    type: String,
    required: [true, 'Email field is required'],
  },
  password: {
    type: String,
    required: [true, 'Email field is required'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Email field is required'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
