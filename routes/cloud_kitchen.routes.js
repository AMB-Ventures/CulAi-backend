const express = require("express");
const router = express.Router();

var cloudKitchen = require("../controllers/cloud_kitchen.controller");
var auth = require("../middlewares/auth");

const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});
const multer = require("multer");

const querySchemaCreateOrGetAllcloudkitchen = Joi.object().keys({
  kitchenName: Joi.string().required(),
  kitchenDetails: Joi.string().required(),
  kitchenDemographicDetails: Joi.string().required(),
  kitchenEmail: Joi.string().required(),
  merchantConfig: Joi.array().items({
    vendorId: Joi.number().required(),
    merchantId: Joi.string().required(),
    merchantName: Joi.string().required(),
    merchantLogo: Joi.string().required(),
  }),
});

const querySchemaUpdateOrDeletecloudkitchen = Joi.object({
  kitchenId: Joi.number().required(),
});
const querySchemaExport = Joi.object({
  exportType: Joi.string().required(),
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
    },
  }),
});

router.post(
  "/cloudkitchen",
  upload.single("kitchenLogo"),
  cloudKitchen.createCloudkitchen
);

router.get("/cloudkitchens", cloudKitchen.getCloudkitchens);

router.get("/cloudkitchen/:kitchenId", cloudKitchen.getCloudkitchenById);

router.delete(
  "/cloudkitchen/:kitchenId",
  validator.params(querySchemaUpdateOrDeletecloudkitchen),
  cloudKitchen.removeCloudkitchen
);

router.put(
  "/cloudkitchen/:kitchenId",
  upload.single("kitchenLogo"),
  cloudKitchen.updateCloudkitchen
);

router.get(
  "/cloudkitchen/:exportType/export-document",
  [auth.verifyToken, auth.isSubAdmin],
  validator.params(querySchemaExport),
  cloudKitchen.exportDocument
);

router.patch(
  "/cloudkitchen/:kitchenId/Publish-status",
  [auth.verifyToken, auth.isSubAdmin],
  cloudKitchen.updatePublish
);

router.get(
  "/cloudkitchen/:kitchenId/merchantId/:merchantId",
  cloudKitchen.getCloudkitchenBymerchantId
);

router.get("/cloudkitchen/:kitchenId/merchants", cloudKitchen.getallmerchants);

router.post(
  "/cloudkitchen/:kitchenId/subscription",
  cloudKitchen.updateSubscription
);

module.exports = router;
