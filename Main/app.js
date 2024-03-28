const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();

//MiddleWares
app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
  console.log('Hello i am Middleware');
  next();
});

app.use((req, res, next) => {
  req.requestedTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//RouteHandlers
const getAllTours = (req, res) => {
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

const getTour = (req, res) => {
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

const createTour = (req, res) => {
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

const updateTour = (req, res) => {
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

const deleteTour = (req, res) => {
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

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route is not yet defined',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route is not yet defined',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route is not yet defined',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route is not yet defined',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route is not yet defined',
  });
};
// app.get('/app/v1/tours', getAllTours);

// app.get('/app/v1/tours/:id', getTour);

// app.post('/app/v1/tours', createTour);

// app.patch('/app/v1/tours/:id', updateTour);

// app.delete('/app/v1/tours/:id', deleteTour);

//Routes
const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route('/').get(getAllTours).post(createTour);
userRouter.route('/').get(getAllUsers).post(createUser);

tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

app.use('/app/v1/tours', tourRouter);
app.use('/app/v1/users', userRouter);
// app.post('/',(req,res) =>{
//    res.send('U can Post any data from this URl')
// })

//Start Server
const Port = 3000;
app.listen(Port, () => {
  console.log(`App running on ${Port}`);
});
