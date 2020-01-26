require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const answers = require('../answers/answers');

const { NODE_ENV, JWT_SECRET } = process.env;
const key = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';

const User = require('../models/user');
const ErrorsList = require('../errors/errorsList');

const extractBearerToken = (header) => header.replace('Bearer ', '');
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => {
      if (!user) {
        throw new ErrorsList.InternalServerError(answers.errorHappened);
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
        throw new ErrorsList.InternalServerError(answers.userNotFound);
      } else {
        res.send({ email: user.email, name: user.name });
      }
    })
    .catch((err) => {
      if (err.message.indexOf('Cast to ObjectId failed') === 0) {
        throw new ErrorsList.NotFoundError(answers.wrongId);
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
    return next(new ErrorsList.BadRequest(answers.doubleUser));
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
      .catch(() => next(new ErrorsList.BadRequest(answers.errorHappened)))
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
      throw new ErrorsList.Unauthorized(answers.wrongEmailPas);
    })
    .catch(next);
};
