const User = require('../models/userModel');
const catchAsych = require('../utils/catchAsych');

exports.getAllUsers = catchAsych(async (req, res, next) => {
  const users = await User.find()
  res.status(200).json({
    status: 'Sccuess',
    Users:{
      users
    }
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route is not yet defined',
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route is not yet defined',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route is not yet defined',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route is not yet defined',
  });
};
