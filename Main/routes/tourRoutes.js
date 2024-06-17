const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

//router.param('id', tourController.checkIn);

//POST tour/213123/reviews
//GET tour/234134/reviews
//GET tour/213431/reviews/232344

// router.route('/:tourId/reviews').post(authController.protect,authController.restrictTo('user'),reviewController.AddNewReview)
router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/tours-stats').get(tourController.getToursStats);
router
  .route('/montlyplan/:year')
  .get(authController.restrictTo('user'), tourController.getMontlyPlan);

router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getTourwithin);
//tours-with?distance=233&center=-40,45&unit=mi
//tours-within/233/center/-40,45/unit/mi  // this approch is the standard way of writing url 

router.route('/distance/:latlng/unit/:unit').get(tourController.getDistances);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(authController.protect, tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(authController.protect, tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

module.exports = router;
