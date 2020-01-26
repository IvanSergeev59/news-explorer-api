const routerUser = require('express').Router();
const auth = require('../middlewares/auth.js');
const {
  getUsers, getUsersId, signUp, login,
} = require('../controllers/users');
const validation = require('../validation/validation');

routerUser.post('/signup', validation.signUpValidation, signUp);
routerUser.post('/signin', validation.loginValidation, login);

routerUser.get('/users', auth, getUsers);
routerUser.get('/users/me', auth, getUsersId);
module.exports = routerUser;
