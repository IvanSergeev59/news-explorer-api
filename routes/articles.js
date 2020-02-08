const routerArticle = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getArticles, createArticles, deleteArticles } = require('../controllers/articles');

routerArticle.get('/', getArticles);
routerArticle.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().min(1),
    title: Joi.string().required().min(1),
    text: Joi.string().required().min(1),
    source: Joi.string().required().min(1),
    link: Joi.string().required().min(1),
    image: Joi.string().required().min(1),
    date: Joi.string().required().min(1),
  }),
  headers: Joi.object().keys({
    'content-type': 'application/json',
  }).unknown(true),
}), createArticles);
routerArticle.delete('/:articleId', deleteArticles);
module.exports = routerArticle;
