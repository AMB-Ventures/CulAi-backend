var vendor = require("../doa/vendor");
var cloudKitchen = require("../doa/cloud_kitchen");
var kitchenConfig = require("../doa/kitchenconfig");
var employee = require("../doa/employee");
var shift = require("../doa/shift");
var menu = require("../doa/menu");
var order = require("../doa/order");
var autoassignLog = require("../doa/auto-assign-logs");
const { v4: uuidv4 } = require("uuid");
var orderDetails = require("../doa/order-details");
var log = require("../logger");
var datetime = new Date();
const Pusher = require("pusher");

global.pusher = new Pusher({
  appId: process.env.pusherAppId,
  key: process.env.pusherKey,
  secret: process.env.pusherSecret,
  cluster: "ap2",
  useTLS: true,
});
const timeSlot = [
  { start: "00:00", end: "03:59", name: "midnightTimeSlot" },
  { start: "4:00", end: "07:59", name: "premorningTimeSlot" },
  { start: "8:00", end: "11:59", name: "morningTimeSlot" },
  { start: "12:00", end: "15:59", name: "afterNoonTimeSlot" },
  { start: "16:00", end: "19:59", name: "eveningTimeSlot" },
  { start: "20:00", end: "23:59", name: "nightTimeSlot" },
];
const dayName = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];
Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};

function reduceBy(reducer, acc) {
  return function (by, arr) {
    return arr[
      arr.reduce(function (acc, v, i) {
        var b = by(v);
        return reducer(acc[0], b) ? [b, i] : acc;
      }, acc || [by(arr[0]), 0])[1]
    ];
  };
}

var maximumBy = reduceBy(function (a, b) {
  return a < b;
});

