const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController')

const app = express();

//MiddleWares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  console.log('Hello i am Middleware');
  next();
});

app.use((req, res, next) => {
  req.requestedTime = new Date().toISOString();
  next();
});

app.use('/app/v1/tours', tourRouter);
app.use('/app/v1/users', userRouter);

// app.post('/',(req,res) =>{
//    res.send('U can Post any data from this URl')
// })

app.all('*',(req , res , next) =>{
  // res.status(404).json({
  //   status:'Fail',
  //   message:`Can't find ${req.originalUrl} on this server!`
  // })

  // const err = new Error(`Can't find ${req.originalUrl} on this server!`)
  // err.status = 'fail'
  // err.statusCode = 404

  //here if we pass err as arumnet to next then express will consider that there is error so that it willk skip all next middleware and directly move to global middlware
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
  //calling AppError and sending errors so that express will direct to global middle ware 
})

app.use(globalErrorHandler)
//calling global middleware 

//Start Server
module.exports = app;
