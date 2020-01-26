const routerSignUp = require('express').Router();
const validation = require('../validation/validation');
const { signUp } = require('../controllers/users');

routerSignUp.post('/', validation.signUpValidation, signUp);
module.exports = routerSignUp;
