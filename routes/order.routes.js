const express = require("express");
const router = express.Router();

const order = require("../controllers/order.controller");
const auth = require("../middlewares/auth");

router.get("/chef-stats", order.getVendorBranchStationStats, auth.verifyToken);
router.get("/chef-qa-stats", order.getVendorBranchStats, auth.verifyToken);

router.get(
  "/vendor-orders/:branchId?",
  order.getVendorOrders,
  auth.verifyToken
);

router.get(
  "/branch-orders/:status?",
  order.getVendorBranchOrders,
  auth.verifyToken
);

router.post("/branch-order", order.createBranchOrder, auth.verifyToken);

router.get(
  "/branch-orders/:status?",
  order.getVendorBranchOrders,
  auth.verifyToken
);

router.get(
  "/branch-orders/:status?",
  order.getVendorBranchOrders,
  auth.verifyToken
);

router.get(
  "/chef-orders",
  order.getVendorBranchStationChefPortalsDayOrders,
  auth.verifyToken
);

router.patch(
  "/complete-chef-order/:id",
  order.completeVendorBranchStationChefOrder,
  auth.verifyToken
);

router.get(
  "/chef-qa-orders",
  order.getVendorBranchQAChefPortalsDayOrders,
  auth.verifyToken
);

router.patch(
  "/accept-order/:id",
  order.acceptVendorBranchStationOrder,
  auth.verifyToken
);

router.patch(
  "/decline-order/:id",
  order.declineVendorBranchStationOrder,
  auth.verifyToken
);

router.patch(
  "/cancel-order/:id",
  order.cancelVendorBranchOrder,
  auth.verifyToken
);

router.patch(
  "/approve-order/:id",
  order.approveVendorBranchOrder,
  auth.verifyToken
);

router.patch(
  "/reject-order-items/:id",
  order.rejectVendorBranchOrderItems,
  auth.verifyToken
);

router.patch("/update-chef-status", order.updateChefStatus, auth.verifyToken);

module.exports = router;
