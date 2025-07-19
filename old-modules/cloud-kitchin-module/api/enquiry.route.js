var enquiry = require('../controller/enquiry');
const Joi = require('joi');
var auth = require('../middlewares/validate-token');
const multer = require('multer');
const validator = require('express-joi-validation').createValidator({});

const querySchemaCreateOrGetAllEnquiry = Joi.object().keys({
    Name: Joi.string().required(),
    designation: Joi.string().required(),
    emailId: Joi.string().required(),
    mobileNumber: Joi.string().required(),
    brandName: Joi.string().required(),
    webSite: Joi.string().required(),
    cr_maroof: Joi.string().required(),
    dishes: Joi.array().items().required(),
    services: Joi.array().items(),
    WayremServices: Joi.array().items(),
    // description: Joi.string(),
    city_branches: Joi.string().required(),
    other: Joi.string().required(),

});
const querySchemaGetEnquiry = Joi.object({
    enquiryId: Joi.number().required()
});

// const querySchemaUpdateOrDeletevendor = Joi.object({
//     vendorId: Joi.number()
// });
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
    router.post('/enquiry', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'doc', maxCount: 1 }]), enquiry.createEnquiry);
    router.get('/enquiry/:enquiryId', validator.params(querySchemaGetEnquiry), enquiry.getEnquiryById);
    router.get('/enquiries', enquiry.getEnquiries);
    router.delete('/enquiry/:enquiryId', enquiry.removeEnquiry);
    // router.put('/vendor/:vendorId', [auth.verifyToken, auth.isSuperAdmin], vendor.updateVendor);
    router.get('/enquiry/:exportType/export-document', validator.params(querySchemaExport), enquiry.exportDocument);
    // router.patch('/vendor/:vendorId/publish-status', [auth.verifyToken, auth.isSuperAdmin], vendor.updatePublish)
    router.patch('/:enquiryId/status', enquiry.changeStatus);
    router.post('/:enquiryId', validator.params(querySchemaGetEnquiry), enquiry.approveOrRejectEnquiry);
    router.get('/onboarding/:enquiryId', enquiry.getOnboardingDataById);
    router.get('/onboarding-data', enquiry.getAllOnboardingData);
}