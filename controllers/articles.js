const Article = require('../models/article');
const ErrorsList = require('../errors/errorsList');
const answers = require('../answers/answers');

module.exports.getArticles = (req, res, next) => {
  Article.find({})
    .then((article) => {
      if (!article) {
        throw new ErrorsList.InternalServerError(answers.errorHappened);
      }
      res.send({ data: article });
    })
    .catch(next);
};
module.exports.createArticles = (req, res, next) => {
  const {
    keyword, title, text, source, link, image, date,
  } = req.body;
  const owner = req.user._id;
  Article.create({
    keyword, title, text, source, link, image, owner, date,
  })
    .then((article) => {
      if (!article) {
        throw new ErrorsList.InternalServerError(answers.errorHappened);
      }
      res.status(201).send({ data: article });
    })
    .catch(next);
};

module.exports.deleteArticles = (req, res, next) => {
  Article.findById(req.params.articleId)
    .then((article) => {
      if (req.user._id === article.owner.toString()) {
        Article.findByIdAndRemove(req.params.articleId)
          .then((articleRemove) => {
            if (!articleRemove) {
              throw new ErrorsList.InternalServerError(answers.errorHappened);
            }

            res.send({ date: articleRemove });
          })
          .catch(next);
      } else {
        return next(new ErrorsList.Unauthorized(answers.wrongRight));
      }
      return Article;
    })
    .catch((err) => {
      if (err.message.indexOf('Cast to ObjectId failed') === 0) {
        return next(new ErrorsList.BadRequest(answers.wrongId));
      }
      return next(new ErrorsList.InternalServerError(answers.wrongArticleId));
    });
};
