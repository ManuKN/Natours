const mongoose = require('mongoose');
const validator = require('validator');

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
});

const Users = mongoose.model('User', userSchema);

module.exports = Users;
