const Tour = require('../models/tourModel');
const APIfeatures = require('../utils/apifeatures');
const catchAsych = require('../utils/catchAsych');
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
exports.getAllTours = catchAsych(async (req, res) => {
  const features = new APIfeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitfield()
    .paginate();
  //Execute Query
  const tours = await features.query;
  //Send Response
  res.status(200).json({
    status: 'Success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsych(async (req, res) => {
  //older way of getteing data by ID
  //Tour.findOne({ _id: req.params.id});
  //new way of getting data by ID
  const tour = await Tour.findById(req.params.id).populate('reviews')
    //we used populate function to populate the user based on the userID mentioned in the guides in model amd also we used select to remove the data that we do not want to show in the result
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

// eslint-disable-next-line arrow-body-style
// const catchAsych = fn => {
//   return (req , res , next) => {
//     fn(req , res ,next).catch(next)
//   }
// }

exports.createTour = catchAsych(async (req, res, next) => {
  // console.log(req.body)
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tours: newTour,
    },
  });

  //old way of creating document
  // const newTour = new Tour({})
  // newTour.save()

  //New way of creating Documents
  // try {

  // } catch (err) {
  //   res.status(400).json({ status: 'fail', message: err });
  // }
});

exports.updateTour = catchAsych(async (req, res) => {
  //console.log(req.body);
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'Success',
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsych(async (req, res) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

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
