const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcyrpt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name field is required'],
  },
  email: {
    type: String,
    required: [true, 'Email field is required'],
    lowercase: true,
    unique: [true, 'User already exists with this email'],
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Email field is required'],
    minlenght: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Email field is required'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password is not the same',
    },
  },
  passwordChangedAt: Date,
  resetPasswordToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});
// DOCUMENT MIDDLEWARES 
userSchema.pre('save', async function (next) {
  // only run this if password was actually modified which mean changed
  if (!this.isModified('password')) return next();

  // hash the password with cost of 12
  this.password = await bcyrpt.hash(this.password, 12);
  // Delete confirm so that it wont be saved in the database
  this.passwordConfirm = undefined;

  next();
});
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.pre(/^find/, function(next) {
  // this point to the current query
  this.find({active: {$ne: false}})
  next()
})
// QUERY MIDDLEWARE 

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
  ) {
    return await bcyrpt.compare(candidatePassword, userPassword);
  };

  
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // That means the token was created before the password was changed → so the token is invalid (user must log in again).
    return JWTTimestamp < changedTimestamp;
  }
  // False means nothing was changed
  return false;
};

// DOnt forget never use an arrow function right here else you will wrong into big error that you cant find lol
userSchema.methods.createPasswordResetToken = function () {
  // create the token using crypto built in module
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
