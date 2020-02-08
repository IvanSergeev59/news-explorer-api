const routerUser = require('express').Router();

const {
  getUsers, getUsersId,
} = require('../controllers/users');


routerUser.get('/', getUsers);
routerUser.get('/me', getUsersId);
module.exports = routerUser;
