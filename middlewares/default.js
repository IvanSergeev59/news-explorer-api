const answers = require('../answers/answers');
const ErrorsList = require('../errors/errorsList');

const defaultUrl = (req, res, next) => next(new ErrorsList.BadRequest(answers.urlNotFound));
module.exports = defaultUrl;
