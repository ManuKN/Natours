const express = require('express');
const tourController = require("../controllers/tourController");

const router = express.Router();

//router.param('id', tourController.checkIn);
router.route('/top-5-cheap').get(tourController.aliasTopTours ,tourController.getAllTours);

router.route('/tours-stats').get(tourController.getToursStats)
router.route('/montlyplan/:year').get(tourController.getMontlyPlan)

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
