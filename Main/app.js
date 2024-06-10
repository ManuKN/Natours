const express = require('express');
const morgan = require('morgan');
// eslint-disable-next-line import/no-extraneous-dependencies
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const mongosanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

//Global MiddleWares

//helmet middleware
 app.use(helmet());

//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limit requests from same API
const limiter = rateLimiter({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this Ip , Please try again in  an hour',
});
app.use('/app', limiter);

//Body parser , reading data from body into req.body
//important point , this middleware here below reads the data into req.body and then only after that we can clean the data
app.use(express.json({limit:'10kb'})); //here we r limit the data that comes in the req.body to 10kb
//1)middleware to protect against noSql query injection
app.use(mongosanitize());

//2)middleware to protect against malicious code /data
app.use(xss());

//Prevent parameter pollution
app.use(hpp({ whitelist: ['duration','ratingsQuantity','ratingsAverage','maxGroupSize','difficulty','price'] }));

//Serving static files
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  console.log('Hello i am Middleware');
  next();
});

app.use((req, res, next) => {
  req.requestedTime = new Date().toISOString();
  console.log(req.headers);
  next();
});

//Routes
app.use('/app/v1/tours', tourRouter);
app.use('/app/v1/users', userRouter);
app.use('/app/v1/review',reviewRouter);

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
