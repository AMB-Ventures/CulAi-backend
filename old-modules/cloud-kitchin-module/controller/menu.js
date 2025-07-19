var menu = require("../doa/menu");
var ingredients = require("../doa/ingredients");
// var video = require('../controller/menu');
var exportDoc = require("./export-documents");
var fs = require("fs");
var log = require("../logger");
var datetime = new Date();
const s3VideoUpload = require("./s3VideoUpload");
const s3ImageUpload = require("./s3ImageUpload");
var AWS = require("aws-sdk");
var cloudKitchen = require("../doa/cloud_kitchen");
var subCategory = require("../doa/sub_category");

exports.createMenu = async (req, res, next) => {
  try {
    if (req.params != null && req.params != undefined) {
      var userId = req.params.userId;
      var kitchenId = req.params.kitchenId;
    } else {
      res.json({ error: "request parameters required" });
    }
    let kitchen = await cloudKitchen.getById({ kitchenId: kitchenId });
    if (kitchen.subscription.features) {
      let specificFeature = kitchen.subscription.features.find((j) => {
        if (j._id.featureConstant === "no_of_menus") return j;
      });
      if (specificFeature) {
        let menus = await menu.get({ userId: userId, kitchenId: kitchenId });
        if (menus.length < specificFeature?.count) {
          if (req.body !== undefined && req.body !== null && req.body.data) {
            req.body = JSON.parse(req.body.data);
            let existingMenu = await menu.getOne({
              "vendorConfig.vendorId": {
                $in: req.body.vendorConfig.map((i) => {
                  return i.vendorId;
                }),
              },
              "vendorConfig.vendorMenuId": {
                $in: req.body.vendorConfig.map((i) => {
                  return i.vendorMenuId;
                }),
              },
            });
            if (!existingMenu) {
              let videoResp = null;
              let imageResp = null;
              if (req.files) {
                if (req.files.video) {
                  videoResp = await s3VideoUpload(
                    req.files.video[0],
                    `video/${req.params.kitchenId}`
                  );
                  if (!videoResp.path.Key) {
                    res.status(500).json({ error: "can't upload video" });
                    return;
                  }
                }
                if (req.files.image) {
                  imageResp = await s3ImageUpload(
                    req.files.image[0],
                    `menuimage/${req.params.kitchenId}`
                  );
                  if (!imageResp.path.Key) {
                    res.status(500).json({ error: "can't upload image" });
                    return;
                  }
                }
                var Id = await getNextSequence();
                var menuObject = {
                  kitchenId: kitchenId,
                  userId: userId,
                  menuId: parseInt(Id) + 1,
                  menuName: req.body.menuName,
                  category: req.body.category,
                  subcategory: req.body.subcategory,
                  preparationTime: req.body.preparationTime,
                  description: req.body.description,
                  uploadVideo: videoResp ? videoResp.path.Key : "",
                  uploadImage: imageResp ? imageResp.path.Key : "",
                  chefConfig: req.body.chefConfig,
                  vendorConfig: req.body.vendorConfig,
                  phases: req.body.phases,
                  available: "false",
                };
                let result = await menu.create(menuObject);
                if (result) {
                  res
                    .status(200)
                    .json({ message: "menu created successfully" });
                } else {
                  res.status(500).json({ error: "can't create menu" });
                }
              }
            } else {
              res.status(400).json({ error: "Vendor menu Id already exists." });
            }
          } else {
            res.status(400).json({ error: "required request body" });
          }
        } else
          return res
            .status(400)
            .json({ error: "Upgrade your Subscription. Limit exceed!" });
      } else
        return res
          .status(400)
          .json({ error: "Upgrade your Subscription. Limit exceed!" });
    }
  } catch (e) {
    console.error(e);
  }
};

exports.commonfileupload = async (req, res, next) => {
  try {
    resps = await s3ImageUpload(req.files.commonfile[0], `commonfile`);
    res.status(200).json({ message: "video upload successfully", resps });
  } catch (e) {
    console.error(e);
  }
};

function getNextSequence() {
  return new Promise((resolve) => {
    return menu
      .findOne()
      .sort([["menuId", "descending"]])
      .limit(1)
      .exec((err, data) => {
        if (data != null) {
          if (data.menuId != undefined) {
            return resolve(data.menuId);
          } else {
            return resolve(0);
          }
        } else return resolve(0);
      });
  });
}

