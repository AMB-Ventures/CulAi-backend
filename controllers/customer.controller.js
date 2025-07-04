var customer = require("../doa/customer.doa");

const getVendorCustomers = async (req, res, next) => {
  try {
    let result = await customer.get({ vendor: req.user.vendor._id });
    let plainObjects = result.map((doc) => doc.toObject());
    let aggResult = plainObjects.map((obj) => ({ ...obj, totalOrders: 69 }));
    res.status(200).json(aggResult);
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

const createVendorCustomer = async (req, res, next) => {
  try {
    let data = await customer.getOne({
      phone: req.body.phone,
      vendor: req.user.vendor._id,
    });
    
    if (data) {
      res.json({ code: 501, message: "Customer already exists" });
    } else {
      
      let result = await customer.create({
        ...req.body,
        vendor: req.user.vendor._id,
      });
      
      if (result) {
        res.json({
          code: 200,
          message: "Customer created successfully",
          customer: result,
        });
      }
    }
  } catch (e) {
    res.json({ code: 500, message: e.message });
  }
};

const updateCustomer = async (req, res, next) => {
  try {
    const updatePayload = {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      notes: req.body.notes       
    };

    await customer.findByIdAndUpdate(req.params.customerId, updatePayload);
    const updateCustomer = await customer.findById(req.params.customerId);

    res.status(200).json({
      message: "Customer updated successfully",
      customer: updateCustomer,
    });

    // req.app.io.emit(`refetch_brands_${req.user.vendor._id}`);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = {
  getVendorCustomers,
  createVendorCustomer,
  updateCustomer
};
