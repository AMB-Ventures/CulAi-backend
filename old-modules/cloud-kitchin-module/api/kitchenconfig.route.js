var kitchenconfig = require('../controller/kitchenconfig');
var auth = require('../middlewares/validate-token')
const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});

const querySchemaCreateOrGetAllkitchenconfig = Joi.object().keys({
    schedule: {
        sunday: {
            morningTimeSlotStart: Joi.string().required(),
            afterNoonTimeSlotStart: Joi.string().required(),
            eveningTimeSlotStart: Joi.string().required(),
            nightTimeSlotStart: Joi.string().required(),
            morningTimeSlotEnd: Joi.string().required(),
            afterNoonTimeSlotEnd: Joi.string().required(),
            eveningTimeSlotEnd: Joi.string().required(),
            nightTimeSlotEnd: Joi.string().required(),
            morningTimeSlot: Joi.boolean().required(),
            afterNoonTimeSlot: Joi.boolean().required(),
            eveningTimeSlot: Joi.boolean().required(),
            nightTimeSlot: Joi.boolean().required()
        },
        monday: {
            morningTimeSlotStart: Joi.string().required(),
            afterNoonTimeSlotStart: Joi.string().required(),
            eveningTimeSlotStart: Joi.string().required(),
            nightTimeSlotStart: Joi.string().required(),
            morningTimeSlotEnd: Joi.string().required(),
            afterNoonTimeSlotEnd: Joi.string().required(),
            eveningTimeSlotEnd: Joi.string().required(),
            nightTimeSlotEnd: Joi.string().required(),
            morningTimeSlot: Joi.boolean().required(),
            afterNoonTimeSlot: Joi.boolean().required(),
            eveningTimeSlot: Joi.boolean().required(),
            nightTimeSlot: Joi.boolean().required()
        },
        tuesday: {
            morningTimeSlotStart: Joi.string().required(),
            afterNoonTimeSlotStart: Joi.string().required(),
            eveningTimeSlotStart: Joi.string().required(),
            nightTimeSlotStart: Joi.string().required(),
            morningTimeSlotEnd: Joi.string().required(),
            afterNoonTimeSlotEnd: Joi.string().required(),
            eveningTimeSlotEnd: Joi.string().required(),
            nightTimeSlotEnd: Joi.string().required(),
            morningTimeSlot: Joi.boolean().required(),
            afterNoonTimeSlot: Joi.boolean().required(),
            eveningTimeSlot: Joi.boolean().required(),
            nightTimeSlot: Joi.boolean().required(),
        },
        wednesday: {
            morningTimeSlotStart: Joi.string().required(),
            afterNoonTimeSlotStart: Joi.string().required(),
            eveningTimeSlotStart: Joi.string().required(),
            nightTimeSlotStart: Joi.string().required(),
            morningTimeSlotEnd: Joi.string().required(),
            afterNoonTimeSlotEnd: Joi.string().required(),
            eveningTimeSlotEnd: Joi.string().required(),
            nightTimeSlotEnd: Joi.string().required(),
            morningTimeSlot: Joi.boolean().required(),
            afterNoonTimeSlot: Joi.boolean().required(),
            eveningTimeSlot: Joi.boolean().required(),
            nightTimeSlot: Joi.boolean().required(),
        },
        thursday: {
            morningTimeSlotStart: Joi.string().required(),
            afterNoonTimeSlotStart: Joi.string().required(),
            eveningTimeSlotStart: Joi.string().required(),
            nightTimeSlotStart: Joi.string().required(),
            morningTimeSlotEnd: Joi.string().required(),
            afterNoonTimeSlotEnd: Joi.string().required(),
            eveningTimeSlotEnd: Joi.string().required(),
            nightTimeSlotEnd: Joi.string().required(),
            morningTimeSlot: Joi.boolean().required(),
            afterNoonTimeSlot: Joi.boolean().required(),
            eveningTimeSlot: Joi.boolean().required(),
            nightTimeSlot: Joi.boolean().required()
        },
        friday: {
            morningTimeSlotStart: Joi.string().required(),
            afterNoonTimeSlotStart: Joi.string().required(),
            eveningTimeSlotStart: Joi.string().required(),
            nightTimeSlotStart: Joi.string().required(),
            morningTimeSlotEnd: Joi.string().required(),
            afterNoonTimeSlotEnd: Joi.string().required(),
            eveningTimeSlotEnd: Joi.string().required(),
            nightTimeSlotEnd: Joi.string().required(),
            morningTimeSlot: Joi.boolean().required(),
            afterNoonTimeSlot: Joi.boolean().required(),
            eveningTimeSlot: Joi.boolean().required(),
            nightTimeSlot: Joi.boolean().required()
        },
        saturday: {
            morningTimeSlotStart: Joi.string().required(),
            afterNoonTimeSlotStart: Joi.string().required(),
            eveningTimeSlotStart: Joi.string().required(),
            nightTimeSlotStart: Joi.string().required(),
            morningTimeSlotEnd: Joi.string().required(),
            afterNoonTimeSlotEnd: Joi.string().required(),
            eveningTimeSlotEnd: Joi.string().required(),
            nightTimeSlotEnd: Joi.string().required(),
            morningTimeSlot: Joi.boolean().required(),
            afterNoonTimeSlot: Joi.boolean().required(),
            eveningTimeSlot: Joi.boolean().required(),
            nightTimeSlot: Joi.boolean().required()
        }
    },
    thresholdLimit: Joi.array().items({
        role: Joi.string().required(),
        incoming: Joi.number().required(),
        inPreparation: Joi.number().required(),
        completed: Joi.number().required(),
        all: Joi.number().required(),
    }),
    alerts: {
        Admin: Joi.required(),
        Chef: Joi.required(),
        Qa: Joi.required(),
        Receptionist: Joi.required()
    }
});
const querySchemaGetkitchenconfig = Joi.object({
    // userId: Joi.number().required(),
    kitchenId: Joi.number().required(),
});
const querySchemaExport = Joi.object({
    exportType: Joi.string().required(),
    userId: Joi.number().required(),
    kitchenId: Joi.number().required()
});

module.exports = function (router) {
    router.post('/:kitchenId/user/:userId/config', validator.body(querySchemaCreateOrGetAllkitchenconfig), kitchenconfig.createkitchenConfig);
    router.get('/:kitchenId/user/:userId/configs', [auth.verifyToken, auth.isAdminReceptionist], kitchenconfig.getkitchenConfigs);
    router.get('/:kitchenId/config', kitchenconfig.getkitchenConfigById);
    router.delete('/:kitchenId/user/:userId/config', [auth.verifyToken, auth.isKitchenAdmin], validator.params(querySchemaGetkitchenconfig), kitchenconfig.removekitchenConfig);
    router.put('/:kitchenId/user/:userId/config', [auth.verifyToken, auth.isKitchenAdmin], kitchenconfig.updatekitchenConfig);
    router.get('/:kitchenId/user/:userId/config/:exportType/export-document', [auth.verifyToken, auth.isKitchenAdmin], validator.params(querySchemaExport), kitchenconfig.exportDocument);
    router.get('/:kitchenId/alerts', kitchenconfig.getConfigByRole);
}