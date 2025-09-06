const mongoose = require('mongoose');
const slugify = require('slugify')


const tourSchema = new mongoose.Schema({
    name:{
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      minlength: [10, 'A tour length must be above 10 and below 40'],
      maxlength: [40, 'A tour length must be belove 40 and above 10']
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy medium, difficult'
      }
    },

     ratingsAverage:{
      type: Number,
      default: 4.5,
      min: [1, 'Average rating must be above 1.0 and below 5'],
      max: [5, 'Average rating must be below 1.0 and above 1.0']

    },
     ratingsQuantity:{
      type: Number,
      default: 0
    },
     price:{
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate:{
        // this only points to current documents on New Documents creation
        validator:  function(val) {
        return val < this.price
      },
        message: 'the priceDiscount ({VALUE}) must be less than the price discount'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must a summary']
    },
     description: {
      type: String,
      trim: true
    },
    slug: String,
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    }

  },
{
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
})

// This is the virtual dom check the book and also look at the toJSON in the model too and drop attention 
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7
})
// DOCUMENT MIDDLEWARE: only runs for .save() and .create(); that is the post and get... it will not run for insertMany and the other methods
tourSchema.pre('save', function (next) {
 this.slug = slugify(this.name, {lower: true});
  next()
})
// tourSchema.pre('save', function (next) {
// console.log('something is running right here lol....') 
//  next()
// })

// tourSchema.post('save', function(doc, next){
//   console.log(doc)
//   next()
// })
// QUERY MIDDLEWARE: you can limit the fields you dont want people to see

/*
tourSchema.pre('find' , function(next){
  this.find({secretTour: {$ne: true}})
  next()
})
tourSchema.pre('findOne' , function(next){
  this.find({secretTour: {$ne: true}})
  next()
})
// STILL ON QUERY WE CAN USE REGULAR EXPRESS TO HANDLE IT IN SHORTER WAY
tourSchema.pre(/^find/, function(next) {
  this.start =  Date.now()
  this.find({secretTour: {$ne: true}})
  next()
})

tourSchema.post(/^find/, function(doc, next){
  console.log(`it took ${ Date.now() - this.start}`)
  console.log(doc)
  next()
})
*/
// AGGREGATE MIDDLEWARE 
tourSchema.pre('aggregate', function(next){
  this.pipeline().unshift({$match: {secretTour: {$ne: true}}})
  next()
  console.log(this.pipeline())
} )

  const Tour = mongoose.model('Tour', tourSchema)

  module.exports = Tour