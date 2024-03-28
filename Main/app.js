const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

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

app.use('/app/v1/tours', tourRouter);
app.use('/app/v1/users', userRouter);

// app.post('/',(req,res) =>{
//    res.send('U can Post any data from this URl')
// })

//Start Server
module.exports = app;