const express = require('express')
const tourController = require('../CONTROLLERS/tourController')
const router = express.Router()


// ROUTE PARAMS MIDDLEWARES
// router.param('id', tourController.checkId)


// LETS DO A CHAINING FOR BETTER ROUTING FOR TOURS
router.route('/tours-stats').get(tourController.getTourStats)
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan)


router.route('/top-5-cheap').get(tourController.aliasRoute,tourController.getAllTours)

router.route('/').get(tourController.getAllTours).post(tourController.createTour)
router.route('/:id').patch(tourController.updateTour).get(tourController.getTour).delete(tourController.deleteTour)


module.exports = router