//get all menu
exports.getMenus = async (req, res, next) => {
  if (req.params != null && req.params != undefined) {
    // var userId = req.params.userId;
    var kitchenId = req.params.kitchenId;
  } else {
    res.json({ error: "request parameters required" });
  }
  if (req.body.getAll) var obj = { kitchenId: kitchenId };
  else var obj = { kitchenId: kitchenId, available: "true" };
  let result = await menu.get(obj);
  if (result) {
    res.status(200).json({ items: result });
  } else {
    res.status(500).json({ error: "data not found" });
  }
};

//video download
exports.videoPlay = async (req, res, next) => {
  if (!req.body.path) res.json({ error: "request parameters required" });
  try {
    var fileKey = req.body.path;
    AWS.config.update({
      accessKeyId: process.env.accessKeyId,
      secretAccessKey: process.env.secretAccessKey,
      region: process.env.region,
    });
    const s3 = new AWS.S3();
    var options = {
      Bucket: "culin-video",
      Key: fileKey,
    };
    res.attachment(fileKey);
    var fileStream = s3.getObject(options).createReadStream();
    fileStream.pipe(res);
  } catch (e) {
    res.status(500).json({ error: "Error in download" });
  }
};

// menu getby menuId etails
exports.getMenuById = async (req, res, next) => {
  if (req.params.menuId != null && req.params.menuId != undefined) {
    var menuId = req.params.menuId;
    var userId = req.params.userId;
    var kitchenId = req.params.kitchenId;
  } else {
    res.json({ error: "request parameters required" });
  }
  let result = await menu.getById({
    menuId: menuId,
    userId: userId,
    kitchenId: kitchenId,
  });
  if (result) {
    res.status(200).json({ menu: result });
  } else {
    res.status(500).json({ error: "Id not found" });
  }
};

exports.getById = async (req, res, next) => {
  if (req.params.menuId != null && req.params.menuId != undefined) {
    var menuId = req.params.menuId;
    // var userId = req.params.userId;
    var kitchenId = req.params.kitchenId;
  } else {
    res.json({ error: "request parameters required" });
  }
  let result = await menu.getOne({ menuId: menuId, kitchenId: kitchenId });
  if (result) {
    res.status(200).json({ menu: result });
  } else {
    res.status(500).json({ error: "Id not found" });
  }
};

exports.getIngredients = async (req, res, next) => {
  let result = await ingredients.get();
  if (result) {
    res.status(200).json(result[0]);
  } else {
    res.status(500).json({ error: "Error found" });
  }
};

