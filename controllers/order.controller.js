var mongoose = require("mongoose");
var order = require("../doa/order.doa");
var cloudKitchen = require("../doa/vendor.doa");
var orderdetails = require("../doa/orderDetails.doa");
var order = require("../doa/order.doa");
const moment = require("moment");
// const { v4: uuidv4 } = require("uuid");

const vendorModel = require("../doa/vendor.doa");
const branchModel = require("../doa/branch.doa");
const userModel = require("../doa/user.doa");
const taxGroupModel = require("../doa/taxGroup.doa");

const stockCount = require("../doa/stockCount.doa");

const getStatusList = (status) => {
  const inProgressStatusesList = ["created", "chef_accepted", "chef_completed"];

  switch (status) {
    case "inprogress":
      return inProgressStatusesList;
    case "completed":
      return ["completed"];
    default:
      return inProgressStatusesList;
  }
};

// Vendor Admin : Get all orders of vendor
const getVendorOrders = async (req, res, next) => {
  let result = await order
    .find({
      "vendor._id": { $eq: mongoose.Types.ObjectId(req.user.vendor._id) },
      createdAt: {
        $gte: moment(Number(req.query.startDate)).startOf("day").toDate(),
        $lt: moment(Number(req.query.endDate)).endOf("day").toDate(),
      },
    })
    .sort({ createdAt: -1 });
  res.status(200).json(result);
};

// Vendor Admin : Get all orders of branch
const getVendorBranchOrders = async (req, res, next) => {
  if (!req.user.branch || !req.user.branch._id) {
    return res.status(403).json({ message: "Branch not found" });
  }

  let result = await order
    .find({
      "branch._id": { $eq: mongoose.Types.ObjectId(req.user.branch._id) },
      ...(req.params.status
        ? { status: { $in: getStatusList(req.params.status) } }
        : {}),
    })
    .sort({ createdAt: -1 });
  res.status(200).json(result);
};

