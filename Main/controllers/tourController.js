const Tour = require('../models/tourModel');
const APIfeatures = require('../utils/apifeatures');
const catchAsych = require('../utils/catchAsych');
const factory = require('./handleFactory');
const AppError = require('../utils/appError');
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.field = 'name,price,ratingAverage,summary,difficulty';
  next();
};

//RouteHandlers
exports.getAllTours = factory.getAll(Tour);

exports.getTour = factory.getOne(Tour, { path: 'reviews' });

// eslint-disable-next-line arrow-body-style
// const catchAsych = fn => {
//   return (req , res , next) => {
//     fn(req , res ,next).catch(next)
//   }
// }

exports.createTour = factory.createOne(Tour);

//old way of creating document
// const newTour = new Tour({})
// newTour.save()

//New way of creating Documents
// try {

// } catch (err) {
//   res.status(400).json({ status: 'fail', message: err });
// }

//Do not update password with this
exports.updateTour = factory.UpdateOne(Tour);

exports.deleteTour = factory.deleteOne(Tour);

exports.getToursStats = catchAsych(async (req, res) => {
  const stats = await Tour.aggregate([
    { $match: { ratingAverage: { $gte: 4.5 } } },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        avgRating: { $avg: '$ratingAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: {
        avgPrice: 1,
      },
    },
    // ,{
    //   $match:{_id:{$ne:'EASY'}}
    // }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMontlyPlan = catchAsych(async (req, res) => {
  const year = req.params.year * 1;
  // try{
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numToursStarts: -1 },
    },
    {
      $limit: 6,
    },
  ]);
  res.status(200).json({
    status: 'Success',
    result: plan.length,
    data: {
      plan,
    },
  });
  // }
  // catch(err){
  //   res.status(404).json({
  //     status:'Fail',
  //     message:err
  //   })
  // }
});

///tours-within/:distance/center/:latlng/unit/:unit
//tours-within/233/center/34.095985771295624, -118.32288708727299/unit/mi

exports.getTourwithin = catchAsych(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  //we need to convert the distance into radius by dividing the distance with radius of the earth and we also make use of unit cause earth radius is diffrent in miles and km.
  // why we did this way beacuse ,monogo db expects the radius in radians
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat && !lng) {
    return next(
      new AppError(
        'Please provide latitide and langitude in the format of lat,lng',
        400,
      ),
    );
  }
  //very important for finding geospacial locations
  //here geoWithin operator will pick the tours which r within certain radius of the sphere
  //As we mentioned in the centerSphere this operator need lng and lat in array and the radius of the sphere to find the tours which r within that sphere
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      data: tours,
    },
  });
});

exports.getDistances = async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const multiplier = unit === 'mi' ? 0.000621371  : 0.001; // here we r sending multiplier for the ditance in order to show result in miles and km based on what user sent in the url

  if (!lat && !lng) {
    return next(
      new AppError(
        'Please provide latitide and langitude in the format of lat,lng',
        400,
      ),
    );
  }

  const distance = await Tour.aggregate([
    {
      //geoNear stage is the only first stage that we have to use in order to find the distance u can also refer the wrriten note book get more idea of this stage
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1], // near is the another mongoose stage where we wan to mention the from which we need to calculate the distance and the type we should mention
        },
        distanceField: 'distance', // this is the field that will be added to in the schema to show the distance
        distanceMultiplier: multiplier, // we we r dividing 0.001 or 0.000621371 with to convert the distance to km and miles
      },
    },
    {
      //we used project to show/project only name and distance in the result
      $project: {
        name: 1,
        distance: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      distances: distance,
    },
  });
};
