var branch = require("../doa/branch.doa");
const stockCount = require("../doa/stockCount.doa");

const getVendorBranches = async (req, res, next) => {
  try {
    let result = await branch.getVendorBranches({
      isDeleted: { $ne: true },
      ...(req.user?.vendor?._id ? { vendor: req.user.vendor._id } : {}),
      ...(req.params?.vendorId ? { vendor: req.params.vendorId } : {}),
      type: "outlet",
    });
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getVendorWarehouses = async (req, res, next) => {
  try {
    let result = await branch.getVendorWarehouses({
      isDeleted: { $ne: true },
      ...(req.user?.vendor?._id ? { vendor: req.user.vendor._id } : {}),
      ...(req.params?.vendorId ? { vendor: req.params.vendorId } : {}),
      type: "warehouse",
    });
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
const getAllVendorBranches = async (req, res, next) => {
  try {
    let result = await branch
      .find({
        ...(req.user?.vendor?._id ? { vendor: req.user.vendor._id } : {}),
        ...(req.params?.vendorId ? { vendor: req.params.vendorId } : {}),
      })
      .collation({ locale: "en", strength: 2 })
      .sort({ name: 1 });
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const createVendorBranch = async (req, res, next) => {
  try {
    const data = await branch.createVendorBranch({
      ...req.body,
      vendor: req.user.vendor._id,
      type: "outlet",
    });

    await new stockCount({
      branch: data._id,
      vendor: req.user.vendor._id,
      items: [],
    }).save();

    res
      .status(200)
      .json({ message: "Branch created successfully", branch: data });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const createVendorWarehouses = async (req, res, next) => {
  try {
    const data = await branch.createVendorBranch({
      ...req.body,
      vendor: req.user.vendor._id,
      type: "warehouse",
    });

    await new stockCount({
      branch: data._id,
      vendor: req.user.vendor._id,
      items: [],
    }).save();

    res
      .status(200)
      .json({ message: "Warehouse created successfully", warehouse: data });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const updateVendorBranch = async (req, res, next) => {
  try {
    const { name, reference, address } = req.body;

    const data = await branch.updateVendorBranch(
      { _id: req.params.branchId },
      { name, reference, address }
    );

    res
      .status(200)
      .json({ message: "Branch updated successfully", branch: data });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const updateVendorWarehouse = async (req, res, next) => {
  try {
    const { name, reference, address } = req.body;

    const data = await branch.updateVendorBranch(
      { _id: req.params.warehouseId },
      { name, reference }
    );

    res
      .status(200)
      .json({ message: "Warehouse updated successfully", warehouse: data });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const deleteVendorBranches = async (req, res, next) => {
  try {
    await branch.updateMany(
      { _id: { $in: req.body.branchIds } },
      { $set: { isDeleted: true } }
    );

    res.status(200).json({ message: "Branch(es) deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const deleteVendorWarehouses = async (req, res, next) => {
  try {
    await branch.updateMany(
      { _id: { $in: req.body.warehouseIds } },
      { $set: { isDeleted: true } }
    );

    res.status(200).json({ message: "Warehouse(s) deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = {
  getVendorBranches,
  getVendorWarehouses,
  getAllVendorBranches,
  createVendorBranch,
  createVendorWarehouses,
  updateVendorBranch,
  updateVendorWarehouse,
  deleteVendorBranches,
  deleteVendorWarehouses,
};