// Cashier : Create new order
const createBranchOrder = async (req, res, next) => {
  try {
    const orderData = req.body;

    // Fetch referenced fields in parallel
    const [
      vendor,
      branch,
      cashier,
      // customer,
      taxGroup,
      // splitByOrderItems,
      // orderProducts,
    ] = await Promise.all([
      vendorModel.findById(req.user.vendor._id).exec(),
      branchModel.findById(req.user.branch._id).populate("vendor").exec(),
      userModel.findById(req.user._id).populate("vendor branch role").exec(),
      // customerModel.findById(orderData.customer).populate("vendor").exec(),
      taxGroupModel.findById(orderData.taxGroup).populate("taxGroup").exec(),
    ]);

    // Create the populated order object
    const populatedOrderData = {
      ...orderData,
      application: orderData.selectedDeliveryApp,
      vendor,
      branch,
      cashier,
      taxGroup,
    };

    // Create the order using the populated data
    const populatedOrder = await order.create(populatedOrderData);

    res.status(201).json({
      message: "Order placed successfully",
      order: populatedOrder,
    });

    req.app.io.emit(`reload_${req.user.vendor._id}`);

    const branchStockCount = await stockCount.findOne({
      vendor: req.user.vendor._id,
      branch: req.user.branch._id,
    });

    let stationsToRefresh = new Set();

    populatedOrder.orderItems.forEach((orderItem) => {
      stationsToRefresh.add(orderItem.product.category.station._id);

      const itemStockCount = branchStockCount.items?.find(
        (itemStockCount) =>
          orderItem.product._id.toString() ===
          itemStockCount.item._id.toString()
      );
      if (itemStockCount) {
        itemStockCount.stockQty -= orderItem.qty;
      } else {
        branchStockCount.items.push({
          item: orderItem._id,
          stockQty: -1 * orderItem.qty,
        });
      }
    });

    Array.from(stationsToRefresh).forEach((stationId) => {
      req.app.io.emit(`refetch_station_orders_${stationId}`);
    });

    await branchStockCount.save();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Chef : Get all orders of the day
const getVendorBranchStationChefPortalsDayOrders = async (req, res, next) => {
  try {
    if (!req.user.branch || !req.user.branch._id) {
      return res.status(404).json({ message: "Branch not found" });
    }
    if (!req.user.station || !req.user.station._id) {
      return res.status(404).json({ message: "Station not found" });
    }

    const startDate = moment(Number(req.query.date));
    const endDate = moment(Number(req.query.date)).add(1, "days");

    if (!startDate.isValid() || !endDate.isValid()) {
      return res.status(500).json({ message: "Invalid date format" });
    }

    const result = await order
      .find({
        "vendor._id": mongoose.Types.ObjectId(req.user.vendor._id),
        "branch._id": mongoose.Types.ObjectId(req.user.branch._id),
        "orderItems.product.category.station._id": req.user.station._id,
        createdAt: {
          $gte: startDate.toDate(),
          $lt: endDate.toDate(),
        },
      })
      .sort({ createdAt: 1 });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Chef : Change Order Status to Chef_Completed
const completeVendorBranchStationChefOrder = async (req, res, next) => {
  try {
    if (!req.user.branch || !req.user.branch._id) {
      return res.status(404).json({ message: "Branch not found" });
    }
    if (!req.user.station || !req.user.station._id) {
      return res.status(404).json({ message: "Station not found" });
    }

    const liveOrder = await order.findOne({ _id: req.params.id });
    if (!liveOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    let stationsToRefresh = new Set();

    liveOrder.orderItems
      .filter(
        (item) =>
          item.product?.category?.station?._id === req.user?.station?._id
      )
      .forEach((item) => {
        stationsToRefresh.add(item.product.category.station._id);

        item.status = "chef_completed";
        item.chefCompletedAt = moment.utc().toDate();
      });

    if (
      liveOrder.orderItems.findIndex(
        (item) => item.status !== "chef_completed"
      ) === -1
    ) {
      liveOrder.status = "chef_completed";
    }

    Array.from(stationsToRefresh).forEach((stationId) => {
      req.app.io.emit(`refetch_station_orders_${stationId}`);
    });

    await liveOrder.save();

    req.app.io.emit(`refetch_chefqa_orders_${liveOrder.branch._id.toString()}`);

    res.status(200).json({ message: "Order Status updated successfully" });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Chef QA : Get all orders of the day
const getVendorBranchQAChefPortalsDayOrders = async (req, res, next) => {
  if (!req.user.branch || !req.user.branch._id) {
    return res.status(404).json({ message: "Branch not found" });
  }

  const today = moment().startOf("day");
  const tomorrow = moment(today).add(1, "days");

  let result = await order
    .find({
      "vendor._id": { $eq: mongoose.Types.ObjectId(req.user.vendor._id) },
      "branch._id": { $eq: mongoose.Types.ObjectId(req.user.branch._id) },
      createdAt: { $gte: today.toDate(), $lt: tomorrow.toDate() },
      status: { $in: ["chef_completed", "completed"] },
    })
    .sort({ createdAt: 1 });

  res.status(200).json(result);
};

// Chef : Chef Page Stats
const getVendorBranchStationStats = async (req, res, next) => {
  if (!req.user.branch || !req.user.branch._id) {
    return res.status(404).json({ message: "Branch not found" });
  }
  if (!req.user.station || !req.user.station._id) {
    return res.status(404).json({ message: "Station not found" });
  }

  const startDate = moment(Number(req.query.date));
  const endDate = moment(Number(req.query.date)).add(1, "days");

  if (!startDate.isValid() || !endDate.isValid()) {
    return res.status(500).json({ message: "Invalid date format" });
  }

  const totalOrders = await order.countDocuments({
    "vendor._id": { $eq: mongoose.Types.ObjectId(req.user.vendor._id) },
    "branch._id": { $eq: mongoose.Types.ObjectId(req.user.branch._id) },
    "orderItems.product.category.station._id": req.user.station._id,
    createdAt: {
      $gte: startDate.toDate(),
      $lt: endDate.toDate(),
    },
  });

  const completedOrders = await order.countDocuments({
    "vendor._id": { $eq: mongoose.Types.ObjectId(req.user.vendor._id) },
    "branch._id": { $eq: mongoose.Types.ObjectId(req.user.branch._id) },
    "orderItems.product.category.station._id": req.user.station._id,
    status: { $in: ["chef_completed", "completed"] },
    createdAt: {
      $gte: startDate.toDate(),
      $lt: endDate.toDate(),
    },
  });

  const cancelledOrders = await order.countDocuments({
    "vendor._id": { $eq: mongoose.Types.ObjectId(req.user.vendor._id) },
    "branch._id": { $eq: mongoose.Types.ObjectId(req.user.branch._id) },
    "orderItems.product.category.station._id": req.user.station._id,
    status: { $eq: "chef_cancelled" },
    createdAt: {
      $gte: startDate.toDate(),
      $lt: endDate.toDate(),
    },
  });

  return res.json({ totalOrders, completedOrders, cancelledOrders });
};

// Chef QA : Chef QA Page Stats
const getVendorBranchStats = async (req, res, next) => {
  if (!req.user.branch || !req.user.branch._id) {
    return res.status(404).json({ message: "Branch not found" });
  }

  const startDate = moment(Number(req.query.date));
  const endDate = moment(Number(req.query.date)).add(1, "days");

  if (!startDate.isValid() || !endDate.isValid()) {
    return res.status(500).json({ message: "Invalid date format" });
  }

  const chefCompletedOrders = await order.countDocuments({
    "vendor._id": { $eq: mongoose.Types.ObjectId(req.user.vendor._id) },
    "branch._id": { $eq: mongoose.Types.ObjectId(req.user.branch._id) },
    status: { $in: ["chef_completed", "completed"] },
    createdAt: {
      $gte: startDate.toDate(),
      $lt: endDate.toDate(),
    },
  });

  const completedOrders = await order.countDocuments({
    "vendor._id": { $eq: mongoose.Types.ObjectId(req.user.vendor._id) },
    "branch._id": { $eq: mongoose.Types.ObjectId(req.user.branch._id) },
    completedBy: { $eq: mongoose.Types.ObjectId(req.user._id) },
    status: { $eq: "completed" },
    createdAt: {
      $gte: startDate.toDate(),
      $lt: endDate.toDate(),
    },
  });

  const rejectedItems = await order.aggregate([
    {
      $match: {
        "vendor._id": mongoose.Types.ObjectId(req.user.vendor._id),
        "branch._id": mongoose.Types.ObjectId(req.user.branch._id),
        createdAt: {
          $gte: startDate.toDate(),
          $lt: endDate.toDate(),
        },
      },
    },
    {
      $unwind: {
        path: "$orderItems",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        totalRejections: {
          $cond: {
            if: {
              $and: [
                { $isArray: "$orderItems.rejections" },
                { $gt: [{ $size: "$orderItems.rejections" }, 0] },
                {
                  $in: [
                    mongoose.Types.ObjectId(req.user._id),
                    "$orderItems.rejections.rejectedBy",
                  ],
                },
              ],
            },
            then: 1,
            else: 0,
          },
        },
      },
    },
    {
      $group: {
        _id: null,
        totalRejections: { $sum: "$totalRejections" },
      },
    },
  ]);

  return res.json({
    chefCompletedOrders,
    completedOrders,
    rejectedItems: rejectedItems[0]?.totalRejections ?? 0,
  });
};

// Chef : Change Order Status to Accepted
const acceptVendorBranchStationOrder = async (req, res, next) => {
  try {
    if (!req.user.branch || !req.user.branch._id) {
      return res.status(404).json({ message: "Branch not found" });
    }
    if (!req.user.station || !req.user.station._id) {
      return res.status(404).json({ message: "Station not found" });
    }

    const liveOrder = await order.findById(req.params.id);

    let stationsToRefresh = new Set();

    liveOrder.orderItems.forEach((item) => {
      stationsToRefresh.add(item.product.category.station._id);
      if (req.user.station?._id === item.product?.category?.station?._id) {
        item.status = "chef_accepted";
        item.chef = mongoose.Types.ObjectId(req.user._id);
        item.chefAcceptedAt = moment.utc().toDate();
        item.chefTotalPreparationTime = req.body.totalPreparationTime;
      }
    });

    Array.from(stationsToRefresh).forEach((stationId) => {
      req.app.io.emit(`refetch_station_orders_${stationId}`);
    });

    await liveOrder.save();

    res.status(200).json({ message: "Order Status updated successfully" });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// CASHIER : Change Order Status to cancelled
const cancelVendorBranchOrder = async (req, res, next) => {
  try {
    if (!req.user.branch || !req.user.branch._id) {
      return res.status(404).json({ message: "Branch not found" });
    }

    const liveOrder = await order.findOne({ _id: req.params.id });
    if (!liveOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (liveOrder.status === "cancelled") {
      return res.status(405).json({ message: "Ordered already cancelled" });
    }

    liveOrder.status = "cancelled";
    liveOrder.orderItems.forEach((item) => {
      item.status = "cancelled";
      item.cancelledBy = moment.utc().toDate();
    });
    liveOrder.cancelledAt = moment.utc().toDate();
    liveOrder.cancelledBy = req.user._id.toString();

    await liveOrder.save();

    res.status(200).json({ message: "Order Status updated successfully" });

    const branchStockCount = await stockCount.findOne({
      vendor: req.user.vendor._id,
      branch: req.user.branch._id,
    });

    let stationsToRefresh = new Set();

    liveOrder.orderItems.forEach((orderItem) => {
      stationsToRefresh.add(orderItem.product.category.station._id);

      const itemStockCount = branchStockCount.items?.find(
        (itemStockCount) =>
          orderItem.product._id.toString() ===
          itemStockCount.item._id.toString()
      );
      if (itemStockCount) {
        itemStockCount.stockQty += orderItem.qty;
      }
    });

    Array.from(stationsToRefresh).forEach((stationId) => {
      req.app.io.emit(`refetch_station_orders_${stationId}`);
    });

    await branchStockCount.save();
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// CHEF : Change Order Status to Declined
const declineVendorBranchStationOrder = async (req, res, next) => {
  try {
    if (!req.user.branch || !req.user.branch._id) {
      return res.status(404).json({ message: "Branch not found" });
    }
    if (!req.user.station || !req.user.station._id) {
      return res.status(404).json({ message: "Station not found" });
    }

    const liveOrder = await order.findOne({ _id: req.params.id });
    if (!liveOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (liveOrder.status === "declined") {
      return res.status(405).json({ message: "Ordered already declined" });
    }

    liveOrder.status = "declined";
    liveOrder.orderItems.forEach((item) => {
      item.status = "declined";
      item.declinedAt = moment.utc().toDate();
    });
    liveOrder.declinedAt = moment.utc().toDate();
    liveOrder.declinedBy = req.user._id.toString();

    await liveOrder.save();

    res.status(200).json({ message: "Order Status updated successfully" });

    const branchStockCount = await stockCount.findOne({
      vendor: req.user.vendor._id,
      branch: req.user.branch._id,
    });

    let stationsToRefresh = new Set();

    liveOrder.orderItems.forEach((orderItem) => {
      stationsToRefresh.add(orderItem.product.category.station._id);

      const itemStockCount = branchStockCount.items?.find(
        (itemStockCount) =>
          orderItem.product._id.toString() ===
          itemStockCount.item._id.toString()
      );
      if (itemStockCount) {
        itemStockCount.stockQty += orderItem.qty;
      }
    });

    Array.from(stationsToRefresh).forEach((stationId) => {
      req.app.io.emit(`refetch_station_orders_${stationId}`);
    });

    await branchStockCount.save();
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// CHEF QA : Change Order Status to Approved
const approveVendorBranchOrder = async (req, res, next) => {
  try {
    if (!req.user.branch || !req.user.branch._id) {
      return res.status(404).json({ message: "Branch not found" });
    }

    const liveOrder = await order.findOne({ _id: req.params.id });
    if (!liveOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    liveOrder.status = "completed";
    liveOrder.completedBy = req.user._id;

    let stationsToRefresh = new Set();

    liveOrder.orderItems.forEach((item) => {
      stationsToRefresh.add(item.product.category.station._id);
      item.status = "completed";
      item.completedAt = moment.utc().toDate();
    });

    Array.from(stationsToRefresh).forEach((stationId) => {
      req.app.io.emit(`refetch_station_orders_${stationId}`);
    });

    await liveOrder.save();

    req.app.io.emit(`refetch_chefqa_orders_${liveOrder.branch._id.toString()}`);

    res.status(200).json({ message: "Order Status updated successfully" });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// QA : Change Order Status to Rejected
const rejectVendorBranchOrderItems = async (req, res, next) => {
  try {
    if (!req.user.branch || !req.user.branch._id) {
      return res.status(404).json({ message: "Branch not found" });
    }

    const liveOrder = await order.findOne({ _id: req.params.id });
    if (!liveOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    let stationsToRefresh = new Set();

    req.body.itemIndexes.forEach((itemIndex) => {
      stationsToRefresh.add(
        liveOrder.orderItems[itemIndex].product.category.station._id
      );

      liveOrder.orderItems[itemIndex].status = "chef_accepted";
      liveOrder.status = "chef_accepted";
      liveOrder.orderItems[itemIndex].rejections.push({
        reason: req.body.reason,
        rejectedAt: moment.utc().toDate(),
        rejectedBy: req.user._id,
      });
    });

    Array.from(stationsToRefresh).forEach((stationId) => {
      req.app.io.emit(`refetch_station_orders_${stationId}`);
    });

    await liveOrder.save();

    req.app.io.emit(`refetch_chefqa_orders_${liveOrder.branch._id.toString()}`);

    res
      .status(200)
      .json({ message: "Order items marked as rejected successfully" });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getVendorOrders,
  getVendorBranchOrders,
  getVendorBranchStationChefPortalsDayOrders,
  getVendorBranchQAChefPortalsDayOrders,
  getVendorBranchStationStats,
  getVendorBranchStats,

  createBranchOrder,

  acceptVendorBranchStationOrder,
  completeVendorBranchStationChefOrder,
  declineVendorBranchStationOrder,
  cancelVendorBranchOrder,

  approveVendorBranchOrder,
  rejectVendorBranchOrderItems,
};
