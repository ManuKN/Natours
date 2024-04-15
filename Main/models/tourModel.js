const mongoose = require('mongoose');

const tourschema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a durations'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a maxGroupSize'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
  },
  ratingAverage: {
    type: Number,
    default: 4.5,
  },
  ratingQuantity: {
    type: Number,
    deafult: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a Price'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have description'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have Cover image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select:false
  },
  startDates:[Date]
});

const Tour = mongoose.model('Tour', tourschema);

module.exports = Tour;