//order saving to db and sending to app through pusher.
exports.saveAndSendOrder = async (req, res, next) => {
  try {
    if (req.body != null && req.body != undefined) {
      var kitchenDetails = await cloudKitchen.get({
        "merchantConfig.merchantId": req.body.merchantId,
      });
      if (
        kitchenDetails != null &&
        kitchenDetails != undefined &&
        kitchenDetails.length > 0
      ) {
        if (kitchenDetails[0].busy)
          return res.status(404).json({ error: "Kitchen not available" });
        var autoAssign = kitchenDetails[0].autoAssign === "true" ? true : false;
        var vendorDetails = await vendor.get({
          vendorName: req.body.vendorName,
        });
        if (
          vendorDetails != null &&
          vendorDetails != undefined &&
          vendorDetails.length > 0
        ) {
          var orderExist = await order.get({ orderId: req.body.orderId });
          if (orderExist.length == 0) {
            var orderObject = {};
            orderObject.schemaId = parseInt(await getOrderNextSequence()) + 1;
            orderObject.orderId = req.body.orderId;
            orderObject.customerName = req.body.customerName;
            orderObject.customerMobileNumber = req.body.customerMobileNumber;
            orderObject.vendorName = req.body.vendorName;
            orderObject.discount = req.body.discount;
            orderObject.totalAmount = 0;
            orderObject.tax = req.body.tax;
            orderObject.vendorId = vendorDetails[0].vendorId;
            orderObject.vendorLogo = vendorDetails[0].vendorLogo;
            orderObject.merchantId = req.body.merchantId;
            orderObject.merchantLogo =
              kitchenDetails[0].merchantConfig[0].merchantLogo;
            orderObject.kitchenId = kitchenDetails[0].kitchenId;
            orderObject.merchantName =
              kitchenDetails[0].merchantConfig[0].merchantName;
            orderObject.timestamp = new Date(
              new Date().toLocaleString("en-US", { timeZone: "Asia/Riyadh" })
            ).getTime();
            orderObject.tax = req.body.tax;

            var isOrderParked = false;
            var autoassignLogTemp = null;
            var preprationTimeTemp = {};
            if (autoAssign) {
              autoassignLogTemp = new autoassignLog({
                orderId: orderObject.orderId,
              });
            }
            var arr = req.body.orderDetails.map(async (i) => {
              let menuItem = await menu.getOne({
                "vendorConfig.vendorMenuId": i.menuId,
                "vendorConfig.vendorId": vendorDetails[0].vendorId,
              });
              if (!menuItem)
                return res.status(404).json({ error: "menu item not found" });
              var orderDetailsObject = {};
              orderDetailsObject.itemId = orderObject.orderId + "-" + uuidv4();
              orderDetailsObject.schemaId = parseInt(orderObject.schemaId);
              orderDetailsObject.orderId = orderObject.orderId;
              orderDetailsObject.kitchenId = orderObject.kitchenId;
              orderDetailsObject.count = i.count;
              orderDetailsObject.price = i.price;
              orderDetailsObject.menuId = menuItem.menuId;
              orderDetailsObject.vendorName = vendorDetails[0].vendorName;

              if (menuItem) {
                orderDetailsObject.menuName = menuItem.menuName;
                orderDetailsObject.menuImage = menuItem.uploadImage;
                orderDetailsObject.preparationTime = menuItem.preparationTime;
                orderObject.totalAmount =
                  orderObject.totalAmount + i.price * i.count;
              }
              orderDetailsObject.vendorLogo = vendorDetails[0].vendorLogo;
              orderDetailsObject.cookingInstruction = i.cookingInstruction;
              orderDetailsObject.size = i.size;
              //auto asssign
              if (autoAssign) {
                let chefAndQa = await getChef(orderDetailsObject, menuItem);
                autoassignLogTemp.menuIds.push(chefAndQa);
                if (chefAndQa.assign && chefAndQa.assign.chefId) {
                  orderDetailsObject.chefId = chefAndQa.assign.chefId;
                  orderDetailsObject.chefName = chefAndQa.assign.chefName;
                  orderDetailsObject.itemStatus = "incoming";
                  if (preprationTimeTemp.chefId)
                    preprationTimeTemp.chefId =
                      preprationTimeTemp.chefId + menuItem.preparationTime;
                  else preprationTimeTemp.chefId = menuItem.preparationTime;
                } else {
                  (isOrderParked = true),
                    (orderDetailsObject.itemStatus = "parked");
                }
              }
              await orderDetails.create(orderDetailsObject);
              return orderDetailsObject;
            });
            orderObject.orderDetails = await Promise.all(arr);

            //auto asssign
            if (autoAssign) {
              if (isOrderParked) {
                let Qa = await getQA(orderObject);
                if (Qa.qaId) {
                  orderObject.qaId = Qa.qaId;
                  orderObject.qaName = Qa.qaName;
                  orderObject.orderStatus = "parked";
                }
              } else {
                orderObject.orderStatus = "inprogress";
                let anyChefId = orderObject.orderDetails.find((l) => {
                  if (l.chefId) return l;
                });
                if (anyChefId) {
                  let Qa = await getQA(orderObject);
                  if (Qa.qaId) {
                    orderObject.qaId = Qa.qaId;
                    orderObject.qaName = Qa.qaName;
                  }
                }
                orderObject.preparationTime =
                  Math.max.apply(
                    null,
                    Object.keys(preprationTimeTemp).map((o) => {
                      return preprationTimeTemp[o];
                    })
                  ) +
                  orderObject.orderDetails.length * 2;
                orderObject.qaTime = orderObject.orderDetails.length * 2;
              }
              autoassignLogTemp.save();
            }

            var result = await order.create(orderObject);
            var data = {
              kitchenId: parseInt(orderObject.kitchenId),
              orderId: result.orderId,
              orderStatus: result.orderStatus,
              vendorName: result.vendorName,
              mode: "order",
              userIds: [],
              roles: ["kitchen_admin", "receptionist", "chef", "qa"],
            };
            if (orderObject.orderDetails && orderObject.orderDetails.length > 0)
              orderObject.orderDetails.map((u) => {
                data.userIds.push(u.chefId);
                data.userIds.push(u.qaId);
              });
            pusher
              .trigger("order", "incoming", { message: JSON.stringify(data) })
              .then(console.log)
              .catch((e) => console.log(e));
            res.status(200).json({ message: "order placed!" });
          } else {
            res.status(400).json({ error: "order id already exist" });
          }
        } else {
          res.status(404).json({ error: "vendor not found" });
        }
      } else {
        res.status(404).json({ error: "kitchen not found" });
      }
    } else {
      res.status(400).json({ error: "request body required" });
    }
  } catch (e) {
    console.log(e);
  }
};

