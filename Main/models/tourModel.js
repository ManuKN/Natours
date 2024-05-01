const mongoose = require('mongoose');
const slugify = require('slugify');

const tourschema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
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
  },
  ratingAverage: {
    type: Number,
    default: 4.5,
  },
  ratingQuantity: {
    type: Number,
    deafult: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a Price'],
  },
  priceDiscount: Number,
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
  startDates:[Date]
},
{toJSON:{virtuals:true},
toObject:{virtuals:true}}
);

tourschema.virtual('durationWeeks').get(function(){
  return this.duration/7   
})

tourschema.pre('save',function(next){
  this.slug = slugify(this.name , {lower:true}) 
  next()
})

// eslint-disable-next-line prefer-arrow-callback
tourschema.pre('save',function(next){
  console.log('im executing before the docs svaed in the database')
  next()
})

// eslint-disable-next-line prefer-arrow-callback
tourschema.post('save',function(doc,next){
  console.log(doc)
  next()
})

const Tour = mongoose.model('Tour', tourschema);

module.exports = Tour;
