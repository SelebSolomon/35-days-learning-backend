const express = require('express')
const morgan = require('morgan')
const userRouter = require('./SRC/ROUTES/userRoutes')
const tourRouter = require('./SRC/ROUTES/tourRoutes')




const app = express()

// MIDDLEWARES 
console.log(process.env.NODE_ENV)

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use(express.json())
app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
    console.log('hello from the middleware lol')
    next()
})

app.use((req, res, next) => {
    req.requestedTime = new Date().toISOString();

    next()
})





app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)





module.exports = app