const getCurrentTimeSlot = () => {
  let date_ksa_temp = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Riyadh" })
  );
  // Date object initialized from the above datetime string
  let date_ksa = new Date(date_ksa_temp);
  let hour = ("0" + date_ksa.getHours()).slice(-2);
  let obj = timeSlot.find((i) => {
    if (
      hour >= parseInt(i.start.split(":")[0]) &&
      hour <= parseInt(i.end.split(":")[0])
    ) {
      return i;
    }
  });
  if (obj) obj.day = dayName[date_ksa.getDay()];
  return obj;
};

const getChef = async (orderObject, menuItem) => {
  return new Promise(async (resolve) => {

    let currentDate = new Date().toLocaleDateString();

    let schedule = await shift.aggregate([
      {
        '$project': {
          'shiftType': 1,
          'kitchenId': 1,
          'startTime': {
            '$dateFromString': {
              'dateString': {
                '$concat': [
                  currentDate, 'T', '$startTime'
                ]
              },
              'format': '%d/%m/%YT%H:%M'
            }
          },
          'endTime': {
            '$dateFromString': {
              'dateString': {
                '$concat': [
                  currentDate, 'T', '$endTime'
                ]
              },
              'format': '%d/%m/%YT%H:%M'
            }
          }
        }
      }, {
        '$match': {
          'shiftType': 'employee',
          'kitchenId': orderObject.kitchenId,
          'startTime': {
            '$gte': new Date()
          },
          'endTime': {
            '$lte': new Date()
          }
        }
      }
    ])

    let fObj = {
      menuId: menuItem.menuId,
      assign: {},
      unassign: [],
    };
    fObj.currentTimeSlot = getCurrentTimeSlot();
    let obj1 = {
      role: "chef",
      kitchenId: orderObject.kitchenId,
      "employeeConfig.menuItemSkillsRating.menuName": menuItem.menuName,
      Name: menuItem.chefConfig.map((u) => {
        return u.chef;
      })[0]
    };
    obj1[`schedule.${fObj.currentTimeSlot.day}`] = {
      $in: schedule.map((s) => {
        return s._id;
      })
    }
    let chef = await employee.aggregate([
      { $match: obj1 }
    ]);
    if (chef.length) {
      let obj = {
        chefId: null,
        selectionStatus: "normal",
        menuItemMatched: true,
        skillsRating: 1,
        message: "",
      };
      let mArray = chef.map((o) => {
        return o.employeeConfig.map((p) => {
          return p.menuItemSkillsRating.find((m) => {
            if (parseInt(m.menuId) === parseInt(menuItem.menuId)) {
              m.chef = o;
              return m;
            }
          })
        });
      });
      mArray = mArray[0]
      let tchef = maximumBy(function (x) { return parseInt(x.skillsRating, 10); }, mArray);
      obj.chefId = tchef.chef.employeeId;
      obj.chefName = tchef.chef.Name;
      obj.skillsRating = tchef.skillsRating;
      obj.message = "Chef assign by menu id, skill rating and availability";
      fObj.assign = obj;
      mArray.forEach((j) => {
        if (j.chef.employeeId != obj.chefId) {
          fObj.unassign.push({
            chefId: j.chef.employeeId,
            menuItemMatched: true,
            skillsRating: j.skillsRating,
          });
        }
      });
    } else {
      delete obj1["employeeConfig.menuItem"];
      chef = await employee.aggregate([{ $match: obj1 }]);
      if (chef.length) {
        let obj = {
          chefId: null,
          selectionStatus: "normal",
          menuItemMatched: false,
          skillsRating: null,
          message: "",
        };
        obj.chefId = chef[0].employeeId;
        obj.chefName = chef[0].Name;
        obj.message = "Chef assign by availability";
        fObj.assign = obj;
        chef.forEach((j) => {
          if (j.employeeId != obj.chefId) {
            fObj.unassign.push({
              chefId: j.employeeId,
              menuItemMatched: false,
              skillsRating: null,
            });
          }
        });
      } else {
        delete obj1[
          `schedule.${fObj.currentTimeSlot.day}.${fObj.currentTimeSlot.name}`
        ];
        obj1["employeeConfig.menuItem"] = { $eq: `${menuItem.menuId}` };
        chef = await employee.aggregate([{ $match: obj1 }]);
        if (chef.length) {
          let obj = {
            chefId: null,
            selectionStatus: "forced",
            menuItemMatched: true,
            skillsRating: 1,
            message: "",
          };
          let mArray = chef.map((o) => {
            return o.employeeConfig.find((p) => {
              if (parseInt(p.menuItem) === parseInt(menuItem.menuId)) {
                p.chef = o;
                return p;
              }
            });
          });
          let tchef = maximumBy(function (x) {
            return parseInt(x.skillsRating, 10);
          }, mArray);
          obj.chefId = tchef.chef.employeeId;
          obj.chefName = tchef.chef.Name;
          obj.skillsRating = tchef.skillsRating;
          obj.message = "Chef assign by menu id and skill rating";
          fObj.assign = obj;
          mArray.forEach((j) => {
            if (j.chef.employeeId != obj.chefId) {
              fObj.unassign.push({
                chefId: j.chef.employeeId,
                menuItemMatched: true,
                skillsRating: j.skillsRating,
              });
            }
          });
        } else {
          //pending
        }
      }
    }
    resolve(fObj);
  });
  //employee skills rating best one choose via available best match priority
  //update employee status to busy after assigning order and available after order completed
};

