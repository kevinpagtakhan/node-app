var User = require('../models/User.js');
var jwt = require('jsonwebtoken');

var controller = {
  register: function(req, res){
    User.findOne({username: req.body.username}, function(err, user){
      if(err) {
        res.json({success: false, data: err, message: 'Error occured while finding user'});
      } else if (user) {
        res.json({success: false, data: null, message: 'Username already taken'})
      } else {
        var newUser = User();
        newUser.username = req.body.username;
        newUser.password = User.generateHash(req.body.password);

        newUser.save(function(err, createdUser){
          if(err) {
            req.json({success: false, data: err, message: 'Error occured while saving user'});
          } else {
            var userToken = {
              _id: createdUser._id,
              username: createdUser.username
            };
            var config = {
              expiresIn: 60*60 // 1 hour
            }

            var token = jwt.sign(userToken, 'secret', config);
            res.json({success: true, data: token, message: 'User created'});
          }
        })
      }
    })
  },

  login: function(req, res){
    User.findOne({username: req.body.username}, function(err, user){
      if(err) {
        res.json({success: false, data: err, message: 'Error occured while finding user'});
      } else if (!user) {
        res.json({success: false, data: null, message: 'Username not found'});
      } else {
        if(!user.validatePassword(req.body.password)){
          res.json({success: false, data: null, message: 'Incorrect password'});
        } else {
          var userToken = {
            _id: user._id,
            username: user.username
          };
          var config = {
            expiresIn: 60*60 // 1 hour
          }

          var token = jwt.sign(userToken, 'secret', config);
          res.json({success: true, data: token, message: 'User authenticated'});
        }
      }
    })
  }
}

module.exports = controller;
