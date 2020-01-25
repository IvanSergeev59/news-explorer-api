const express = require('express');

const app = express();
const auth = require('../middlewares/auth.js');
const { signUp, login } = require('../controllers/users');
const validation = require('../validation/validation');

const signUpRoutes = app.post('/signup', validation.signUpValidation, signUp);
const loginRoutes = app.post('/signin', validation.loginValidation, login);
const usersRoutes = app.use('/users', auth, require('../routes/users'));
const articlesRoutes = app.use('/articles', auth, require('../routes/articles'));

const defaultRoutes = app.use('/', auth, (req, res) => {
  res.send({ message: 'API' });
});
module.exports = {
  usersRoutes, articlesRoutes, signUpRoutes, loginRoutes, defaultRoutes,
};
