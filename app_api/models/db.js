var mongoose = require('mongoose');

var getDbUri = function () {
  console.log('argv ' + process.argv);
  switch (process.argv[3]) {
    case 'docker':
      return 'mongodb://172.17.0.2/Loc8r'; // running in docker network
    default:
      return 'mongodb://localhost/Loc8r';  // running natively
  }
}

//var dbURI = 'mongodb://localhost/Loc8r';
var dbURI = getDbUri();
mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});

/**
* Helper function for shutting down a connection
*/
var gracefulShutdown = function (msg, callback) {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
};

// Signal listener for nodemon restarts
process.once('SIGUSR2', function () {
  gracefulShutdown('nodemon restart', function () {
    process.kill(process.pid, 'SIGUSR2');
  });
});

// Signal listener for application shutdown
process.once('SIGINT', function () {
  gracefulShutdown('app termination', function () {
    process.exit(0);
  });
});

// Signal listener for Heroku application shutdown
process.once('SIGTERM', function () {
  gracefulShutdown('Heroku app shutdown', function () {
    process.exit(0);
  });
});


/**
* Data model
*/
require('./locations');
require('./users');