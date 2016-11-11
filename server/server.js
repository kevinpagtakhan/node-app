// NPM Packages
var express = require('express');
var app = express();

// Route modules
var authRoutes = require('./route/auth.js');

// Misc variables
var PORT = process.env.PORT || 3000;

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

app.listen(PORT, function(err){
  console.log(err || "Listening on port: " + PORT);
})