const routerLogin = require('express').Router();
const validation = require('../validation/validation');
const { login } = require('../controllers/users');

routerLogin.post('/', validation.loginValidation, login);
module.exports = routerLogin;
