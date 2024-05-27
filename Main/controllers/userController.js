const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsych = require('../utils/catchAsych');

const filteredObj = (obj , ...allowedRoles) =>{
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if(allowedRoles.includes(el))  newObj[el] = obj[el]
  })
  return newObj
}

exports.getAllUsers = catchAsych(async (req, res, next) => {
  const users = await User.find()
  res.status(200).json({
    status: 'Sccuess',
    Users:{
      users
    }
  });
});

exports.updateMe = catchAsych(async (req , res , next) => {
  //1) show error if the user trying to change the password here
  if(req.body.password || req .body.passwordConfirm){
    return next(new AppError('If ur trying to change the password please use this /updateMyPassword Route' , 400))
  }

  
// const user = await User.findById(req.user.id)
// user.name = "Manu"
//here we can not user user.save() cause there r fields which r given required which will then showup error to avoid this will use findByIdAndUpdate😍
// await user.save()
//2) here we have to filter unwanted fileds which r not allowed to update
const filteredBody = filteredObj(req.body , 'name' , 'email') 

//3) Update the user
//here we used new: true to make sure that this will create new updated object and also run validators we mentioned in the model
const updatedUser = await User.findByIdAndUpdate(req.user.id , filteredBody , {new:true , runValidators:true})
console.log(updatedUser)
  res.status(200).json({
    status:'sccuess',
    data:{
      user:updatedUser
    }
  }) 

})

exports.deleteMe = catchAsych(async(req , res , next) => {
  await User.findByIdAndUpdate(req.user.id,{active:false})
  res.status(204).json({
    status:"success",
    data:null
  })
})

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
