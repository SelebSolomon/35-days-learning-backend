const fs = require('fs');

// TOURS CONTROLLERS
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../../dev-data/data/tours-simple.json`)
);

// FIRST MIDDLE MIDDLEWARES FOR THE TOURS
exports.checkId = (req, res, next, val) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      success: 'fail',
      message: 'no tour found',
    });
  }
  next();
};
// SECOND MIDDLEWARE THAT WAS A CHALLANGE LOL

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

exports.getAllTours = (req, res) => {
  console.log(req.requestedTime);
  res.status(200).json({
    success: true,
    requestAt: req.requestedTime,
    result: tours.length,
    data: {
      tours,
    },
  });
};
exports.getTour = (req, res) => {
  const id = req.params.id * 1;

  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      success: 'fail',
      message: 'no tour found',
    });
  }
  res.status(200).json({
    success: true,

    data: {
      tour,
    },
  });
};
exports.updateTour = (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      tour: 'Updated Tour',
    },
  });
};
exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTours = Object.assign({ id: newId }, req.body);

  tours.push(newTours);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        success: true,
        data: {
          tours: newTours,
        },
      });
    }
  );
  // res.send('done')
};
exports.deleteTour = (req, res) => {
  res.status(200).json({
    success: true,

    data: {
      tour: null,
    },
  });
};
