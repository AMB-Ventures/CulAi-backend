var menu = require("../controller/menu");
var importExcel = require("../controller/importExcel");
// var auth = require('../middlewares/validate-token');
const Joi = require("joi");
const multer = require("multer");
const path = require("path");
const validator = require("express-joi-validation").createValidator({});

const querySchemaCreateOrGetAllMenu = Joi.object().keys({
  menuName: Joi.string().required(),
  category: Joi.string().required(),
  subcategory: Joi.string().required(),
  description: Joi.string().required(),
  uploadVideo: Joi.string(),
  uploadImage: Joi.string(),
  preparationTime: Joi.number().required(),
  ingredients: Joi.string().required(),
  chefConfig: Joi.array().items({
    chef: Joi.string(),
    skillsRating: Joi.number(),
  }),
  vendorConfig: Joi.array().items({
    vendorId: Joi.string(),
    vendorMenuId: Joi.string(),
  }),
});

const querySchemaUpdateOrDeleteMenu = Joi.object({
  menuId: Joi.number().required(),
  userId: Joi.number().required(),
  kitchenId: Joi.number().required(),
});

const querySchemaExport = Joi.object({
  exportType: Joi.string().required(),
  userId: Joi.number().required(),
  kitchenId: Joi.number().required(),
});

const querySchemaVideoPlay = Joi.object({
  path: Joi.string().required(),
});

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      console.log("destination", file);
      try {
        cb(null, "");
      } catch (e) {
        cb(e);
      }
    },
    filename: function (req, file, cb) {
      console.log("filename", file);
      try {
        let a = file.originalname.split(".");

        cb(
          null,
          `${file.fieldname}-${new Date().getTime()}.${a[a.length - 1]}`
        );
      } catch (e) {
        cb(e);
      }
      //cb(null, file.fieldname + '-' + Date.now())
    },
  }),
});

const storages = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("destination", file);
    try {
      cb(null, "");
    } catch (e) {
      cb(e);
    }
  },
  filename: function (req, file, cb) {
    console.log("filename", file);
    try {
      let a = file.originalname.split(".");

      cb(null, `${file.fieldname}-${new Date().getTime()}.${a[a.length - 1]}`);
    } catch (e) {
      cb(e);
    }
    //cb(null, file.fieldname + '-' + Date.now())
  },
});

const uploads = multer({
  storage: storages,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".xlsx" && ext !== ".xls") {
      return callback("Only excel file extentions are allowed!", true);
    }
    console.log("fileFilter");
    callback(null, true);
  },
});

module.exports = function (router) {
  router.post(
    "/:kitchenId/user/:userId/menu",
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "video", maxCount: 1 },
    ]),
    menu.createMenu
  );
  router.put("/:kitchenId/menus", menu.getMenus);
  router.post(
    "/:kitchenId/user/:userId/importexcel",
    uploads.single("file"),
    importExcel.importExcel
  );
  router.post(
    "/:kitchenId/videoplay",
    validator.body(querySchemaVideoPlay),
    menu.videoPlay
  );
  router.get("/:kitchenId/user/:userId/menu/:menuId", menu.getMenuById);
  router.delete(
    "/:kitchenId/user/:userId/menu/:menuId",
    validator.params(querySchemaUpdateOrDeleteMenu),
    menu.removeMenu
  );
  router.put(
    "/:kitchenId/user/:userId/menu/:menuId",
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "video", maxCount: 1 },
    ]),
    menu.updateMenu
  );
  router.get(
    "/:kitchenId/user/:userId/menu/:exportType/export-document",
    validator.params(querySchemaExport),
    menu.exportDocument
  );
  router.patch(
    "/:kitchenId/user/:userId/menu/:menuId/available-status",
    menu.updateAvailable
  );
  router.get("/:kitchenId/user/:userId/category/:category", menu.getcategories);
  router.get(
    "/:kitchenId/user/:userId/subcategory/:subcategory",
    menu.getSubCategories
  );
  router.get("/:kitchenId/menu/:menuId", menu.getById);
  router.get("/:kitchenId/ingredients", menu.getIngredients);
  router.get("/menu/:category", menu.getcategories);
  router.get("/menu/:category/:kitchenId", menu.getMenusByKitchen);
  router.post(
    "/commonfileupload",
    upload.fields([{ name: "commonfile", maxCount: 1 }]),
    menu.commonfileupload
  );
  router.get("/category/:category", menu.getSubCategory);
};
