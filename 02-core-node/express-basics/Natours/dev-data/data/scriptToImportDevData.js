const fs = require('fs')
const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/../../config.env` });
const mongoose = require('mongoose');
const Tour = require('../../SRC/MODELS/tourModel');
const  path = require("path")


// console.log(process.env)

mongoose
  .connect(process.env.MONGOURL)
  .then(() =>
    console.log(`mongodb is connected successfully `)
  ).catch((err) => console.log(err) );
// const tours = fs.readFileSync(`${__dirname}/../tours-simple.json`, 'utf-8');
const tours =JSON.parse(fs.readFileSync(
  path.join(__dirname, './tours-simple.json'),
  'utf-8'
));




//   IMPORTING DATA FROM THE JSON FILE 
const importData = async () => {

    try {
        await Tour.create(tours)
        console.log('Imported data')
      } catch (error) {
        console.log(error)   
      }
      process.exit()
}

const deleteData =async () => {
try {
    await Tour.deleteMany()
        console.log('delete successfully deleted')
      } catch (error) {
        console.log(error)
      }
      process.exit()
}
  // '/home/solomon/Documents/backend/35-DAYS-LEARNING-BACKEND/node-backend-bootcamp/02-core-node/express-basics/Natours/dev-data/data/scriptToImportDevData.js'
console.log(process.argv)
if(process.argv[2] === '--import'){
 importData()
} else if(process.argv[2] === '--delete'){
  deleteData()
}
console.log(process.argv)