const getQA = async (orderObject) => {
  return new Promise(async (resolve) => {
    let obj = { qaId: null, currentTimeSlot: null };
    obj.currentTimeSlot = getCurrentTimeSlot();
    let obj1 = { role: "qa", kitchenId: orderObject.kitchenId };
    obj1[`schedule.${obj.currentTimeSlot.day}.${obj.currentTimeSlot.name}`] = {
      $eq: true,
    };
    let qa = await employee.aggregate([{ $match: obj1 }]);
    if (qa.length) {
      obj.qaId = qa[0].employeeId;
      obj.qaName = qa[0].Name;
      // obj.qaName = tchef.chef.Name;
      obj.message = "QA assign by availability.";
    } else {
      delete obj1[
        `schedule.${obj.currentTimeSlot.day}.${obj.currentTimeSlot.name}`
      ];
      let qa = await employee.aggregate([{ $match: obj1 }]);
      if (qa.length) {
        obj.qaId = qa[0].employeeId;
        obj.qaName = qa[0].Name;
        obj.message = "QA assign forcefully.";
      }
    }
    resolve(obj);
  });
};

function getOrderNextSequence() {
  return new Promise((resolve) => {
    return order
      .findOne()
      .sort([["schemaId", "descending"]])
      .limit(1)
      .exec((err, data) => {
        if (data != null) {
          if (data.schemaId != undefined) {
            return resolve(data.schemaId);
          } else {
            return resolve(0);
          }
        } else return resolve(0);
      });
  });
}

exports.deleteAllOrders = async (req, res, next) => {
  if (req.params.kitchenId != null && req.params.kitchenId != undefined) {
    var kitchenId = parseInt(req.params.kitchenId);
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  let orders = await order.deleteOrders({ kitchenId: kitchenId });
  let orderdetails = await orderDetails.deleteOrders({ kitchenId: kitchenId });
  if (orders && orderdetails) {
    res.status(200).json({ message: "Orders deleted succussfully" });
  } else {
    res.status(400).json({ error: "Unable to delete orders" });
  }
};
