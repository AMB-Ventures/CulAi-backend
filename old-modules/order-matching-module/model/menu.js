const { number } = require("joi");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MenuSchema = new Schema({
    kitchenId: {
        type: Number,
        unique: false,
        required: false
    },
    userId: {
        type: Number,
        unique: false,
        index: false
    },
    menuId: {
        type: Number,
        unique: true,
        index: true,
    },
    menuName: {
        type: String,
        unique: false,
        index: false
    },
    category: {
        type: String,
        unique: false,
        index: false
    },
    subcategory: {
        type: String,
        unique: false,
        index: false
    },
    description: {
        type: String,
        unique: false,
        index: false
    },
    uploadVideo: {
        type: String,
        unique: false,
        index: false
    },
    uploadImage: {
        type: String,
        unique: false,
        index: false
    },
    preparationTime: {
        type: Number,
        unique: false,
        index: false
    },
    ingredients: {
        type: String,
        unique: false,
        index: false
    },
    chefConfig: [{
        chef: {
            type: String,
            unique: false,
            index: false
        },
        skillsRating: {
            type: Number,
            unique: false,
            index: false
        }
    }],
    vendorConfig: [{
        vendorId: {
            type: String,
            unique: false,
            index: false
        },
        vendorMenuId: {
            type: String,
            unique: false,
            index: false
        }
    }],
    available: {
        type: String,
        unique: false,
        index: false
    }
}, {
    timestamps: true
});

module.exports = MenuSchema;