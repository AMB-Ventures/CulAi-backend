var employee = require('../controller/employee');
var auth = require('../middlewares/validate-token')
const Joi = require('joi');
const employeeModel = require('../doa/employee');
const validator = require('express-joi-validation').createValidator({});

const querySchemaCreateOrGetAllEmployees = Joi.object().keys({
    Name: Joi.string().required(),
    emailId: Joi.string().required(),
    mobileNumber: Joi.string().required(),
    role: Joi.array().items(Joi.string()).required(),
    employeeConfig: Joi.array().items({
        vendorName: Joi.string(),
        menuCategory: Joi.string(),
        menuSubCategory: Joi.string(),
        menuItemSkillsRating: Joi.array().items({
            menuId: Joi.string(),
            menuName: Joi.string(),
            skillRating: Joi.string(),
            isSelected: Joi.boolean()
        })
    }),
    schedule: {
        sunday: {
            morningTimeSlotStart: Joi.string(),
            afterNoonTimeSlotStart: Joi.string(),
            eveningTimeSlotStart: Joi.string(),
            nightTimeSlotStart: Joi.string(),
            morningTimeSlotEnd: Joi.string(),
            afterNoonTimeSlotEnd: Joi.string(),
            eveningTimeSlotEnd: Joi.string(),
            nightTimeSlotEnd: Joi.string(),
            morningTimeSlot: Joi.boolean(),
            afterNoonTimeSlot: Joi.boolean(),
            eveningTimeSlot: Joi.boolean(),
            nightTimeSlot: Joi.boolean()
        },
        monday: {
            morningTimeSlotStart: Joi.string(),
            afterNoonTimeSlotStart: Joi.string(),
            eveningTimeSlotStart: Joi.string(),
            nightTimeSlotStart: Joi.string(),
            morningTimeSlotEnd: Joi.string(),
            afterNoonTimeSlotEnd: Joi.string(),
            eveningTimeSlotEnd: Joi.string(),
            nightTimeSlotEnd: Joi.string(),
            morningTimeSlot: Joi.boolean(),
            afterNoonTimeSlot: Joi.boolean(),
            eveningTimeSlot: Joi.boolean(),
            nightTimeSlot: Joi.boolean()
        },
        tuesday: {
            morningTimeSlotStart: Joi.string(),
            afterNoonTimeSlotStart: Joi.string(),
            eveningTimeSlotStart: Joi.string(),
            nightTimeSlotStart: Joi.string(),
            morningTimeSlotEnd: Joi.string(),
            afterNoonTimeSlotEnd: Joi.string(),
            eveningTimeSlotEnd: Joi.string(),
            nightTimeSlotEnd: Joi.string(),
            morningTimeSlot: Joi.boolean(),
            afterNoonTimeSlot: Joi.boolean(),
            eveningTimeSlot: Joi.boolean(),
            nightTimeSlot: Joi.boolean(),
        },
        wednesday: {
            morningTimeSlotStart: Joi.string(),
            afterNoonTimeSlotStart: Joi.string(),
            eveningTimeSlotStart: Joi.string(),
            nightTimeSlotStart: Joi.string(),
            morningTimeSlotEnd: Joi.string(),
            afterNoonTimeSlotEnd: Joi.string(),
            eveningTimeSlotEnd: Joi.string(),
            nightTimeSlotEnd: Joi.string(),
            morningTimeSlot: Joi.boolean(),
            afterNoonTimeSlot: Joi.boolean(),
            eveningTimeSlot: Joi.boolean(),
            nightTimeSlot: Joi.boolean(),
        },
        thursday: {
            morningTimeSlotStart: Joi.string(),
            afterNoonTimeSlotStart: Joi.string(),
            eveningTimeSlotStart: Joi.string(),
            nightTimeSlotStart: Joi.string(),
            morningTimeSlotEnd: Joi.string(),
            afterNoonTimeSlotEnd: Joi.string(),
            eveningTimeSlotEnd: Joi.string(),
            nightTimeSlotEnd: Joi.string(),
            morningTimeSlot: Joi.boolean(),
            afterNoonTimeSlot: Joi.boolean(),
            eveningTimeSlot: Joi.boolean(),
            nightTimeSlot: Joi.boolean()
        },
        friday: {
            morningTimeSlotStart: Joi.string(),
            afterNoonTimeSlotStart: Joi.string(),
            eveningTimeSlotStart: Joi.string(),
            nightTimeSlotStart: Joi.string(),
            morningTimeSlotEnd: Joi.string(),
            afterNoonTimeSlotEnd: Joi.string(),
            eveningTimeSlotEnd: Joi.string(),
            nightTimeSlotEnd: Joi.string(),
            morningTimeSlot: Joi.boolean(),
            afterNoonTimeSlot: Joi.boolean(),
            eveningTimeSlot: Joi.boolean(),
            nightTimeSlot: Joi.boolean()
        },
        saturday: {
            morningTimeSlotStart: Joi.string(),
            afterNoonTimeSlotStart: Joi.string(),
            eveningTimeSlotStart: Joi.string(),
            nightTimeSlotStart: Joi.string(),
            morningTimeSlotEnd: Joi.string(),
            afterNoonTimeSlotEnd: Joi.string(),
            eveningTimeSlotEnd: Joi.string(),
            nightTimeSlotEnd: Joi.string(),
            morningTimeSlot: Joi.boolean(),
            afterNoonTimeSlot: Joi.boolean(),
            eveningTimeSlot: Joi.boolean(),
            nightTimeSlot: Joi.boolean()
        }
    },
    accessControl: {
        order: {
            add: Joi.boolean().required(),
            edit: Joi.boolean().required(),
            delete: Joi.boolean().required(),
            view: Joi.boolean().required(),
        },
        menu: {
            add: Joi.boolean().required(),
            edit: Joi.boolean().required(),
            delete: Joi.boolean().required(),
            view: Joi.boolean().required(),
        },
        settings: {
            add: Joi.boolean().required(),
            edit: Joi.boolean().required(),
            delete: Joi.boolean().required(),
            view: Joi.boolean().required(),
        },
        kpireports: {
            add: Joi.boolean().required(),
            edit: Joi.boolean().required(),
            delete: Joi.boolean().required(),
            view: Joi.boolean().required(),
        },
        reports: {
            add: Joi.boolean().required(),
            edit: Joi.boolean().required(),
            delete: Joi.boolean().required(),
            view: Joi.boolean().required(),
        }
    }
});

