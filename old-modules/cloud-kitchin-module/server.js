var express = require('express');
require('dotenv').config()
const log = require("./logger");
var bodyParser = require('body-parser');
const path = require('path');
var db = require('./config/database');
//hero routes
var router = express.Router();

var loginRoutes = require('./api/login.route');
var menuRoutes = require('./api/menu.route');
var employeeRoutes = require('./api/employee.route');
var userRoutes = require('./api/user.route');
var kitchenconfigRoute = require('./api/kitchenconfig.route');
var orderRoute = require('./api/order.route');
var categoryRoutes = require('./api/category.route');
var subCategoryRoutes = require('./api/sub_category.route');
var cloudkitchenRoutes = require('./api/cloud_kitchen.route');
var vendorRoutes = require('./api/vendor.route');
var enquiryRoutes = require('./api/enquiry.route');
// var dashboardRoutes = require('./api/dashboard.route');
var quickStatRoutes = require('./api/quickStat.route');
var kpiRoutes = require('./api/kpi.route');
var roleRoutes = require('./api/role.route');
var shiftRoutes = require('./api/shift.route');
var subscriptionRoutes = require('./api/subscription.route');


var app = express();

//configure bodyparser
// var bodyParserJSON = bodyParser.json();
// var bodyParserURLEncoded = bodyParser.urlencoded({ extended: true });
//initialise express router

app.set('views', './views');
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

// call the database connectivity function
db();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 50000
}));
// configure app.use()
// app.use(bodyParserJSON);
// app.use(bodyParserURLEncoded);
// Error handling
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,DELETE,PUT,PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization");
  next();
});


// use express router 

app.use('/cloudkitchen', router);
loginRoutes(router);
menuRoutes(router);
employeeRoutes(router);
userRoutes(router);
kitchenconfigRoute(router);
orderRoute(router);
categoryRoutes(router);
cloudkitchenRoutes(router);
subCategoryRoutes(router);
vendorRoutes(router);
enquiryRoutes(router);
quickStatRoutes(router);
kpiRoutes(router);
roleRoutes(router);
shiftRoutes(router);
subscriptionRoutes(router);


// intialise server
// app.listen(process.env.PORT, (req, res) => {
//   log.info(`Server is running on ${process.env.PORT} port.`);
// })
module.exports = app;