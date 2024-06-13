const catchAsych = require('../utils/catchAsych');
const AppError = require('../utils/appError');
const APIfeatures = require('../utils/apifeatures');

exports.deleteOne = (Model) =>
  catchAsych(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document found with this Id', 404));
    }
    res.status(204).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.UpdateOne = (Model) =>
  catchAsych(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(
        new AppError('We are not able to find this document with this ID', 404),
      );
    }

    res.status(200).json({
      status: 'Success',
      data: {
        doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsych(async (req, res, next) => {
    // console.log(req.body)
    const newTour = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tours: newTour,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsych(async (req, res, next) => {
    //older way of getteing data by ID
    //Tour.findOne({ _id: req.params.id});
    //new way of getting data by ID
    const query = Model.findById(req.params.id);
    if (popOptions) query.populate(popOptions);
    const doc = await query;

    if (!doc)
      return next(new AppError('Sorry we could not able to find this🥺', 404));
    // const tour = await Model.findById(req.params.id).populate('reviews');
    //we used populate function to populate the user based on the userID mentioned in the guides in model amd also we used select to remove the data that we do not want to show in the result
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsych(async (req, res, next) => {
    //this filter we added cause in tour router we have the route where we get the tourId so that we can get the reviews of the sepcific ID tour
    let filter = {};
    if (req.params.tourId) {
      filter = { tour: req.params.tourId };
    }
    const features = new APIfeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitfield()
      .paginate();
    //Execute Query
    const doc = await features.query;
    if (!doc)
      return next(
        new AppError(
          'Sorry something went wrong we could not able to find docs',
          404,
        ),
      );
    //Send Response
    res.status(200).json({
      status: 'Success',
      results: doc.length,
      data: {
        doc,
      },
    });
  });
