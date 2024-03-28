const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

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
  if (!tour) {
    res.status(404).json({
      status: 'Fail',
      data: {
        message: 'Invalid ID',
      },
    });
  }

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
    }
  );
};

exports.updateTour = (req, res) => {
  console.log(req.body);
  const id = req.params.id * 1;
  if (id > tours.length) {
    res.status(404).json({
      status: 'Fail',
      data: {
        message: 'Invalid Id',
      },
    });
  }

  res.status(200).json({
    status: 'Success',
    data: {
      message: 'Updated Data bro  ',
    },
  });
};

exports.deleteTour = (req, res) => {
  const id = req.params.id * 1;
  if (id > tours.length) {
    res.status(404).json({
      status: 'Fail',
      data: {
        message: 'Invalid Id',
      },
    });
  }

  res.status(204).json({
    status: 'Success',
    data: null,
  });
};
