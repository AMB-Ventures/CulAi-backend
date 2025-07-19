/*
The code below is for database connectivity.
*/
var mongoose = require('mongoose');
var log = require('../logger');

//require chalk module to give colors to console text
var chalk = require('chalk');

var connected = chalk.bold.cyan;
var error = chalk.bold.yellow;
var disconnected = chalk.bold.red;
var termination = chalk.bold.magenta;

//export this function and imported by server.js
module.exports = function () {

    mongoose.connect(process.env.DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    });

    mongoose.connection.on('connected', function () {
        log.info(connected("Mongoose default connection is open to ", process.env.DB));
    });

    mongoose.connection.on('error', function (err) {
        log.error(error("Mongoose default connection has occured " + err + " error"));
    });

    mongoose.connection.on('disconnected', function () {
        log.info(disconnected("Mongoose default connection is disconnected"));
    });

    process.on('SIGINT', function () {
        mongoose.connection.close(function () {
            log.info(termination("Mongoose default connection is disconnected due to application termination"));
            process.exit(0)
        });
    });
}