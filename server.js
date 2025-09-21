// server.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();
const cors = require("cors");
const initDb = require("./config/database");
const authMiddleware = require("./middlewares/auth");

const app = express();

/* ---------- Core Middlewares ---------- */
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

// If you run behind a proxy/load balancer (Fly), trust the proxy for correct IPs.
app.set("trust proxy", true);

/* ---------- CORS ---------- */
const allowList = new Set([
  "https://console.cul-ai.com",
  "https://console-culinks.vercel.app",
  "https://cul-ai-frontend.fly.dev",
  "https://admin.cul-ai.com",
  "https://pos.cul-ai.com",
  "http://localhost:3000",
  "http://localhost:3001",
  "https://main.d3m30tipkq4qvg.amplifyapp.com",
  "http://localhost:8081",
]);

// Allow any *.fly.dev subdomain too (preview apps, etc.)
const flyDevRegex = /\.fly\.dev$/i;

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser/health checks (no Origin header)
    if (!origin) return callback(null, true);

    if (allowList.has(origin) || flyDevRegex.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS: Origin ${origin} not allowed`), false);
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  credentials: true,
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
};
app.use(cors(corsOptions));

// Handle preflight quickly
app.options("*", cors(corsOptions));

/* ---------- Database ---------- */
initDb()
  .then((connection) => {
    if (connection) {
      console.log("✅ Database initialized");
    } else {
      console.warn(
        "⚠️  Skipping database connection because process.env.DB is not configured."
      );
    }
  })
  .catch((err) => {
    console.error("❌ Database init error:", err?.message || err);
    // Don't crash — app can still answer /healthz with failure state if needed
  });

/* ---------- Routes ---------- */
// Imports
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

// Versioned API router
const router = express.Router();

// Public
router.use("/auth", authRoutes);

// Protected
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

// Inject multiple protected routers at root of /v1
router.use("/", authMiddleware.verifyToken, [roleRoutes, userRoutes, vendorRoutes]);

// Mount versioned API
app.use("/v1", router);

/* ---------- Health & Root ---------- */
// Liveness/readiness probe
app.get("/healthz", (req, res) => {
  // Optionally include simple status meta
  res.status(200).json({ status: "ok", time: new Date().toISOString() });
});

// Friendly root (not "Hello, World!" to avoid confusion)
app.get("/", (req, res) => {
  res.type("text").send("CulAi Backend is running. See /healthz and /v1 routes.");
});

/* ---------- Fallbacks ---------- */
// 404 for unmatched routes
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

// Centralized error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Internal Server Error",
  });
});

/* ---------- Socket.IO ---------- */
const httpServer = http.createServer(app);

const io = socketIo(httpServer, {
  path: "/socket",
  cors: {
    origins: [
      "https://console-culinks.vercel.app, http://localhost:3000",
      "https://console.cul-ai.com",
      "https://cul-ai-frontend.fly.dev",
      "https://admin.cul-ai.com",
      "http://localhost:3001",
    ],
    methods: ["GET", "POST"],
  },
});

app.io = io;

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

/* ---------- Start Server (Fly.io expects a listener) ---------- */
const PORT = Number(process.env.PORT) || 8080;
app.set("port", PORT);

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server listening on http://0.0.0.0:${PORT}`);
});

module.exports = app;
module.exports.httpServer = httpServer;
