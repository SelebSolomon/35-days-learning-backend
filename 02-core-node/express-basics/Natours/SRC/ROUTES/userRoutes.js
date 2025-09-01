const express = require('express')
const userController = require('../CONTROLLERS/userController')
const router = express.Router()



// LETS DO A CHAINING FOR BETTER ROUTING FOR USERS
router.route('/').get(userController.getAllUsers).post(userController.createUser)
router.route('/:id').get(userController.getUser).post(userController.updateUser).delete(userController.deleteUser)

module.exports = router