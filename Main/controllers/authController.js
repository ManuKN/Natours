const jwt = require('jsonwebtoken');
const Users = require('../models/userModel');
const catchAsych = require('../utils/catchAsych');
const AppError = require('../utils/appError')

exports.signup = catchAsych(async (req, res, next) => {
  const newUser = await Users.create({
    name:req.body.name,
    email:req.body.email,
    password:req.body.password,
    passwordConfirm:req.body.passwordConfirm
  });

  //here we r sending jwt token to the user first argu is payload object which contain all the data that we r going to store inside token and second argu is the secret key and the third argu is the options where inside we provide the expiresIN and many more if we want
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });

  res.status(200).json({
    status: 'Success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = async (req,res,next) =>{
    const{email , password} = req.body;

    //check if the email and password exist
    if(!email || !password)
        {
            return next(new AppError("Your email or password is incorrect" ,  400))
        }
    
    //check the user exist and the password is correct    
    const user = await Users.findOne({email}).select(+password);
    console.log('user details',user);
    
    //If everthing is ok then send a Token
    const token = '';
    res.status(200).json({
        status:'Sccuess',
        token
    })    
}
