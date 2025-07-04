const express = require("express");
const router = express.Router();
var customers = require("../controllers/customer.controller");
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});

const querySchemaCreateOrGetAllCustomers = Joi.object().keys({
  customerName: Joi.string().required(),
  phone: Joi.string().required(),
  role: Joi.string(),
  kitchenId: Joi.array(),
});

const querySchemaUpdateOrDeleteCustomer = Joi.object({
  customerId: Joi.string().required(),
});

//create customer

router.get(
  "/vendor-customers",
  customers.getVendorCustomers
);

router.post(
  "/vendor-customer",
  customers.createVendorCustomer
);
router.put(
  "/vendor-customer/:customerId",
 customers.updateCustomer
);


module.exports = router;
