const User = require('./../MODELS/userModel');
const catchAsync = require('../UTILS/catchAsync');
const AppError = require('./../UTILS/AppError');

// USERS CONTROLLERS

const filteredObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  // SEND RESPONSE
  res.status(200).json({
    success: true,
    result: users.length,
    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) create error if user tryies to update password data
  if (req.body.password || req.body.passwordConfirm) {
    next(
      new AppError(
        'This route is not for update password, please use the /updatePassword',
        400
      )
    );
  }
  //   we field out the fields that is necessary that we want to update
  const filteredBody = filteredObj(req.body, 'name', 'email');
  // 2) update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: {
      user: null,
    },
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    success: 'error',
    message: 'this route is not yet implemented',
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    success: 'error',
    message: 'this route is not yet implemented',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    success: 'error',
    message: 'this route is not yet implemented',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    success: 'error',
    message: 'this route is not yet implemented',
  });
};
