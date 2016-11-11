// NPM Packages
var express = require('express');
var app = express();
var logger = require('morgan');
var mongoose = require('mongoose');
var dotenv = require('dotenv').load({silent: true});
var bodyParser = require('body-parser');

// Route modules
var authRoutes = require('./routes/auth.js');

// Misc variables
var PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, function(err, db){
  console.log(err || "Connected to MongoDB");
});

// Middleware
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(process.env.PWD + '/client'));

// Load index.html on root route
app.get('/', function(req, res){
  res.sendFile(process.env.PWD + '/client/index.html');
})

// Routes without auth
app.use('/api/auth', authRoutes);

// Token based auth middleware
app.use(function(req, res, next){
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if(token) {
    jwt.verify(token, 'secret', function(err, user) {
      if (err) {
        return res.status(403).send({
            success: false,
            message: 'Token Authentication failed.'
        });
      } else {
        req.user = user;
        console.log(req.user);
        next();
      }
    });
  } else {
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });
  }
})

// Routes with auth
// ..

// Start server
app.listen(PORT, function(err){
  console.log(err || "Listening on port: " + PORT);
});
