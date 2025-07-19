var kitchenconfig = require("../doa/kitchenconfig");
var exportDoc = require("./export-documents");
var fs = require("fs");
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
//create Kitchenconfig
exports.createkitchenConfig = async (req, res, next) => {
  try {
    if (req.params != null && req.params != undefined) {
      var userId = req.params.userId;
      var kitchenId = req.params.kitchenId;
    } else {
      res.json({ error: "request parameters required" });
    }
    if (req.body !== undefined && req.body !== null) {
      let kitchen = await kitchenconfig.getOne({ kitchenId: kitchenId });
      if (kitchen) {
        res
          .status(500)
          .json({
            error:
              "kitchenconfig with this id already exist.Team will get back to you soon !",
          });
      } else {
        var newkitchenconfig = {
          kitchenId: kitchenId,
          userId: userId,
          schedule: {
            sunday: {
              morningTimeSlotStart:
                req.body.schedule.sunday.morningTimeSlotStart,
              afterNoonTimeSlotStart:
                req.body.schedule.sunday.afterNoonTimeSlotStart,
              eveningTimeSlotStart:
                req.body.schedule.sunday.eveningTimeSlotStart,
              nightTimeSlotStart: req.body.schedule.sunday.nightTimeSlotStart,
              morningTimeSlotEnd: req.body.schedule.sunday.morningTimeSlotEnd,
              afterNoonTimeSlotEnd:
                req.body.schedule.sunday.afterNoonTimeSlotEnd,
              eveningTimeSlotEnd: req.body.schedule.sunday.eveningTimeSlotEnd,
              nightTimeSlotEnd: req.body.schedule.sunday.nightTimeSlotEnd,
              morningTimeSlot: req.body.schedule.sunday.morningTimeSlot,
              afterNoonTimeSlot: req.body.schedule.sunday.afterNoonTimeSlot,
              eveningTimeSlot: req.body.schedule.sunday.eveningTimeSlot,
              nightTimeSlot: req.body.schedule.sunday.nightTimeSlot,
            },
            monday: {
              morningTimeSlotStart:
                req.body.schedule.monday.morningTimeSlotStart,
              afterNoonTimeSlotStart:
                req.body.schedule.monday.afterNoonTimeSlotStart,
              eveningTimeSlotStart:
                req.body.schedule.monday.eveningTimeSlotStart,
              nightTimeSlotStart: req.body.schedule.monday.nightTimeSlotStart,
              morningTimeSlotEnd: req.body.schedule.monday.morningTimeSlotEnd,
              afterNoonTimeSlotEnd:
                req.body.schedule.monday.afterNoonTimeSlotEnd,
              eveningTimeSlotEnd: req.body.schedule.monday.eveningTimeSlotEnd,
              nightTimeSlotEnd: req.body.schedule.monday.nightTimeSlotEnd,
              morningTimeSlot: req.body.schedule.monday.morningTimeSlot,
              afterNoonTimeSlot: req.body.schedule.monday.afterNoonTimeSlot,
              eveningTimeSlot: req.body.schedule.monday.eveningTimeSlot,
              nightTimeSlot: req.body.schedule.monday.nightTimeSlot,
            },
            tuesday: {
              morningTimeSlotStart:
                req.body.schedule.tuesday.morningTimeSlotStart,
              afterNoonTimeSlotStart:
                req.body.schedule.tuesday.afterNoonTimeSlotStart,
              eveningTimeSlotStart:
                req.body.schedule.tuesday.eveningTimeSlotStart,
              nightTimeSlotStart: req.body.schedule.tuesday.nightTimeSlotStart,
              morningTimeSlotEnd: req.body.schedule.tuesday.morningTimeSlotEnd,
              afterNoonTimeSlotEnd:
                req.body.schedule.tuesday.afterNoonTimeSlotEnd,
              eveningTimeSlotEnd: req.body.schedule.tuesday.eveningTimeSlotEnd,
              nightTimeSlotEnd: req.body.schedule.tuesday.nightTimeSlotEnd,
              morningTimeSlot: req.body.schedule.tuesday.morningTimeSlot,
              afterNoonTimeSlot: req.body.schedule.tuesday.afterNoonTimeSlot,
              eveningTimeSlot: req.body.schedule.tuesday.eveningTimeSlot,
              nightTimeSlot: req.body.schedule.tuesday.nightTimeSlot,
            },
            wednesday: {
              morningTimeSlotStart:
                req.body.schedule.wednesday.morningTimeSlotStart,
              afterNoonTimeSlotStart:
                req.body.schedule.wednesday.afterNoonTimeSlotStart,
              eveningTimeSlotStart:
                req.body.schedule.wednesday.eveningTimeSlotStart,
              nightTimeSlotStart:
                req.body.schedule.wednesday.nightTimeSlotStart,
              morningTimeSlotEnd:
                req.body.schedule.wednesday.morningTimeSlotEnd,
              afterNoonTimeSlotEnd:
                req.body.schedule.wednesday.afterNoonTimeSlotEnd,
              eveningTimeSlotEnd:
                req.body.schedule.wednesday.eveningTimeSlotEnd,
              nightTimeSlotEnd: req.body.schedule.wednesday.nightTimeSlotEnd,
              morningTimeSlot: req.body.schedule.wednesday.morningTimeSlot,
              afterNoonTimeSlot: req.body.schedule.wednesday.afterNoonTimeSlot,
              eveningTimeSlot: req.body.schedule.wednesday.eveningTimeSlot,
              nightTimeSlot: req.body.schedule.wednesday.nightTimeSlot,
            },
            thursday: {
              morningTimeSlotStart:
                req.body.schedule.thursday.morningTimeSlotStart,
              afterNoonTimeSlotStart:
                req.body.schedule.thursday.afterNoonTimeSlotStart,
              eveningTimeSlotStart:
                req.body.schedule.thursday.eveningTimeSlotStart,
              nightTimeSlotStart: req.body.schedule.thursday.nightTimeSlotStart,
              morningTimeSlotEnd: req.body.schedule.thursday.morningTimeSlotEnd,
              afterNoonTimeSlotEnd:
                req.body.schedule.thursday.afterNoonTimeSlotEnd,
              eveningTimeSlotEnd: req.body.schedule.thursday.eveningTimeSlotEnd,
              nightTimeSlotEnd: req.body.schedule.thursday.nightTimeSlotEnd,
              morningTimeSlot: req.body.schedule.thursday.morningTimeSlot,
              afterNoonTimeSlot: req.body.schedule.thursday.afterNoonTimeSlot,
              eveningTimeSlot: req.body.schedule.thursday.eveningTimeSlot,
              nightTimeSlot: req.body.schedule.thursday.nightTimeSlot,
            },
            friday: {
              morningTimeSlotStart:
                req.body.schedule.friday.morningTimeSlotStart,
              afterNoonTimeSlotStart:
                req.body.schedule.friday.afterNoonTimeSlotStart,
              eveningTimeSlotStart:
                req.body.schedule.friday.eveningTimeSlotStart,
              nightTimeSlotStart: req.body.schedule.friday.nightTimeSlotStart,
              morningTimeSlotEnd: req.body.schedule.friday.morningTimeSlotEnd,
              afterNoonTimeSlotEnd:
                req.body.schedule.friday.afterNoonTimeSlotEnd,
              eveningTimeSlotEnd: req.body.schedule.friday.eveningTimeSlotEnd,
              nightTimeSlotEnd: req.body.schedule.friday.nightTimeSlotEnd,
              morningTimeSlot: req.body.schedule.friday.morningTimeSlot,
              afterNoonTimeSlot: req.body.schedule.friday.afterNoonTimeSlot,
              eveningTimeSlot: req.body.schedule.friday.eveningTimeSlot,
              nightTimeSlot: req.body.schedule.friday.nightTimeSlot,
            },
            saturday: {
              morningTimeSlotStart:
                req.body.schedule.saturday.morningTimeSlotStart,
              afterNoonTimeSlotStart:
                req.body.schedule.saturday.afterNoonTimeSlotStart,
              eveningTimeSlotStart:
                req.body.schedule.saturday.eveningTimeSlotStart,
              nightTimeSlotStart: req.body.schedule.saturday.nightTimeSlotStart,
              morningTimeSlotEnd: req.body.schedule.saturday.morningTimeSlotEnd,
              afterNoonTimeSlotEnd:
                req.body.schedule.saturday.afterNoonTimeSlotEnd,
              eveningTimeSlotEnd: req.body.schedule.saturday.eveningTimeSlotEnd,
              nightTimeSlotEnd: req.body.schedule.saturday.nightTimeSlotEnd,
              morningTimeSlot: req.body.schedule.saturday.morningTimeSlot,
              afterNoonTimeSlot: req.body.schedule.saturday.afterNoonTimeSlot,
              eveningTimeSlot: req.body.schedule.saturday.eveningTimeSlot,
              nightTimeSlot: req.body.schedule.saturday.nightTimeSlot,
            },
          },
          thresholdLimit: req.body.thresholdLimit,
          alerts: {
            Admin: req.body.alerts.Admin,
            Chef: req.body.alerts.Chef,
            Qa: req.body.alerts.Qa,
            Receptionist: req.body.alerts.Receptionist,
          },
        };
        let result = await kitchenconfig.create(newkitchenconfig);
        if (result) {
          res
            .status(200)
            .json({ message: "kitchenconfig created successfully" });
        } else {
          res.status(500).json({ error: "can't create kitchenconfig" });
        }
      }
    } else {
      res.status(400).json({ error: "required request body" });
    }
  } catch (e) {
    console.error(e);
  }
};

