var mongoose = require("mongoose");
var supplier = require("../doa/supplier.doa");
var inventory = require("../doa/inventory.doa");

const getVendorSuppliers = async (req, res, next) => {
  try {
    let result = await supplier.getVendorSuppliers({
      isDeleted: { $ne: true },
    });
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "No customers found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Banchot" });
  }
};

const createVendorSupplier = async (req, res, next) => {
  try {
    const data = await supplier.createVendorSupplier(req.body);
    res
      .status(200)
      .json({ message: "Customer created successfully", supplier: data });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const updateVendorSupplier = async (req, res, next) => {
  try {
    const updatePayload = {
      name: req.body.name,
      code: req.body.code,
      contactName: req.body.contactName,
      phone: req.body.phone,
      email: req.body.email,
    };

    await supplier.findByIdAndUpdate(req.params.supplierId, updatePayload);
    const updatedSupplier = await supplier.findById(req.params.supplierId);

    res.status(200).json({
      message: "Supplier updated successfully",
      supplier: updatedSupplier,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const deleteVendorSupplier = async (req, res, net) => {
  try {
    const supplierIds = req.body.selectedRowsIds.map((id) =>
      mongoose.Types.ObjectId(id)
    );

    await supplier.updateMany(
      { _id: { $in: supplierIds } },
      { $set: { isDeleted: true } }
    );

    await inventory.updateMany(
      {
        "suppliers.supplier": { $in: supplierIds },
      },
      {
        $pull: {
          suppliers: { supplier: { $in: supplierIds } },
        },
      }
    );

    res.status(200).json({ message: "Suppliers deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = {
  getVendorSuppliers,
  createVendorSupplier,
  updateVendorSupplier,
  deleteVendorSupplier,
};
