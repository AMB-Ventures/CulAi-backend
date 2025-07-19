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
    categoryId: {type: Number },
    subCategoryId: {type: Number },
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
            type: String,
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
    phases: [],
    available: {
        type: Number,
        unique: false,
        index: false
    },
    sold: {
        type: Number,
        default: 0,
        unique: false,
        index: false
    },
    "price":{type:Array},
    "addOns":{type:Array}
}, {
    timestamps: true
});

module.exports = MenuSchema;