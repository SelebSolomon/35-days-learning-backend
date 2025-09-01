const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./index.js');

// console.log(process.env)

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
