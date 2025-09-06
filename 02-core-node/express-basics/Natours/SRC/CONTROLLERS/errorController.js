const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const AppError = require('./../UTILS/AppError')


const handleCastErrorDB = err => {
const message = `invalid ${err.path}: ${err.value}`
return new AppError(message, 404)
}
handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(.*?)\1/g)
    const message = `duplicate fields value:${value} please use another value`
    return new AppError(message, 404)

}
handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message)
    const message = `invalid input data: ${errors.join('. ')}`
        return new AppError(message, 400)
}

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send response to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming error or other unknown error: dont leak details to the clients and also send it to the console to figure it out
  } else {
    // 1) send to console
    console.error('ERROR', err);
    // send generic message
    res.status(500).json({
      status: 'Error',
      message: 'Something went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);

  } else if(process.env.NODE_ENV === 'production') {
    let error = err 

    if(error.name === 'CastError') error = handleCastErrorDB(error)
    if(error.code === 11000) error = handleDuplicateFieldsDB(error)
    if(error.name === 'ValidationError') error = handleValidationErrorDB(error)

    sendErrorProd(error, res) ;
  
};
}
