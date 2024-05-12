/* eslint-disable prefer-arrow-callback */
const mongoose = require('mongoose');
const slugify = require('slugify');
//const validator = require('validator')

const tourschema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    maxLength:[40,'A tour name must have atleast 40 charecters'],
    minLength:[10,'A tour name must have atleast 10 charecters'],
    //validate: [validator.isAlpha,'name must contains only charecters'],
    unique: true,
  },
  slug:String,
  duration: {
    type: Number,
    required: [true, 'A tour must have a durations'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a maxGroupSize'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum:{
      values:['easy','difficult','medium'],
      message:'Diificulty must be either: easy, difficulty , medium'
    }
  },
  ratingAverage: {
    type: Number,
    default: 4.5,
    min:[1,'Ratings must be above 1.0'],
    max:[5,'Ratings must be below 5.0']
  },
  ratingQuantity: {
    type: Number,
    deafult: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a Price'],
  },
  priceDiscount:{
    type:Number,
    validate:{
    validator:function(val){
   return this.price > val
    },
    message:'PriceDiscount ({VALUE}) should ve lessthan regular price'
  }
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have description'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have Cover image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select:false
  },
  startDates:[Date],
  secretTour:Boolean
},
{toJSON:{virtuals:true},
toObject:{virtuals:true}}
);

//this is virtual properties
tourschema.virtual('durationWeeks').get(function(){
  return this.duration/7   
})

//this is Slug for docs middleware
tourschema.pre('save',function(next){
  this.slug = slugify(this.name , {lower:true}) 
  next()
})

//This is document Middleware runs before .save() and .create()
// eslint-disable-next-line prefer-arrow-callback
// tourschema.pre('save',function(next){
//   console.log('im executing before the docs saved in the database')
//   next()
// })

// eslint-disable-next-line prefer-arrow-callback
// tourschema.post('save',function(doc,next){
//   console.log(doc)
//   next()
// })



//This is Query Middleware
tourschema.pre(/^find/,function(next){
  this.find({secretTour: {$ne:true}})
  this.start = Date.now();
  next()
})

tourschema.post(/^find/,function(docs,next){
  console.log(`this took ${Date.now() - this.start} milliseconds to execute`)
  //console.log(docs)
  next()
})

tourschema.pre('aggregate',function(next){
  this.pipeline().unshift({$match:{secretTour:{$ne : true}}})
  console.log(this.pipeline())
  next()
})

const Tour = mongoose.model('Tour', tourschema);

module.exports = Tour;
