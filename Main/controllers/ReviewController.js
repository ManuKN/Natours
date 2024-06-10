const Review = require('../models/reviewModel')
const catchAsych = require('../utils/catchAsych')


exports.getAllReviews = catchAsych(async(req , res , next) => {
    const reviews = await Review.find()
    const results = reviews.length
    res.status(200).json({
        status:'success',
        results,
        data:{
            reviews
        }
    })
})

exports.AddNewReviews = catchAsych( async(req, res , next) => {
    console.log('requestbody',req.body)
    const newReview = await Review.create(req.body)
    res.status(201).json({
        status:'success',
        data:{
            review:newReview
        }
    })
})