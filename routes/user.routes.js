const express = require("express");
const router = express.Router();

const user = require("../controllers/user.controller");
const multer = require("multer");

// const querySchemaCreateOrGetAllvendor = Joi.object().keys({
//   vendorName: Joi.string().required(),
//   licenseKey: Joi.string().required(),
//   webHookUrl: Joi.string().required(),
// });

// const querySchemaUpdateOrDeletevendor = Joi.object({
//   vendorId: Joi.number(),
// });
// const querySchemaExport = Joi.object({
//   exportType: Joi.string().required(),
// });

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

router.get("/users", user.getUsers);
router.post("/user", user.createUser);
router.put("/user/:userId", user.updateUser);
router.patch("/user", user.updateUserAccountSettings);
router.delete("/users", user.deleteUsers);

// router.post('/', upload.single('image'), user.createVendor);
// router.get('/vendor/:vendorId', user.getVendorById);
// router.delete('/vendor/:vendorId', validator.params(querySchemaUpdateOrDeletevendor), user.removeVendor);
// router.put('/vendor/:vendorId', upload.single('image'), user.updateVendor);
// router.get('/vendor/:exportType/export-document', [auth.verifyToken, auth.isSuperAdmin], validator.params(querySchemaExport), user.exportDocument);
// router.patch('/vendor/:vendorId/publish-status', [auth.verifyToken, auth.isSuperAdmin], user.updatePublish);

module.exports = router;
