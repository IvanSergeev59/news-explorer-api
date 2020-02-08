const { celebrate, Joi } = require('celebrate');

const signUpValidation = celebrate({
  // валидируем параметры
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().min(2).required(),
    password: Joi.string().min(2).required(),
  }),
  headers: Joi.object().keys({
    'content-type': 'application/json',
  }).unknown(true),
});
const loginValidation = celebrate({
  // валидируем параметры
  body: Joi.object().keys({
    email: Joi.string().email().min(2).required(),
    password: Joi.string().min(2).required(),
  }),
  headers: Joi.object().keys({
    'content-type': 'application/json',
  }).unknown(true),
});
module.exports = { signUpValidation, loginValidation };
