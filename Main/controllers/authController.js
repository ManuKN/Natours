const Users = require('../models/userModel');
const catchAsych = require('../utils/catchAsych');

exports.signup = catchAsych(async (req, res, next) => {
  const newUser = await Users.create(req.body);

  res.status(200).json({
    status: 'Success',
    data: {
      user: newUser,
    },
  });
});
