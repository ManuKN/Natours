const Tour = require('../models/tourModel');
const APIfeatures = require('../utils/apifeatures');
const catchAsych = require('../utils/catchAsych');
const factory = require("./handleFactory")
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
exports.getAllTours = factory.getAll(Tour)

exports.getTour = factory.getOne(Tour, { path: 'reviews' });

// eslint-disable-next-line arrow-body-style
// const catchAsych = fn => {
//   return (req , res , next) => {
//     fn(req , res ,next).catch(next)
//   }
// }

exports.createTour = factory.createOne(Tour)

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
