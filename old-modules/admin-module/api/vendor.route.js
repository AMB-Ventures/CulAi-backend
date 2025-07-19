var vendor = require('../controller/vendor');
const Joi = require('joi');
var auth = require('../middlewares/validate-token');
const validator = require('express-joi-validation').createValidator({});
const multer = require('multer');

const querySchemaCreateOrGetAllvendor = Joi.object().keys({
    vendorName: Joi.string().required(),
    licenseKey: Joi.string().required(),
    webHookUrl: Joi.string().required()
});

const querySchemaUpdateOrDeletevendor = Joi.object({
    vendorId: Joi.number()
});
const querySchemaExport = Joi.object({
    exportType: Joi.string().required()
});

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            console.log('destination', file);
            try {
                cb(null, '')
            } catch (e) {
                cb(e)
            }
        },
        filename: function (req, file, cb) {
            console.log('filename', file);
            try {
                let a = file.originalname.split('.')

                cb(null, `${file.fieldname}-${new Date().getTime()}.${a[a.length - 1]}`)
            } catch (e) {
                cb(e)
            }
            //cb(null, file.fieldname + '-' + Date.now())
        }
    })
})

module.exports = function (router) {
    router.post('/vendor', upload.single('image'), vendor.createVendor);
    router.get('/vendors', vendor.getVendors);
    router.get('/vendor/:vendorId', vendor.getVendorById);
    router.delete('/vendor/:vendorId', validator.params(querySchemaUpdateOrDeletevendor), vendor.removeVendor);
    router.put('/vendor/:vendorId', upload.single('image'), vendor.updateVendor);
    router.get('/vendor/:exportType/export-document', [auth.verifyToken, auth.isSuperAdmin], validator.params(querySchemaExport), vendor.exportDocument);
    router.patch('/vendor/:vendorId/publish-status', [auth.verifyToken, auth.isSuperAdmin], vendor.updatePublish)
}