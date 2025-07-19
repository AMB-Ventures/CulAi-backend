var express = require('express');
require('dotenv').config()
const path = require('path');
const environment = process.env.NODE_ENV || 'development';
const log = require("./logger");
var bodyParser = require('body-parser');
var db = require('./config/database');
var router = express.Router();

var orderRoute = require('./api/order.route');
var app = express();
//configure bodyparser
var bodyParserJSON = bodyParser.json();
var bodyParserURLEncoded = bodyParser.urlencoded({ extended: true });
app.set('views', './views');
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

db();
app.use(bodyParserJSON);
app.use(bodyParserURLEncoded);
// Error handling
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PATCH,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization");
    next();
});

// use express router 
app.use('/orderengine', router);
orderRoute(router);

// intialise server
// app.listen(process.env.PORT, (req, res) => {
//     log.info(`Server is running on ${process.env.PORT} port.`);
// })
module.exports = app;