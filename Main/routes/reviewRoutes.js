const express = require('express');
const ReviewController = require('../controllers/ReviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });
//Post /tour/2132/review
//GET /tour/1313/review
// POST /review

router
  .route('/')
  .get(ReviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    ReviewController.setUserandTourIds,
    ReviewController.AddNewReviews,
  );

router
  .route('/:id')
  .get(ReviewController.GetReview)
  .delete(ReviewController.deleteReview)
  .patch(ReviewController.updateReview);

module.exports = router;
