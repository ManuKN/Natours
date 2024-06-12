const express = require('express');
const ReviewController = require('../controllers/ReviewController');
const authController = require('../controllers/authController')

const router = express.Router({mergeParams:true})

router.route('/').get(ReviewController.getAllReviews).post(authController.protect , authController.restrictTo('user'),ReviewController.AddNewReviews);

module.exports = router;