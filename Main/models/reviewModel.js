const mongoose = require('mongoose');
const Tour = require("./tourModel")

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'we need your review'],
    },
    rating: {
      type: Number,
      required: [true, 'Please provide the ratings'],
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must be wrote by user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }, // we should keep this virtuals outside on the schema object thats why we kept virtuals here
  },
);

reviewSchema.index({tour:1 , user:1},{unique:true});

//Query middleware
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calAverageRating = async function(tourID){
  //In this static method this points to current model
  const stats = await this.aggregate([
   {$match : {tour:tourID}},
   {$group:{
    _id:'$tour',
    nRating:{$sum:1},
    avgRating:{$avg:'$rating'}
   }}
  ])
  console.log('review Stats' , stats);
  await Tour.findByIdAndUpdate(tourID , {
    ratingsQuantity : stats[0].nRating,
    ratingAverage : stats[0].avgRating
  })
}

reviewSchema.post('save',function(){
  //here this refers to current document
  this.constructor.calAverageRating(this.tour)
})

reviewSchema.pre(/^findOneAnd/, async function(next){
  //we attached the result of query below to this.r query object in order to get access to the data in the post middleware via r variable
  //this.findOne() gets the 'old' reviews document from the  database.
  //but we r only intrested in the tourid , so that it does not matter
  //this.r creates a new property in the query object
 this.r = await this.findOne();
 //console.log('this is this.r',this.r);
 next();
})

reviewSchema.post(/^findOneAnd/,async function(){
  //await this.findOne() will not work here , query as alredy executed
  //instead we  retrive  the old review document's tour ID from the this.r.tour 
  //since its a post middleware we will update the avgrating and quantityt bu calling static method
 await this.r.constructor.calAverageRating(this.r.tour)
})

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
