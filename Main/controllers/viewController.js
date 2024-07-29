const Tour = require('../models/tourModel');
const catchAsych = require('../utils/catchAsych')

exports.getOverview = catchAsych(async(req, res) => {

  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
})

exports.getTour = catchAsych(async(req, res) => {
const tour = await Tour.findOne({slug:req.params.slug}).populate({path: 'reviews' , fields:'review rating user'});
console.log('selcted tour',tour)
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
    tour
  });
});