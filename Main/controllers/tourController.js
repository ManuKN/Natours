const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);

exports.checkIn = (req, res, next, val) => {
  console.log(`The id is: ${val}`);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'Fail',
      data: {
        message: 'Invalid Id',
      },
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  console.log('Im checkBody middleware');

  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'Fail',
      data: {
        message: 'No name and price in the body',
      },
    });
  }
  next();
};

//RouteHandlers
exports.getAllTours = (req, res) => {
  console.log(req.requestedTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestedTime,
    result: tours.length,
    data: {
      tours: tours,
    },
  });
};

exports.getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  // if(id > tours.length){

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  // console.log(req.body)

  const newId = tours[tours.length - 1].id + 1;
  console.log(newId);
  const newtour = Object.assign({ id: newId }, req.body);
  tours.push(newtour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tours: newtour,
        },
      });
    },
  );
};

exports.updateTour = (req, res) => {
  console.log(req.body);
  const id = req.params.id * 1;

  res.status(200).json({
    status: 'Success',
    data: {
      message: 'Updated Data bro  ',
    },
  });
};

exports.deleteTour = (req, res) => {
  const id = req.params.id * 1;

  res.status(204).json({
    status: 'Success',
    data: null,
  });
};
