/*
The code defines the schema for employee object.
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var employeeSchema = new Schema({
    employeeId: {
        type: Number,
        unquie: true,
        required: true,
        index: true
    },
    kitchenId: {
        type: Number,
        unquie: true,
        required: true,
        index: true
    },
    adminId: {
        type: Number,
        unquie: true,
        required: true,
        index: true
    },
    Name: {
        type: String,
        unique: false,
        index: false
    },

    emailId: {
        type: String,
        unique: false,
        index: false
    },
    mobileNumber: {
        type: String,
        unique: false,
        index: false
    },
    role: [{
        type: String,
    }],
    employeeConfig: [{
        vendorName: {
            type: String,
            unique: false,
            index: false
        },
        menuCategory: {
            type: String,
            unique: false,
            index: false
        },
        menuSubCategory: {
            type: String,
            unique: false,
            index: false
        },
        menuItemSkillsRating: [{
            menuId: {
                type: String,
                unique: false,
                index: false
            },
            menuName: {
                type: String,
                unique: false,
                index: false
            },
            skillRating: {
                type: String,
                unique: false,
                index: false
            },
            isSelected: {
                type: Boolean,
                unique: false,
                index: false
            }
        }]
    }],
    schedule: {
        all: [{
            type: mongoose.Schema.Types.ObjectId,
            default: null,
            ref: 'shifts'
        }],
        sunday: [{
            type: mongoose.Schema.Types.ObjectId,
            default: null,
            ref: 'shifts'
        }],
        monday: [{
            type: mongoose.Schema.Types.ObjectId,
            default: null,
            ref: 'shifts'
        }],
        tuesday: [{
            type: mongoose.Schema.Types.ObjectId,
            default: null,
            ref: 'shifts'
        }],
        wednesday: [{
            type: mongoose.Schema.Types.ObjectId,
            default: null,
            ref: 'shifts'
        }],
        thursday: [{
            type: mongoose.Schema.Types.ObjectId,
            default: null,
            ref: 'shifts'
        }],
        friday: [{
            type: mongoose.Schema.Types.ObjectId,
            default: null,
            ref: 'shifts'
        }],
        saturday: [{
            type: mongoose.Schema.Types.ObjectId,
            default: null,
            ref: 'shifts'
        }],
    },
    // password:{
    //     type: String,
    //     unique: false,
    //     index: false
    // },
    roleAccessControl: { type: Schema.Types.ObjectId, ref: 'roles' }
}, {
    timestamps: true
});
module.exports = employeeSchema;