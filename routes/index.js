const express = require('express');
const helmet = require('helmet');

const app = express();
app.use(helmet());
const auth = require('../middlewares/auth.js');
const defaultUrl = require('../middlewares/default');

const signUpRoutes = app.use('/', require('../routes/users'));
const loginRoutes = app.use('/', require('../routes/users'));
const usersRoutes = app.use('/', require('../routes/users'));
const articlesRoutes = app.use('/articles', auth, require('../routes/articles'));

const defaultRoutes = app.use('/', auth, defaultUrl);


module.exports = {
  usersRoutes, articlesRoutes, signUpRoutes, loginRoutes, defaultRoutes,
};
