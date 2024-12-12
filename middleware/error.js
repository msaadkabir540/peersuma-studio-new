const winston = require('winston');

module.exports = (err, req, res) => {
  winston.error(err.message, err);

  res.status(500).send({ msg: 'Something went wrong!' });
};

module.exports.error = (req, res) => {
  console.error({
    method: req.method,
    url: req.originalUrl,
    message: "Requested route doesn't exists!",
  });
  return res.status(500).send({ msg: "Invalid: Route doesn't exists!" });
};
