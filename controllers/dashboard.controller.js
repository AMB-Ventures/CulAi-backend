var mongoose = require("mongoose");
const order = require("../doa/order.doa");
const inventory = require("../doa/inventory.doa");
const stockPurchasings = require("../doa/stockPurchasing.doa");
const stockProductions = require("../doa/stockProduction.doa");
const moment = require("moment");

const getVendorGeneralDashboardStats = async (req, res, next) => {
  try {
    const startDate = moment(Number(req.query.startDate));
    const endDate = moment(Number(req.query.endDate));
    let graphEndDate = moment(Number(req.query.startDate)).add(11, "d");

    if (graphEndDate.isSameOrAfter(endDate)) {
      graphEndDate = endDate;
    }

    const [
      orderCount,
      totalSalesAmount,
      discountAmountResult,
      returnedAmountResult,
      dailyOrdersBasedOnPriority,
      dailyNumberOfSalesData,
      recentOrders,
      topProductsQuery,
      topBranchesQuery,
    ] = await Promise.all([
      // Total number of orders
      order.countDocuments({
        "vendor._id": { $eq: mongoose.Types.ObjectId(req.user.vendor._id) },
        status: { $ne: "returned" },
        createdAt: {
          $gte: startDate.toDate(),
          $lt: endDate.toDate(),
        },
      }),
      // Total sales amount
      order.aggregate([
        {
          $match: {
            "vendor._id": {
              $eq: mongoose.Types.ObjectId(req.user.vendor._id),
            },
            status: { $ne: "returned" },
            createdAt: {
              $gte: startDate.toDate(),
              $lt: endDate.toDate(),
            },
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$totalAmount" },
          },
        },
      ]),
      // Total discount amount
      order.aggregate([
        {
          $match: {
            "vendor._id": {
              $eq: mongoose.Types.ObjectId(req.user.vendor._id),
            },
            status: { $ne: "returned" },
            createdAt: {
              $gte: startDate.toDate(),
              $lt: endDate.toDate(),
            },
          },
        },
        {
          $group: {
            _id: null,
            discount: { $sum: "$discount" },
          },
        },
      ]),
      // Total returned amount
      order.aggregate([
        {
          $match: {
            "vendor._id": { $eq: mongoose.Types.ObjectId(req.user.vendor._id) },
            status: { $eq: "returned" },
            createdAt: {
              $gte: startDate.toDate(),
              $lt: endDate.toDate(),
            },
          },
        },
        {
          $group: {
            _id: null,
            totalReturnedAmount: { $sum: "$totalAmount" },
          },
        },
      ]),
      // Daily orders based on priority fro graph
      order.aggregate([
        {
          $match: {
            "vendor._id": { $eq: mongoose.Types.ObjectId(req.user.vendor._id) },
            createdAt: {
              $gte: startDate.toDate(),
              $lt: graphEndDate.toDate(),
            },
          },
        },
        {
          $group: {
            _id: {
              orderType: "$orderType",
              date: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
            },
            count: { $sum: 1 },
          },
        },
        {
          $addFields: {
            date: { $dateFromString: { dateString: "$_id.date" } },
          },
        },
        {
          $sort: {
            date: 1,
          },
        },
      ]),
      // Daily number of sales for the graph
      order.aggregate([
        {
          $match: {
            "vendor._id": { $eq: mongoose.Types.ObjectId(req.user.vendor._id) },
            completedBy: { $exists: true }, // Filter only completed orders
            createdAt: {
              $gte: startDate.toDate(),
              $lt: graphEndDate.toDate(),
            },
          },
        },
        {
          $group: {
            _id: {
              date: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
            },
            totalOrders: { $sum: "$totalAmount" },
          },
        },
        {
          $addFields: {
            date: { $dateFromString: { dateString: "$_id.date" } },
          },
        },
        {
          $sort: {
            date: 1,
          },
        },
      ]),
      // Recent orders
      order
        .find({
          "vendor._id": { $eq: mongoose.Types.ObjectId(req.user.vendor._id) },
        })
        .select({
          orderId: 1,
          customer: 1,
          totalAmount: 1,
          status: 1,
          createdAt: 1,
        })
        .sort({ createdAt: -1 })
        .limit(5)
        .exec(),
      // Top products by net sales
      order.aggregate([
        {
          $match: {
            "vendor._id": { $eq: mongoose.Types.ObjectId(req.user.vendor._id) },
            status: { $eq: "completed" },
            createdAt: {
              $gte: startDate.toDate(),
              $lt: endDate.toDate(),
            },
          },
        },
        { $unwind: "$orderItems" }, // Split the array of order items into separate documents
        {
          $group: {
            _id: "$orderItems.product._id",
            productName: { $first: "$orderItems.product.name" },
            totalSales: { $sum: "$orderItems.qty" },
          },
        },
        { $sort: { totalSales: -1 } }, // Sort in descending order of total sales
        { $limit: 5 }, // Limit to the top 5 products
      ]),
      // Top branches by net sales
      order.aggregate([
        {
          $match: {
            "vendor._id": { $eq: mongoose.Types.ObjectId(req.user.vendor._id) },
            status: { $eq: "completed" },
            createdAt: {
              $gte: startDate.toDate(),
              $lt: endDate.toDate(),
            },
          },
        },
        {
          $group: {
            _id: "$branch._id",
            branchName: { $first: "$branch.name" },
            totalSales: { $sum: "$totalAmount" },
          },
        },
        { $sort: { totalSales: -1 } }, // Sort in descending order of total sales
        { $limit: 5 }, // Limit to the top 5 products
      ]),
    ]);

    res.status(200).json({
      ordersCount: orderCount,
      netSales: totalSalesAmount[0]?.totalAmount || 0,
      discountAmount: discountAmountResult[0]?.discount || 0,
      returnAmount: returnedAmountResult[0]?.totalReturnedAmount || 0,
      dailyOrdersBasedOnPriority,
      dailyNumberOfSalesData,
      recentOrders,
      topProductsQuery,
      topBranchesQuery,
    });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

const getVendorInventoryDashboardStats = async (req, res, next) => {
  try {
    // Date filters
    const startDate = moment(Number(req.query.startDate));
    const endDate = moment(Number(req.query.endDate));
    const graphEndDate = moment(Number(req.query.startDate)).add(10, "d");

    const [
      totalProductsCount, // use
      totalStocksCount, // use
      stockPurchasing, // use
      stockProduction, // use
    ] = await Promise.all([
      // Total number of products
      inventory.countDocuments({
        vendor: { $eq: mongoose.Types.ObjectId(req.user.vendor._id) },
        __type: { $eq: "product" },
        createdAt: {
          $gte: startDate.toDate(),
          $lt: endDate.toDate(),
        },
      }),
      // Total number of stock items
      inventory.countDocuments({
        vendor: { $eq: mongoose.Types.ObjectId(req.user.vendor._id) },
        __type: { $eq: "stock" },
        createdAt: {
          $gte: startDate.toDate(),
          $lt: endDate.toDate(),
        },
      }),
      //Total quantity & cost of purchases
      stockPurchasings.aggregate([
        {
          $match: {
            vendor: { $eq: mongoose.Types.ObjectId(req.user.vendor._id) },
            createdAt: {
              $gte: startDate.toDate(),
              $lt: endDate.toDate(),
            },
          },
        },
        { $unwind: "$items" }, // Split the array of order items into separate documents
        {
          $group: {
            _id: null,
            totalQuantity: { $sum: "$items.qty" },
            totalAmount: { $sum: "$items.totalPrice" },
          },
        },
      ]),
      // Total stock productions
      stockProductions.aggregate([
        {
          $match: {
            vendor: { $eq: mongoose.Types.ObjectId(req.user.vendor._id) },
            createdAt: {
              $gte: startDate.toDate(),
              $lt: endDate.toDate(),
            },
          },
        },
        { $unwind: "$items" }, // Split the array of order items into separate documents
        {
          $group: {
            _id: null,
            rows: {
              $push: { item: "$items.item", qty: "$items.qty" },
            },
            totalQuantity: { $sum: "$items.qty" },
          },
        },
      ]),
    ]);

    res.status(200).json({
      totalProductsCount: totalProductsCount,
      totalStocksCount: totalStocksCount,
      purchases: {
        totalPurchasesQuantity: stockPurchasing[0]?.totalQuantity || 0,
        totalPurchasesAmount: stockPurchasing[0]?.totalAmount || 0,
      },
      productions: {
        totalStockProductionQuantity: stockProduction[0]?.totalQuantity || 0,
        rows: stockProduction[0]?.rows || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

// const getProductionCostOfItems = async (req, res, next) => {
//   const input = [
//     {
//       item: "6573953be77d67001e0af1e6",
//       qty: 105,
//     },
//   ];

//   try {
//     const promises = input.map((element) => {
//       return inventory.findById(mongoose.Types.ObjectId(element.item));
//     });

//     const fetchedProducts = await Promise.all(promises);

//     const totalAmountPromises = fetchedProducts.map((fetchedProduct, index) =>
//       calculateCostRecursively(fetchedProduct.ingredients, input[index].qty)
//     );

//     const productionCosts = await Promise.all(totalAmountPromises);
//     const totalProductionCost = productionCosts.reduce((a, b) => a + b, 0);

//     return res.status(200).json({ totalProductionCost });
//   } catch (error) {
//     next(error);
//   }
// };

// gpt
const getProductionCostOfItems = async (req, res, next) => {
  const input = [
    {
      item: "6573953be77d67001e0af1e6",
      qty: 105,
    },
  ];

  try {
    const itemIds = input.map((element) =>
      mongoose.Types.ObjectId(element.item)
    );
    const fetchedProducts = await inventory.find({ _id: { $in: itemIds } });

    // Ensure the order of fetchedProducts matches the order of itemIds
    const sortedFetchedProducts = itemIds.map((id) =>
      fetchedProducts.find((product) => product._id.equals(id))
    );

    const totalProductionCost = await Promise.all(
      sortedFetchedProducts.map(async (product, index) => {
        const qty = input[index].qty;
        return await calculateCostRecursively(product.ingredients, qty);
      })
    ).then((productionCosts) => productionCosts.reduce((a, b) => a + b, 0));

    return res.status(200).json({ totalProductionCost });
  } catch (error) {
    next(error);
  }
};

// const calculateCostRecursively = async (products, qty) => {
//   const promises = products.map((element) => {
//     return inventory.findById(mongoose.Types.ObjectId(element.item));
//   });

//   const fetchedProducts = await Promise.all(promises);

//   const prices = fetchedProducts.map((fetchedProduct) => {
//     const qty = products.find((product) => {
//       if (product.item.toString() === fetchedProduct._id.toString()) {
//         return product;
//       }
//     }).qty;

//     if (fetchedProduct.costingMethod === "fromIngredients") {
//       return calculateCostRecursively(fetchedProduct.ingredients, qty);
//     } else {
//       return Number(fetchedProduct.costPrice) * qty;
//     }
//   });

//   const response = await Promise.all(prices);
//   return response.reduce((a, b) => a + b, 0) * qty;
// };

// chatgpt
const calculateCostRecursively = async (products, qty) => {
  const itemIds = products.map((element) =>
    mongoose.Types.ObjectId(element.item)
  );
  const fetchedProducts = await inventory.find({ _id: { $in: itemIds } });

  const prices = await Promise.all(
    fetchedProducts.map(async (fetchedProduct) => {
      const product = products.find(
        (p) => p.item.toString() === fetchedProduct._id.toString()
      );
      const productQty = product.qty;

      if (fetchedProduct.costingMethod === "fromIngredients") {
        return await calculateCostRecursively(
          fetchedProduct.ingredients,
          productQty
        );
      } else {
        return Number(fetchedProduct.costPrice) * productQty;
      }
    })
  );

  return prices.reduce((a, b) => a + b, 0) * qty;
};

module.exports = {
  getVendorGeneralDashboardStats,
  getVendorInventoryDashboardStats,
  getProductionCostOfItems,
};
