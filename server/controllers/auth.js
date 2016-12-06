var User = require('../models/User.js');
var jwt = require('jsonwebtoken');

var controller = {
  register: function(req, res){
    User.findOne({username: req.body.username}, function(err, user){
      if(err) {
        res.json({success: false, message: err});
      } else if (user) {
        res.json({success: false, message: 'Username already taken. Please choose a new one.'});
      } else {
        var newUser = new User();
        newUser.username = req.body.username;
        newUser.password = newUser.generateHash(req.body.password);

        newUser.save(function(err, createdUser){
          if(err) {
            res.json({success: false, message: err});
          } else{
            res.json({success: true, data: createdUser});
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
