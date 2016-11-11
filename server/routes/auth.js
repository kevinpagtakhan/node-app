var express = require('express');
var router = express.Router();
var authController = require('../controllers/auth.js');

router.route('/register')
  .post(authController.register);

router.route('/login')
  .post(authController.login);

module.exports = router;
