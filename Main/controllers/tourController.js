const Tour = require('../models/tourModel');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

//RouteHandlers
exports.getAllTours = async (req, res) => {
  //console.log(req.query);
  try {
    //Build Query

    //1)Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'field'];
    excludedFields.forEach((el) => delete queryObj[el]);
    console.log(queryObj);

    //2)Advance Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));
    //{ duration: { gte: '5' } } to add $ sign we write above code
    //{ duration: { '$gte': '5' } }

    let query = Tour.find(JSON.parse(queryStr));
    //here since the req.query have the same object with the query which we can put inside the findmethod we can use req.query instead of writing query object manually

    //3)Sorting
    if (req.query.sort) {
      const sortBY = req.query.sort.split(',').join(' ');
      console.log(sortBY);
      query.sort(sortBY);
      //sort('price ratingsAverage')
    } else {
      query = query.sort('-createdAt');
      //byDefault sort them by cretaedAt
    }

    //4)Fields Limiting
    if (req.query.field) {
      //query.select('name price duration difficulty'); to get into this format we wrote the below code
      const fieldsParams = req.query.field.split(',').join(' ');
      console.log(fieldsParams);
      query = query.select(fieldsParams);
    } else {
      query = query.select('-__v');
    }

    //5)Pagination
    const page = req.query.page * 1;
    const limit = req.query.limit * 1;  
    const skip = (page - 1)*limit;
    query = query.skip(skip).limit(limit)

    const numDocs = await Tour.countDocuments();
    if(skip >= numDocs) throw new Error('This page is not exsist');


    //Execute Query
    const tours = await query;
    //other method of filtring data is by using special mongoose methods
    //const query =  Tour.find().where('duration').equals(5).where('difficulty').equals('easy');
    //Send Response
    res.status(200).json({
      status: 'Success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  //older way of getteing data by ID
  //Tour.findOne({ _id: req.params.id});

  try {
    //new way of getting data by ID
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
    });
  }
};

exports.createTour = async (req, res) => {
  // console.log(req.body)

  //old way of creating document
  // const newTour = new Tour({})
  // newTour.save()

  //New way of creating Documents
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tours: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};

exports.updateTour = async (req, res) => {
  //console.log(req.body);
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err,
    });
  }
};
