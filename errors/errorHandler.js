// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500).send({ message: err.message });
};
module.exports = errorHandler;
