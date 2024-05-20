const jwt = require('jsonwebtoken');
const Users = require('../models/userModel');
const catchAsych = require('../utils/catchAsych');
const AppError = require('../utils/appError');

// eslint-disable-next-line arrow-body-style
const jwtToken = id => {
 return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  })
}

exports.signup = catchAsych(async (req, res, next) => {
  const newUser = await Users.create({
    name:req.body.name,
    email:req.body.email,
    password:req.body.password,
    passwordConfirm:req.body.passwordConfirm
  });

  //here we r sending jwt token to the user first argu is payload object which contain all the data that we r going to store inside token and second argu is the secret key and the third argu is the options where inside we provide the expiresIN and many more if we want
  const tokenforsignup = jwtToken(newUser._id)

  res.status(200).json({
    status: 'Success',
    token:tokenforsignup,
    userdata: {
      user: newUser,
    },
  });
});

exports.login = catchAsych(async (req,res,next) =>{
    const{email , password} = req.body;

    //check if the email and password exist
    if(!email || !password)
        {
            return next(new AppError("Your email or password is incorrect" ,  400))
        }
    
    //check the user exist and the password is correct    
    const user = await Users.findOne({email}).select('+password');
    console.log('user details',user);
    //const correct = await user.correctPassword(password , user.password);

    if(!user || !(await user.correctPassword(password , user.password))) 
    {
      return next(new AppError("Invalid password or email" , 401))
    }
    
    //If everthing is ok then send a Token
    const token = jwtToken(user._id);
    res.status(200).json({
        status:'Sccuess',
        token
    })    
})

exports.protect = catchAsych(async (req, res , next) => {
//Getting token and check of its there
let token
if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
  {
    token = req.headers.authorization.split(' ')[1];
  }

  if(!token){
    return next(new AppError('You are not logged in! PLease login to get access.' , 401))
  }

//Verification

//Check if User still exist

//check if the user changed password after the token was issued

  next()
} )