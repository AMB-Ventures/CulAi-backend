const express = require("express");
require("dotenv").config();
const cors = require("cors");
const initDb = require("./config/database");
const authMiddleware = require("./middlewares/auth");

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

const corsOptions = {
  origin: [
    "https://console.cul-ai.com",
    "https://cul-ai-frontend.fly.dev",
    "https://admin.cul-ai.com",
    "http://localhost:3000",
    "http://localhost:3001",
    "https://main.d3m30tipkq4qvg.amplifyapp.com",
    "http://localhost:8081",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));
initDb();

// ✅ Route Imports
const authRoutes = require("./routes/auth.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const notificationsRoutes = require("./routes/notifications.routes");
const menuRoutes = require("./routes/menu.routes");
const orderRoutes = require("./routes/order.routes");
const taxGroupRoutes = require("./routes/taxGroup.routes");
const roleRoutes = require("./routes/role.routes");
const userRoutes = require("./routes/user.routes");
const vendorRoutes = require("./routes/vendor.routes");
const categoryRoutes = require("./routes/category.routes");
const brandRoutes = require("./routes/brand.routes");
const branchRoutes = require("./routes/branch.routes");
const stationsRoutes = require("./routes/stations.routes");
const productRoutes = require("./routes/product.routes");
const stockRoutes = require("./routes/stock.routes");
const subCategoryRoutes = require("./routes/sub_category.routes");
const customerRoutes = require("./routes/customer.routes");
const supplierRoutes = require("./routes/supplier.routes");
const inventoryRoutes = require("./routes/inventory.routes");

const router = express.Router();

router.use("/auth", authRoutes);

// ✅ Protected Routes (Require Authentication)
router.use("/customers", authMiddleware.verifyToken, customerRoutes);
router.use("/dashboards", authMiddleware.verifyToken, dashboardRoutes);
router.use("/notifications", authMiddleware.verifyToken, notificationsRoutes);
router.use("/menu", authMiddleware.verifyToken, menuRoutes);
router.use("/orders", authMiddleware.verifyToken, orderRoutes);
router.use("/categories", authMiddleware.verifyToken, categoryRoutes);
router.use("/brands", authMiddleware.verifyToken, brandRoutes);
router.use("/branches", authMiddleware.verifyToken, branchRoutes);
router.use("/stations", authMiddleware.verifyToken, stationsRoutes);
router.use("/inventory", authMiddleware.verifyToken, inventoryRoutes);
router.use("/products", authMiddleware.verifyToken, productRoutes);
router.use("/stocks", authMiddleware.verifyToken, stockRoutes);
router.use("/subcategory", authMiddleware.verifyToken, subCategoryRoutes);
router.use("/suppliers", authMiddleware.verifyToken, supplierRoutes);
router.use("/tax-groups", authMiddleware.verifyToken, taxGroupRoutes);

// ✅ Inject Multiple Routes at Root
router.use("/", authMiddleware.verifyToken, [
  roleRoutes,
  userRoutes,
  vendorRoutes,
]);

// ✅ Apply Router Middleware
app.use("/v1", router);

// ✅ Health Check
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

module.exports = app;
