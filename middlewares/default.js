const answers = require('../answers/answers');

const defaultUrl = (req, res) => {
  res.status(404).send({ message: answers.urlNotFound });
};
module.exports = defaultUrl;
