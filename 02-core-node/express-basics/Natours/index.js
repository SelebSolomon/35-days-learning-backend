const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const AppError = require('./SRC/UTILS/AppError')
const globalErrorHandler  = require('./SRC/CONTROLLERS/errorController')
const userRouter = require('./SRC/ROUTES/userRoutes')
const tourRouter = require('./SRC/ROUTES/tourRoutes')






const app = express()
console.log("Query parser setting:", app.get("query parser"));

// MIDDLEWARES 
console.log(process.env.NODE_ENV)

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use(express.json())
app.use(express.static(`${__dirname}/public`))
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log('hello from the middleware lol')
    next()
})

app.use((req, res, next) => {
    req.requestedTime = new Date().toISOString();

    next()
})
app.set('query parser', 'extended');






app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

app.all(/.*/, (req, res, next) => {
//   res.status(404).json({
//     status: 'fail',
//     message: `This route ${req.originalUrl} is not defined`
//   });

next( new AppError(`This route ${req.originalUrl} is not defined`, 404))
});

app.use(globalErrorHandler)




module.exports = app