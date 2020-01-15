const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;
const key = NODE_ENV === 'development' ? 'super-puper-secret' : JWT_SECRET;

const User = require('../models/user');
const Unauthorized = require('../errors/Unauthorized.js');
const NotFoundError = require('../errors/Not-found-err.js');
const BadRequest = require('../errors/Bad-request.js');
const InternalServerError = require('../errors/Internal-server-error.js');

module.exports.getUsers = (req,res,next) => {
	User.find({}) 
		.then((user) => {
			if(!user) {
				throw new InternalServerError('Произошла ошибка');
			}
			res.send({ data : user});
		})
		.catch(next);
};
module.exports.getUsersId = (req, res, next) => {
	User.findByIde(req.params.userId)
		.then((user) => {
		if(!user) {
			throw new InternalServerError('Пользователя с таким id не существует!');
		}	else {
			res.send({data:user});
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
      throw new Unauthorized('Неправильные почта или пароль mod');
    })
    .catch(next);
};