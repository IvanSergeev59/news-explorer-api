require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const { NODE_ENV, JWT_SECRET } = process.env;
const key = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';

const User = require('../models/user');
const Unauthorized = require('../errors/Unauthorized.js');
const NotFoundError = require('../errors/NotFoundError.js');
const BadRequest = require('../errors/Bad-request.js');
const InternalServerError = require('../errors/InternalServerError.js');

const extractBearerToken = (header) => header.replace('Bearer ', '');
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => {
      if (!user) {
        throw new InternalServerError('Произошла ошибка');
      }
      res.send({ data: user });
    })
    .catch(next);
};
module.exports.getUsersId = (req, res, next) => {
  const { authorization } = req.headers;
  const token = extractBearerToken(authorization);

  const payload = jwt.verify(token, key)._id;


  User.findById(payload)
    .then((user) => {
      if (!user) {
        throw new InternalServerError('Пользователя с таким id не существует!');
      } else {
        res.send({ email: user.email, name: user.name });
      }
    })
    .catch((err) => {
      if (err.message.indexOf('Cast to ObjectId failed') === 0) {
        throw new NotFoundError('Неправильный id');
      }
    })
    .catch(next);
};

module.exports.signUp = async (req, res, next) => {
  const {
    password, email,
  } = req.body;
  const isExist = await User.findOne({ email });
  if (isExist) {
    return next(new BadRequest('Такой пользователь уже существует'));
  }
  if (password) {
    bcrypt.hash(req.body.password, 10)
      .then((hash) => User.create({
        email: req.body.email,
        name: req.body.name,
        password: hash,
      }))
      .then((user) => {
        res.status(201).send({
          _id: user._id,
          email: user.email,
        });
      })
      .catch(() => next(new BadRequest('произошла ошиба')))
      .catch(next);
  }
  return User;
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, key, { expiresIn: '7d' }),
      });
    })
    .catch(() => {
      throw new Unauthorized('Неправильные почта или пароль m');
    })
    .catch(next);
};
