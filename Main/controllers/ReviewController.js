const Review = require('../models/reviewModel');
const catchAsych = require('../utils/catchAsych');

exports.getAllReviews = catchAsych(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) {
    filter = {tour : req.params.tourId}
  }
  const reviews = await Review.find(filter);
  const results = reviews.length;
  res.status(200).json({
    status: 'success',
    results,
    data: {
      reviews,
    },
  });
});

exports.AddNewReviews = catchAsych(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});