function getNextSequence() {
  return new Promise((resolve) => {
    return kitchenconfig
      .findOne()
      .sort([["kitchenId", "descending"]])
      .limit(1)
      .exec((err, data) => {
        if (data != null) {
          if (data.kitchenId != undefined) {
            return resolve(data.kitchenId);
          } else {
            return resolve(0);
          }
        } else return resolve(0);
      });
  });
}

//get all the Kitchenconfig's details present
exports.getkitchenConfigs = async (req, res, next) => {
  if (req.params != null && req.params != undefined) {
    var kitchenId = req.params.kitchenId;
    var userId = req.params.userId;
  } else {
    res.json({ error: "request parameters required" });
  }
  let result = await kitchenconfig.get({});
  if (result) {
    res.status(200).json({ kitchenconfig: result });
  } else {
    res.status(400).json({ error: "data not found" });
  }
};

//get category details based on kitchenconfig name.
exports.getkitchenConfigById = async (req, res, next) => {
  if (req.params.kitchenId != null && req.params.kitchenId != undefined) {
    var kitchenId = parseInt(req.params.kitchenId);
    // var userId = parseInt(req.params.userId);
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  let result = await kitchenconfig.getById({ kitchenId: kitchenId });
  if (result) {
    res.status(200).json({ cloudekitchen: result });
  } else {
    res.status(400).json({ error: "Id not found" });
  }
};

//update kitchenconfig detail
exports.updatekitchenConfig = async (req, res, next) => {
  if (req.params.kitchenId != null && req.params.kitchenId != undefined) {
    var kitchenId = parseInt(req.params.kitchenId);
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  let user = await kitchenconfig.getOne({ kitchenId: kitchenId });
  if (user) {
    if (req.body !== null && req.body !== undefined) {
      var newkitchenconfig = {
        schedule: {
          sunday: {
            morningTimeSlotStart: req.body.schedule.sunday.morningTimeSlotStart,
            afterNoonTimeSlotStart:
              req.body.schedule.sunday.afterNoonTimeSlotStart,
            eveningTimeSlotStart: req.body.schedule.sunday.eveningTimeSlotStart,
            nightTimeSlotStart: req.body.schedule.sunday.nightTimeSlotStart,
            morningTimeSlotEnd: req.body.schedule.sunday.morningTimeSlotEnd,
            afterNoonTimeSlotEnd: req.body.schedule.sunday.afterNoonTimeSlotEnd,
            eveningTimeSlotEnd: req.body.schedule.sunday.eveningTimeSlotEnd,
            nightTimeSlotEnd: req.body.schedule.sunday.nightTimeSlotEnd,
            morningTimeSlot: req.body.schedule.sunday.morningTimeSlot,
            afterNoonTimeSlot: req.body.schedule.sunday.afterNoonTimeSlot,
            eveningTimeSlot: req.body.schedule.sunday.eveningTimeSlot,
            nightTimeSlot: req.body.schedule.sunday.nightTimeSlot,
          },
          monday: {
            morningTimeSlotStart: req.body.schedule.monday.morningTimeSlotStart,
            afterNoonTimeSlotStart:
              req.body.schedule.monday.afterNoonTimeSlotStart,
            eveningTimeSlotStart: req.body.schedule.monday.eveningTimeSlotStart,
            nightTimeSlotStart: req.body.schedule.monday.nightTimeSlotStart,
            morningTimeSlotEnd: req.body.schedule.monday.morningTimeSlotEnd,
            afterNoonTimeSlotEnd: req.body.schedule.monday.afterNoonTimeSlotEnd,
            eveningTimeSlotEnd: req.body.schedule.monday.eveningTimeSlotEnd,
            nightTimeSlotEnd: req.body.schedule.monday.nightTimeSlotEnd,
            morningTimeSlot: req.body.schedule.monday.morningTimeSlot,
            afterNoonTimeSlot: req.body.schedule.monday.afterNoonTimeSlot,
            eveningTimeSlot: req.body.schedule.monday.eveningTimeSlot,
            nightTimeSlot: req.body.schedule.monday.nightTimeSlot,
          },
          tuesday: {
            morningTimeSlotStart:
              req.body.schedule.tuesday.morningTimeSlotStart,
            afterNoonTimeSlotStart:
              req.body.schedule.tuesday.afterNoonTimeSlotStart,
            eveningTimeSlotStart:
              req.body.schedule.tuesday.eveningTimeSlotStart,
            nightTimeSlotStart: req.body.schedule.tuesday.nightTimeSlotStart,
            morningTimeSlotEnd: req.body.schedule.tuesday.morningTimeSlotEnd,
            afterNoonTimeSlotEnd:
              req.body.schedule.tuesday.afterNoonTimeSlotEnd,
            eveningTimeSlotEnd: req.body.schedule.tuesday.eveningTimeSlotEnd,
            nightTimeSlotEnd: req.body.schedule.tuesday.nightTimeSlotEnd,
            morningTimeSlot: req.body.schedule.tuesday.morningTimeSlot,
            afterNoonTimeSlot: req.body.schedule.tuesday.afterNoonTimeSlot,
            eveningTimeSlot: req.body.schedule.tuesday.eveningTimeSlot,
            nightTimeSlot: req.body.schedule.tuesday.nightTimeSlot,
          },
          wednesday: {
            morningTimeSlotStart:
              req.body.schedule.wednesday.morningTimeSlotStart,
            afterNoonTimeSlotStart:
              req.body.schedule.wednesday.afterNoonTimeSlotStart,
            eveningTimeSlotStart:
              req.body.schedule.wednesday.eveningTimeSlotStart,
            nightTimeSlotStart: req.body.schedule.wednesday.nightTimeSlotStart,
            morningTimeSlotEnd: req.body.schedule.wednesday.morningTimeSlotEnd,
            afterNoonTimeSlotEnd:
              req.body.schedule.wednesday.afterNoonTimeSlotEnd,
            eveningTimeSlotEnd: req.body.schedule.wednesday.eveningTimeSlotEnd,
            nightTimeSlotEnd: req.body.schedule.wednesday.nightTimeSlotEnd,
            morningTimeSlot: req.body.schedule.wednesday.morningTimeSlot,
            afterNoonTimeSlot: req.body.schedule.wednesday.afterNoonTimeSlot,
            eveningTimeSlot: req.body.schedule.wednesday.eveningTimeSlot,
            nightTimeSlot: req.body.schedule.wednesday.nightTimeSlot,
          },
          thursday: {
            morningTimeSlotStart:
              req.body.schedule.thursday.morningTimeSlotStart,
            afterNoonTimeSlotStart:
              req.body.schedule.thursday.afterNoonTimeSlotStart,
            eveningTimeSlotStart:
              req.body.schedule.thursday.eveningTimeSlotStart,
            nightTimeSlotStart: req.body.schedule.thursday.nightTimeSlotStart,
            morningTimeSlotEnd: req.body.schedule.thursday.morningTimeSlotEnd,
            afterNoonTimeSlotEnd:
              req.body.schedule.thursday.afterNoonTimeSlotEnd,
            eveningTimeSlotEnd: req.body.schedule.thursday.eveningTimeSlotEnd,
            nightTimeSlotEnd: req.body.schedule.thursday.nightTimeSlotEnd,
            morningTimeSlot: req.body.schedule.thursday.morningTimeSlot,
            afterNoonTimeSlot: req.body.schedule.thursday.afterNoonTimeSlot,
            eveningTimeSlot: req.body.schedule.thursday.eveningTimeSlot,
            nightTimeSlot: req.body.schedule.thursday.nightTimeSlot,
          },
          friday: {
            morningTimeSlotStart: req.body.schedule.friday.morningTimeSlotStart,
            afterNoonTimeSlotStart:
              req.body.schedule.friday.afterNoonTimeSlotStart,
            eveningTimeSlotStart: req.body.schedule.friday.eveningTimeSlotStart,
            nightTimeSlotStart: req.body.schedule.friday.nightTimeSlotStart,
            morningTimeSlotEnd: req.body.schedule.friday.morningTimeSlotEnd,
            afterNoonTimeSlotEnd: req.body.schedule.friday.afterNoonTimeSlotEnd,
            eveningTimeSlotEnd: req.body.schedule.friday.eveningTimeSlotEnd,
            nightTimeSlotEnd: req.body.schedule.friday.nightTimeSlotEnd,
            morningTimeSlot: req.body.schedule.friday.morningTimeSlot,
            afterNoonTimeSlot: req.body.schedule.friday.afterNoonTimeSlot,
            eveningTimeSlot: req.body.schedule.friday.eveningTimeSlot,
            nightTimeSlot: req.body.schedule.friday.nightTimeSlot,
          },
          saturday: {
            morningTimeSlotStart:
              req.body.schedule.saturday.morningTimeSlotStart,
            afterNoonTimeSlotStart:
              req.body.schedule.saturday.afterNoonTimeSlotStart,
            eveningTimeSlotStart:
              req.body.schedule.saturday.eveningTimeSlotStart,
            nightTimeSlotStart: req.body.schedule.saturday.nightTimeSlotStart,
            morningTimeSlotEnd: req.body.schedule.saturday.morningTimeSlotEnd,
            afterNoonTimeSlotEnd:
              req.body.schedule.saturday.afterNoonTimeSlotEnd,
            eveningTimeSlotEnd: req.body.schedule.saturday.eveningTimeSlotEnd,
            nightTimeSlotEnd: req.body.schedule.saturday.nightTimeSlotEnd,
            morningTimeSlot: req.body.schedule.saturday.morningTimeSlot,
            afterNoonTimeSlot: req.body.schedule.saturday.afterNoonTimeSlot,
            eveningTimeSlot: req.body.schedule.saturday.eveningTimeSlot,
            nightTimeSlot: req.body.schedule.saturday.nightTimeSlot,
          },
        },
        thresholdLimit: req.body.thresholdLimit,
        alerts: {
          Admin: req.body.alerts.Admin,
          Chef: req.body.alerts.Chef,
          Qa: req.body.alerts.Qa,
          Receptionist: req.body.alerts.Receptionist,
        },
      };
      log.info("Updating kitchenconfig ===== ");
      let result = await kitchenconfig.update(
        { kitchenId: kitchenId },
        newkitchenconfig
      );
      if (result) {
        const tempObj = {
          event: "configUpdated",
          kitchenId: kitchenId
        };
        global.pusher
          .trigger("order", "incoming", {
            message: JSON.stringify(tempObj),
          })
          .then(console.log)
          .catch((e) => console.log(e));
        res.status(200).json({ message: "kitchenconfig updated successfully" });
      } else {
        res.status(500).json({ error: "can't update kitchenconfig" });
      }
    } else {
      res.status(400).json({ error: "request body required" });
    }
  } else {
    res.status(400).json({ error: "config not found" });
  }
};

//remove kitchenconfig
exports.removekitchenConfig = async (req, res, next) => {
  if (req.params.kitchenId != null && req.params.kitchenId != undefined) {
    var kitchenId = parseInt(req.params.kitchenId);
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  let user = await kitchenconfig.getOne({ kitchenId: kitchenId });
  if (user) {
    let result = await kitchenconfig.delete({ kitchenId: kitchenId });
    log.info("kitchenconfig deletion started !");
    if (result) {
      res.status(200).json({ message: "kitchenconfig deleted successfully" });
    } else {
      res.status(400).json({ error: "Id not found" });
    }
  } else {
    res
      .status(500)
      .json({ error: "kitchenconfig with this Email does not exist!" });
  }
};
exports.exportDocument = async (req, res, next) => {
  if (req.params != null && req.params != undefined) {
    var exportType = JSON.parse(req.params.exportType);
    var kitchenId = req.params.kitchenId;
    var userId = req.params.userId;
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  try {
    let result = await kitchenconfig.get({
      userId: userId,
      kitchenId: kitchenId,
    });
    var filePath;
    const fileName = kitchenId + "_" + userId + "kitchenconfig";
    const fields = ["userId", "schedule", "thresholdLimit", "alerts"];
    if (exportType === "csv") {
      filePath = await exportDoc.getCSV(result, fields, fileName);
      res.download(filePath, function (err) {
        if (err) {
          console.log(err);
        }
        fs.unlink(filePath, function () {
          console.log("File was deleted");
        });
      });
      return "successfully downloaded";
    } else if (exportType === "xlsx") {
      filePath = await exportDoc.getXLSX(result, fields, fileName);
      res.download(filePath, function (err) {
        if (err) {
          console.log(err);
        }
        fs.unlink(filePath, function () {
          console.log("File was deleted");
        });
      });
      return "successfully downloaded";
    } else if (exportType === "pdf") {
      filePath = await exportDoc.getPdf(result, fileName, "kitchenconfig");
      res.download(filePath, function (err) {
        if (err) {
          console.log(err);
        }
        fs.unlink(filePath, function () {
          console.log("File was deleted");
        });
      });
      return "successfully downloaded";
    } else {
      console.log("Unsupported File Type");
    }
  } catch (err) {
    console.error(err);
  }
};

exports.getConfigByRole = async (req, res, next) => {
  if (req.params != null && req.params != undefined) {
    var kitchenId = req.params.kitchenId;
    // var userId = req.params.userId;
    // var role = req.params.role;
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  let result = await kitchenconfig.getOne({ kitchenId: kitchenId });
  //  var  objRole = result.thresholdLimit.role;
  if (result) {
    // console.log(result.thresholdLimit);
    res
      .status(200)
      .json({ thresholdLimit: result.thresholdLimit, alerts: result.alerts });
  } else {
    res.status(200).json(result);
  }
  // else {
  //     res.status(400).json({ error: "Id not found" });

  // }
};