const querySchemaGetEmployee = Joi.object({
    employeeId: Joi.number().required(),
    adminId: Joi.number().required(),
    kitchenId: Joi.number().required(),
});
const querySchemaExport = Joi.object({
    exportType: Joi.string().required(),
    adminId: Joi.number().required(),
    kitchenId: Joi.number().required()
});

module.exports = function (router) {
    router.post('/:kitchenId/user/:adminId/employee', employee.createEmployee);
    router.get('/:kitchenId/employees', employee.getEmployees);
    router.get('/:kitchenId/user/:role/employeesbyname', employee.getNameByRole);
    router.get('/:kitchenId/user/:adminId/employee/:employeeId', validator.params(querySchemaGetEmployee), employee.getEmployeeById);
    router.delete('/:emailId/employee/:employeeId/:adminId', employee.removeEmployee);
    router.put('/:kitchenId/user/:adminId/employee/:employeeId', employee.updateEmployee);
    router.patch('/:kitchenId/user/:adminId/employee', employee.updateEmployeeAccessControl);
    router.get('/:kitchenId/user/:adminId/employee/:exportType/export-document', [auth.verifyToken, auth.isKitchenAdmin], validator.params(querySchemaExport), employee.exportDocument);
    router.patch('/:employeeId/updatepassword', employee.updatePassword);
    router.get('/employees/:role/:kitchenId/user/:adminId', employee.getEmployeesByRole);
    router.get('/kitchen/:kitchenId/chef/:chefId', employee.getChefById);
    router.get('/kitchen/:kitchenId/chef', employee.getAllChef);
    router.get('/:kitchenId/employee/:employeeId', employee.getAccessControlList);
    router.get('/:kitchenId/employeeCount', employee.getEmployeeCount);
    router.get('/:kitchenId/schedule', employee.getSchedule);
    router.get('/:kitchenId/user/:adminId/employee/:employeeId/schedule', employee.getScheduleById);
    router.get('/:kitchenId/user/:adminId/roles', employee.getRoles);


    // PUT API
    // http://localhost:3332/v1/cloudkitchen/update-all

    router.put('/update-all', async (req, res) => {
        // var data = req.body;
        var data = {
            schedule: {
                all: null,
                friday: null,
                monday: null,
                saturday: null,
                sunday: null,
                thursday: null,
                tuesday: null,
                wednesday: null
            }
        }
        var result = await employeeModel.updateAll({}, data);
        console.log(result);
        res.json(result)
    })
}