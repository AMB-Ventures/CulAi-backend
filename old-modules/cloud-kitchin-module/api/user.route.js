var userporfile = require('../controller/user');
var auth = require('../middlewares/validate-token');
const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});
const multer = require('multer');

const querySchemaCreateOrGetAlluserProfile = Joi.object().keys({
    name: Joi.string().required(),
    emailId: Joi.string().required(),
    details: Joi.string().required()
});

const querySchemaUpdateOrDeleteuserProfile = Joi.object({
    userId: Joi.string().required(),
});

const querySchemaExport = Joi.object({
    exportType: Joi.string().required(),
    userId: Joi.number().required(),
    kitchenId: Joi.number().required()
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
        }
    })
})

module.exports = function (router) {
    router.get('/:kitchenId/user/:userId', userporfile.getUserById);
    router.put('/:kitchenId/user/:userId', upload.single('profilePic'), userporfile.updateUser);
    router.patch('/:kitchenId/user/:userId/updatepassword', userporfile.updatePassword);
    router.get('/:kitchenId/user/:userId/:exportType/export-document', [auth.verifyToken, auth.isKitchenAdmin], validator.params(querySchemaExport), userporfile.exportDocument);
    router.patch('/:kitchenId/user/:userId/resetepassword', userporfile.resetPassword);
    router.post('/forgetpassword', userporfile.forgetPassword);

}