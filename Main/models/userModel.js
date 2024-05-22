const mongoose = require('mongoose');
const validator = require('validator');
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    minLength: [4, 'A must have a name of 10 charecters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: [8, 'Your password should be atleast 8 charecters'],
    select:false
  },
  role:{
    type:String,
    enum:['user','guide','lead-guide','admin'],
    default:'user'
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      //This callback function(validator) will only works for Create and Save methods
      validator: function (el) {
        return el === this.password;
      },
      message: 'Your password is not matching',
    },
  },
  passwordChangedAt:Date
});

userSchema.pre('save' ,async function(next){
    // this will check if the password is modified or not using mongoose bulitin isModified method
    if(!this.isModified('password')) return next();

    //hash the password with cost 12
    this.password = await bcrypt.hash(this.password , 12); 

    // removing this passwordConfirm before saving to DB
    this.passwordConfirm = undefined;

    next();
})

//static instance method to check the passsword that is stored in db and the password that user entered are same 
userSchema.methods.correctPassword =  async function(candidatepassword , userpassword){
  console.log(candidatepassword , userpassword)
  return await bcrypt.compare(candidatepassword,userpassword)
}

userSchema.methods.PasswordChanged = function(JwtCreateAt){
  if(this.passwordChangedAt){
    const changedformat = parseInt(this.passwordChangedAt.getTime()/1000 , 10)
    return JwtCreateAt < changedformat
  }
  return false
}

const Users = mongoose.model('User', userSchema);

module.exports = Users;
