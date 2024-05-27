const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const Users = require('../models/userModel');
const catchAsych = require('../utils/catchAsych');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email')


// eslint-disable-next-line arrow-body-style
const jwtToken = id => {
 return jwt.sign({ id }, process.env.JWT_SECRET, {
   expiresIn: process.env.JWT_EXPIRESIN,
 });
}
console.log(process.env.JWT_EXPIRESIN);

const createSendToken = (user , StatusCode , res) =>{
  const tokenforsignup = jwtToken(user._id)

  res.status(StatusCode).json({
    status: 'Success',
    token:tokenforsignup,
    userdata: {
      user:user,
    },
  });
}

exports.signup = catchAsych(async (req, res, next) => {
  const newUser = await Users.create({
    role: req.body.role,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    passwordResetToken: req.body.passwordResetToken,
    passwordResetExpires:req.body.passwordResetExpires
  });

  //here we r sending jwt token to the user first argu is payload object which contain all the data that we r going to store inside token and second argu is the secret key and the third argu is the options where inside we provide the expiresIN and many more if we want
  createSendToken(newUser , 200 , res)
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
    createSendToken(user , 200 , res)
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
const decoded = await promisify(jwt.verify)(token , process.env.JWT_SECRET);


//Check if User still exist
const currentUser = await Users.findById(decoded.id);
if(!currentUser){
  return next(new AppError('The user belonging to this token does no longer exist',401))
}

//check if the user changed password after the token was issued
   if(currentUser.PasswordChanged(decoded.iat))
   {
    return next(new AppError('User recently changed the password! please login again'))
   }
   console.log('Current User ',currentUser);
   //Grant access to protected route
   req.user = currentUser // if we want to pass data from one middleware to other we have to send that data through this req body only so this is y we r assigning/adding current user to req body object 
  next()
} )


//since we r passing  para to this fucntion middle will not receive any paramters no to get acces to the that params we just wrapped the middle inside a fucntion and got the roles as para to the outer function and the due to closure will get acces to the roles😉.
// eslint-disable-next-line arrow-body-style
exports.restrictTo = (...roles) =>{
 return (req , res , next) => {
  //roles[admin , lead-guide].role = user
   //here roles will be accssibel becauseof closure.
   if(!roles.includes(req.body.role)){
    return next(new AppError('you do not have permission to do this action',403))
   }
    next()
 }
}

exports.forgotPassword = async( req , res , next) =>{
  //1) get the user based  on Posted email
const user = await Users.findOne({email:req.body.email})
if(!user){
  return next(new AppError('User no loger exsist in our database' , 404))
}
  //2)Generate the random resetToken
const resetToken = user.createPasswordResetToken();
//we r saving all the data that we assigned in the instance method in the model like password expires and the passwordresettoken
await user.save({validateBeforeSave : false});
  //3)Send it to User's email
const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
 
const message = `Forgot your Password? Submit a PATCH with your new password and passwordConfirm to:${resetURL}.\n If your didn't forget your password,please ignore this email!`

try{
  sendEmail({
  email:user.email,
  subject:'Your password reset token (valid for 10min)',
  message
})

res.status(200).json({
  status:'Sccuess',
  message:'Token sent to email!'
})}
catch(err){
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save({validateBeforeSave : false});
  next(new AppError('There was an error sending the email! Please try again later' , 500));
}
}

exports.resetPassword = catchAsych(async(req ,res , next) => {
  //1)Get user based on the token

const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await Users.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  
  //2)If token has not expired , and there is a user with that token . then set the new password
  if(!user){
    return next(new AppError('Your token is invalid or expired',400))
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save(); //in this case we do not want trun off the validator cause we want validator to validate password and passwordconfirm r same😉

  //3)Update ChangesPropertyAy property for the user
  //4)Log the user in ,  send jwt 
  createSendToken(user , 200 , res)
})

exports.updatePassword = catchAsych(async (req,res,next) =>{
  //1)Get User from collection
  console.log('USer Object',req.user);
  const user = await Users.findById(req.user.id).select('+password');

  //2)Check if posted current password id correct
  if(!(await user.correctPassword(req.body.passwordCurrent , user.password))){
    return next(new AppError('Your current password is wrong. Please try again!',401));
  }

  //3)update the new password
  user.password = req.body.Newpassword;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save()
//User.findByIdAndUpdate will not work as intented that is y we r using save()

  //Login user and send jwt
  createSendToken(user , 200 , res)
})