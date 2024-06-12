const express = require('express');
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");
const reviewRouter = require("./reviewRoutes");

const router = express.Router();

//router.param('id', tourController.checkIn);

//POST tour/213123/reviews
  //GET tour/234134/reviews
  //GET tour/213431/reviews/232344

  // router.route('/:tourId/reviews').post(authController.protect,authController.restrictTo('user'),reviewController.AddNewReview)
router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(tourController.aliasTopTours ,tourController.getAllTours);
router.route('/tours-stats').get(tourController.getToursStats);
router.route('/montlyplan/:year').get(tourController.getMontlyPlan);

router
  .route('/')
  .get(authController.protect,tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

module.exports = router;
