const BadRequest = require('../errors/Bad-request.js');
const Forbidden = require('../errors/Forbidden.js');
const InternalServerError = require('../errors/InternalServerError.js');
const NotFoundError = require('../errors/NotFoundError.js');
const Unauthorized = require('../errors/Unauthorized.js');


module.exports = {
  BadRequest, Forbidden, InternalServerError, NotFoundError, Unauthorized,
};