// update menu detail
exports.updateMenu = async (req, res, next) => {
  if (req.params != null && req.params != undefined) {
    var menuId = req.params.menuId;
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  let menuData = await menu.getOne({ menuId: menuId });
  if (menuData) {
    if (req.body !== undefined && req.body !== null && req.body.data) {
      req.body = JSON.parse(req.body.data);
      let videoResp = null;
      let imageResp = null;
      if (req.files) {
        if (req.files.video) {
          videoResp = await s3VideoUpload(
            req.files.video[0],
            `video/${req.params.kitchenId}`
          );
          if (!videoResp.path.Key) {
            res.status(500).json({ error: "can't upload video" });
            return;
          }
        }
        if (req.files.image) {
          imageResp = await s3ImageUpload(
            req.files.image[0],
            `menuimage/${req.params.kitchenId}`
          );
          if (!imageResp.path.Key) {
            res.status(500).json({ error: "can't upload image" });
            return;
          }
        }
      }
      var newmenu = {
        menuName: req.body.menuName,
        category: req.body.category,
        subcategory: req.body.subcategory,
        description: req.body.description,
        preparationTime: req.body.preparationTime,
        chefConfig: req.body.chefConfig,
        vendorConfig: req.body.vendorConfig,
        phases: JSON.parse(JSON.stringify(req.body.phases)),
      };
      if (videoResp) newmenu.uploadVideo = videoResp.path.Key;
      if (imageResp) newmenu.uploadImage = imageResp.path.Key;

      log.info("Updating menu =====> ");
      let result = await menu.update({ menuId: menuId }, newmenu);
      if (result) {
        res.status(200).json({ message: "menu updated successfully" });
      } else {
        res.status(500).json({ error: "can't update menu" });
      }
    } else {
      res.status(400).json({ error: "request body required" });
    }
  } else {
    res.status(400).json({ error: "menu data not found" });
  }
};

//remove menu
exports.removeMenu = async function (req, res) {
  if (req.params.menuId != null && req.params.menuId != undefined) {
    var menuId = req.params.menuId;
  } else {
    res.status(500).json({ error: "request parameters required" });
  }
  let menuData = await menu.getOne({ menuId: menuId });
  if (menuData) {
    let result = await menu.delete({ menuId: menuId });
    log.info("menu deletion started !");
    if (result) {
      res.status(200).json({ message: "menu deleted successfully" });
    } else {
      res.status(500).json({ error: "can't delete menu" });
    }
  } else {
    res.status(400).json({ error: "menu with this menuId does not exist!" });
  }
};

// export to csv file
exports.exportDocument = async (req, res, next) => {
  if (req.params != null && req.params != undefined) {
    var exportType = req.params.exportType;
    var kitchenId = req.params.kitchenId;
    var userId = req.params.userId;
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  try {
    let result = await menu.get({ userId: userId, kitchenId: kitchenId });
    var filePath;
    const fileName = kitchenId + "_" + userId + "menu";
    const fields = [
      "kitchenId",
      "userId",
      "menuId",
      "menuName",
      "category",
      "subcategory",
      "description",
      "Preparationtime",
      "ingredients",
      "available",
    ];
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
      filePath = await exportDoc.getPdf(result, fileName, "menu");
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
exports.updateAvailable = async (req, res, next) => {
  if (req.params.menuId != null && req.params.menuId != undefined) {
    var menuId = parseInt(req.params.menuId);
  } else {
    res.status(400).json({ error: "request parameters required" });
  }
  log.info("updating Available ===== ");
  let vendorData = await menu.getOne({ menuId: menuId });
  if (vendorData) {
    if (req.body !== null && req.body !== undefined) {
      var updateAvailableObject = {};
      updateAvailableObject.available = req.body.available;
      let result = await menu.update({ menuId: menuId }, updateAvailableObject);
      if (result) {
        res
          .status(200)
          .json({ message: "Menu Available Updated successfully" });
      } else {
        res.status(500).json({ error: "can't update Available" });
      }
    } else {
      res.status(400).json({ error: "request body required" });
    }
  } else {
    res.status(400).json({ error: "Menu data not found" });
  }
};

exports.getcategories = async (req, res, next) => {
  if (req.params.category != null && req.params.category != undefined) {
    var category = req.params.category;
    var user = req.params.userId;
  } else {
    res.json({ error: "request parameters required" });
  }
  if (req.body.getAll) var obj = { userId: user, category: category };
  else var obj = { userId: user, category: category, available: "true" };
  let result = await menu.getById(obj);
  if (result) {
    res.status(200).json({ category: result });
  } else {
    res.status(500).json({ error: "category not found" });
  }
};
exports.getSubCategories = async (req, res, next) => {
  if (req.params.subcategory != null && req.params.subcategory != undefined) {
    var subcategory = req.params.subcategory;
  } else {
    res.json({ error: "request parameters required" });
  }
  let result = await menu.find({ subcategory: subcategory });
  if (result) {
    res.status(200).json({ subcategory: result });
  } else {
    res.status(500).json({ error: "sub category not found" });
  }
};

exports.getMenusByKitchen = async (req, res, next) => {
  if (req.params != null && req.params != undefined) {
    var category = req.params.category;
    var kitchen = req.params.kitchenId;
  } else {
    res.json({ error: "request parameters required" });
  }
  let result = await menu.get({ category: category, kitchenId: kitchen });
  if (result.length > 0) {
    res.status(200).json({ category: result });
  } else {
    res.status(500).json({ error: "No menus available in this cloud kitchen" });
  }
};

exports.getSubCategory = async (req, res, next) => {
  if (req.params != null && req.params != undefined) {
    var category = req.params.category;
  } else {
    res.json({ error: "request parameters required" });
  }
  let result = await subCategory.get({ categoryName: category });
  if (result) {
    res.status(200).json({ category: result });
  } else {
    res.status(500).json({ error: "No menus available in this cloud kitchen" });
  }
};
