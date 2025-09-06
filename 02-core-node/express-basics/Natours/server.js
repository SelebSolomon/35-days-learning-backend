const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION, SERVER SHOOTING DOWN');
  server.close(() => {
    process.exit(1);
  });
});


dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const app = require('./index.js');
const port = process.env.PORT;

// console.log(process.env)

mongoose
  .connect(process.env.MONGOURL)
  .then((conn) => console.log(`mongodb is connected successfully `))
  .catch((err) => console.log(err));

const server = app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION, SERVER SHOOTING DOWN');
  server.close(() => {
    process.exit(1);
  });
});


