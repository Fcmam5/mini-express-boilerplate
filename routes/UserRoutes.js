var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController.js');
var helper = require('./helperFunctions');

/*
* Get USER profile
*/
router.get('/profile', helper.isLoggedIn,UserController.showProfile);

module.exports = router;
