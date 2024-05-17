const AppError = require('../utils/appError');

const handleValidationErrorDB = (err) => {
  let errors = Object.values(err.errors).map((el) => el.message);
  console.log('Error Message', errors);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  let value = err.keyValue.name;
  const message = `Duplicate value field ${value} please use other value!`;
  return new AppError(message, 400);
};

const handleCastErrorDB = (err) => {
  console.log('this is executing');
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    Error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //if the err is operatrional then send this error message to client
  console.log('ís this operational', err.isOperational);
  if (err.isOperational === true) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  //if the error is programmical then we just want to hide the detail of the error and show only the this simple message to the client
  else {
    console.log('Error 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something is really wrong',
    });
  }
};
module.exports = (err, req, res, next) => {
  console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { name: err.name, message: err.message };
    error = Object.assign(error, err);
    //console.log('this is production error',error)
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    sendErrorProd(error, res);
  }
};
//Global middleware for error handling
