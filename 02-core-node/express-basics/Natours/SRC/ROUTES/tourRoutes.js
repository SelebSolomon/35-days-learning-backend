const express = require('express')
const tourController = require('../CONTROLLERS/tourController')
const router = express.Router()


// ROUTE PARAMS MIDDLEWARES
router.param('id', tourController.checkId)


// LETS DO A CHAINING FOR BETTER ROUTING FOR TOURS

router.route('/').get(tourController.getAllTours).post(tourController.checkBody, tourController.createTour)
router.route('/:id').patch(tourController.updateTour).get(tourController.getTour).delete(tourController.deleteTour)

module.exports = router

