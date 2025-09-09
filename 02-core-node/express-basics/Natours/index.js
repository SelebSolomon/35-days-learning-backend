const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const AppError = require('./SRC/UTILS/AppError');
const globalErrorHandler = require('./SRC/CONTROLLERS/errorController');
const userRouter = require('./SRC/ROUTES/userRoutes');
const tourRouter = require('./SRC/ROUTES/tourRoutes');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean');
const hpp = require('hpp')

const app = express();
console.log('Query parser setting:', app.get('query parser'));

// GLOBAL MIDDLEWARES
console.log(process.env.NODE_ENV);
// 1) SET SECURITY HTTP HEADERS
app.use(helmet());
// 2) LOGGING THE DEVELOPMENT
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// 3) LIMITING REQUEST FROM SAME IP'S
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, Please try again in 1hr',
});

app.use('/api', limiter);

// BODYPARSER: READING DATA FROM BODY IN TO REQ.BODY
app.use(express.json({ limit: '10kb' })); // will not allow large document than 10kilobytes
app.use(bodyParser.urlencoded({ extended: true }));

// DATA SANITIZATION AGAINST NoSQL QUERY INJECTION
app.use(mongoSanitize())

// DATA SANITIZATION AGAINST XSS(cross-side scripting attacks)
app.use(xss())
// PREVENT PARAMETER POLLUTION
app.use(hpp({whitelist: [
    'duration', 'ratingsAverage,', 'ratingsQuantity', 'maxGroupSize', 'difficulty', 'price'
]}))
// FOR SERVING STATIC FILES
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  console.log('hello from the middleware lol');
  next();
});

// TESTING MIDDLEWARE LOL
app.use((req, res, next) => {
  req.requestedTime = new Date().toISOString();
  // console.log(req.headers)
  next();
});
// I USED THIS CODE WHEN I WAS STUCKED FOR DAYS TRYING TO PARSE QUERY I GUESS
app.set('query parser', 'extended');

// ROUTE 
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all(/.*/, (req, res, next) => {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: `This route ${req.originalUrl} is not defined`
  //   });

  next(new AppError(`This route ${req.originalUrl} is not defined`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
