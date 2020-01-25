const Article = require('../models/article');
const InternalServerError = require('../errors/InternalServerError.js');
const NotFoundError = require('../errors/NotFoundError.js');
const Unauthorized = require('../errors/Unauthorized.js');

module.exports.getArticles = (req, res, next) => {
  Article.find({})
    .then((article) => {
      if (!article) {
        throw new InternalServerError('Произошла ошибка');
      }
      res.send({ data: article });
    })
    .catch(next);
};
module.exports.createArticles = (req, res, next) => {
  const {
    keyword, title, text, source, link, image,
  } = req.body;
  const owner = req.user._id;
  Article.create({
    keyword, title, text, source, link, image, owner })
    .then((article) => {
      if (!article) {
        throw new InternalServerError('Произошла ошибка');
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
          .then((articleRemove) => res.send({ date: articleRemove }))
          .catch((err) => res.status(500).send({ message: err }));
      } else {
        return next(new Unauthorized('Нет прав'));
      }
      return Article;
    })
    .catch((err) => {
      if (err.message.indexOf('Cast to ObjectId failed') === 0) {
        return next(new NotFoundError('Неправильный id'));
      }
      return next(new InternalServerError('Произошла ошибка'));
    });
};
