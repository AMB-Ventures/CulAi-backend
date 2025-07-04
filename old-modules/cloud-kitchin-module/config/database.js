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


    const options = {
        autoIndex: false, // Don't build indexes
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        family: 4,
        useNewUrlParser: true, // Use IPv4, skip trying IPv6
        useUnifiedTopology: true,
        useCreateIndex: true
    };
    mongoose.connect(process.env.DB, options);

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