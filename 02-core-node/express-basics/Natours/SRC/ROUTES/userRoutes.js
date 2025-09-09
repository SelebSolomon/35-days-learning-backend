const express = require('express');
const userController = require('../CONTROLLERS/userController');
const authController = require('../CONTROLLERS/authController');

const router = express.Router();
router.route('/signup').post(authController.signup);
router.route('/signin').post(authController.signin);

router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);
router
  .route('/updatePassword')
  .patch(authController.protect, authController.updatePassword);

router
  .route('/updateMe')
  .patch(authController.protect, userController.updateMe);

router
  .route('/deleteMe')
  .delete(authController.protect, userController.deleteMe);

// Authentication route for users

// LETS DO A CHAINING FOR BETTER ROUTING FOR USERS
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .post(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
