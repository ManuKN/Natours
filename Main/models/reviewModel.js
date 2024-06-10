const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'we need your review'],
    },
    rating: {
      type: Number,
      required: [true, 'Please provide the ratings'],
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId, 
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must be wrote by user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }, // we should keep this virtuals outside on the schema object thats why we kept virtuals here
  },
);


//Query middleware
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: '-__v -passwordChangedAt',
  });
  next();
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'tour',
    select: '-__v -passwordChangedAt',
  });
  next();
});

const Review = mongoose.model('Review',reviewSchema);
module.exports = Review;