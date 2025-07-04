var express = require('express');
require('dotenv').config()
const path = require('path');
const log = require("./logger");
var bodyParser = require('body-parser');
var properties = require('./config/properties');
var db = require('./config/database');
var router = express.Router();
var inquiryRoutes = require('./api/inquiry.route');
var skillRoutes = require('./api/skills.route');
var loginRoutes = require('./api/login.route');
var cloudkitchenRoutes = require('./api/cloud_kitchen.route');
var subadminRoutes = require('./api/subadmin.route');
var vendorRoutes = require('./api/vendor.route');
var categoryRoutes = require('./api/category.route');
var subCategoryRoutes = require('./api/sub_category.route');
var enquiryRoutes = require('./api/enquiry.route');
var quickStatRoutes = require('./api/quickStat.route');
var enquiryLoginRoutes = require('./api/enquiryLogin.route');
var featureRoutes = require('./api/feature.route');
var subscriptionRoutes = require('./api/subscription.route');
var newsletterRoutes = require('./api/newsletter.route');
var contactRoutes = require('./api/contact_us.route');
var app = express();
//configure bodyparser
// var bodyParserJSON = bodyParser.json();
// var bodyParserURLEncoded = bodyParser.urlencoded({ extended: true });
app.set('views', './views');
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

db();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 50000
}));
// app.use(bodyParserJSON);
// app.use(bodyParserURLEncoded);
// Error handling
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PATCH,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization");
  next();
});


app.use('/admin', router);
loginRoutes(router);
inquiryRoutes(router);
skillRoutes(router);
cloudkitchenRoutes(router);
subadminRoutes(router);
vendorRoutes(router);
categoryRoutes(router);
subCategoryRoutes(router);
enquiryRoutes(router);
quickStatRoutes(router);
enquiryLoginRoutes(router);
featureRoutes(router);
subscriptionRoutes(router);
newsletterRoutes(router);
contactRoutes(router);
// intialise server
// app.listen(process.env.PORT, (req, res) => {
//   log.info(`Server is running on ${process.env.PORT} port.`);
// })
module.exports = app;