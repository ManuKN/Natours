const Tour = require('../models/tourModel');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.field = 'name,price,ratingAverage,summary,difficulty';
  next();
};

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'field'];
    excludedFields.forEach((el) => delete queryObj[el]);
    console.log(queryObj);

    //2)Advance Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));
    //{ duration: { gte: '5' } } to add $ sign we write above code
    //{ duration: { '$gte': '5' } }

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBY = this.queryString.sort.split(',').join(' ');
      console.log(sortBY);
      this.query.sort(sortBY);
      //sort('price ratingsAverage')
    } else {
      this.query = this.query.sort('-createdAt');
      //byDefault sort them by cretaedAt
    }
    return this;
  }

  limitfield() {
    if (this.queryString.field) {
      //query.select('name price duration difficulty'); to get into this format we wrote the below code
      const fieldsParams = this.queryString.field.split(',').join(' ');
      console.log(fieldsParams);
      this.query = this.query.select(fieldsParams);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1;
    const limit = this.queryString.limit * 1;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
    // if(req.query.page){
    //      const numDocs = await Tour.countDocuments();
    // if(skip >= numDocs) throw new Error('This page is not exist');
    // }
  }
}

//RouteHandlers
exports.getAllTours = async (req, res) => {
  //console.log(this.queryString);
  try {
    //Build Query

    //1)Filtering
    // const queryObj = { ...req.query };
    // const excludedFields = ['page', 'sort', 'limit', 'field'];
    // excludedFields.forEach((el) => delete queryObj[el]);
    // console.log(queryObj);

    // //2)Advance Filtering
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr));
    // //{ duration: { gte: '5' } } to add $ sign we write above code
    // //{ duration: { '$gte': '5' } }

    // let query = Tour.find(JSON.parse(queryStr));
    //other method of filtring data is by using special mongoose methods
    //const query =  Tour.find().where('duration').equals(5).where('difficulty').equals('easy');
    //here since the req.query have the same object with the query which we can put inside the findmethod we can use req.query instead of writing query object manually

    //3)Sorting
    // if (req.query.sort) {
    //   const sortBY = req.query.sort.split(',').join(' ');
    //   console.log(sortBY);
    //   query.sort(sortBY);
    //   //sort('price ratingsAverage')
    // } else {
    //   query = query.sort('-createdAt');
    //   //byDefault sort them by cretaedAt
    // }

    //4)Fields Limiting
    // if (req.query.field) {
    //   //query.select('name price duration difficulty'); to get into this format we wrote the below code
    //   const fieldsParams = req.query.field.split(',').join(' ');
    //   console.log(fieldsParams);
    //   query = query.select(fieldsParams);
    // } else {
    //   query = query.select('-__v');
    // }

    //5)Pagination
    // const page = req.query.page * 1;
    // const limit = req.query.limit * 1;
    // const skip = (page - 1)*limit;
    // query = query.skip(skip).limit(limit)

    // const numDocs = await Tour.countDocuments();
    // if(skip >= numDocs) throw new Error('This page is not exist');

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
