const Tour = require('./../MODELS/tourModel');
const APIfeatures = require('./../UTILS/apiFeatures');
const catchAsync = require('../UTILS/catchAsync');
const AppError = require('../UTILS/AppError');

// TOURS CONTROLLERS
/*
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../../dev-data/data/tours-simple.json`)
);
*/
// FIRST MIDDLE MIDDLEWARES FOR THE TOURS

/*
exports.checkId = (req, res, next, val) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      success: 'fail',
      message: 'no tour found',
    });
  }
  next();
};
*/

// SECOND MIDDLEWARE THAT WAS A CHALLANGE LOL

/*

exports.checkBody = (req, res, next) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(404).json({
      success: 'fail',
      message: 'no tour found',
    });
  }
  next();
};
*/

exports.aliasRoute = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields =
    'name,duration,maxGroupSize,difficulty,ratingsQuantity,summary';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  // EXECUTE THE QUERY
  const features = new APIfeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .fieldsLimit()
    .paginate();
  const tours = await features.query;
  // SEND RESPONSE
  res.status(200).json({
    success: true,
    result: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  // Tour.findOne({_id: req.params.id}) another way to do it lol

  if(!tour){
    return next(new AppError('No tour found with that ID', 404))
  }
  res.status(200).json({
    success: true,
    data: {
      tour,
    },
  });

  // const tour = tours.find((el) => el.id === id);
});

exports.createTour = catchAsync(async (req, res, next) => {
  // const newTour = new Tour({})
  // newTour.save()

  const newTour = await Tour.create(req.body);

  res.status(201).json({
    success: true,
    data: {
      tours: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

   if(!tour){
    return next(new AppError('No tour found with that ID', 404))
  }

  res.status(200).json({
    success: true,
    data: {
      updatedTour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

   if(!tour){
    return next(new AppError('No tour found with that ID', 404))
  }

  res.status(200).json({
    success: true,
    message: 'The tour has been deleted confirmed because we give you permission abi? lol',
    data: {
      tour: null,
    },
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: {_id: {$ne: 'EASY'}}
    // }
  ]);
  res.status(200).json({
    success: true,
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // this give you a number remember... if the params is 2020 it will be 2020 that is to say its a number and not a string

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numOfToursStart: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numOfToursStart: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      plan,
    },
  });
});
