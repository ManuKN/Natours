const Users = require('../models/userModel');
const catchAsych = require('../utils/catchAsych');

exports.signup = catchAsych(async (req, res, next) => {
  const newUser = await Users.create({
    name:req.body.name,
    email:req.body.email,
    password:req.body.password,
    passwordConfirm:req.body.passwordConfirm
  });

  res.status(200).json({
    status: 'Success',
    data: {
      user: newUser,
    },
  });
});
