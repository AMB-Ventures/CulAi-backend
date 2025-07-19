var mongoose = require("mongoose");
var Schema = mongoose.Schema;

let accessControlSchema = new Schema({
    Registration: {
        all: { type: Boolean, required: true, default: false },
        add: { type: Boolean, required: true, default: false },
        edit: { type: Boolean, required: true, default: false },
        delete: { type: Boolean, required: true, default: false },
        view: { type: Boolean, required: true, default: false }
    },
    CloudKitchens: {
        all: { type: Boolean, required: true, default: false },
        add: { type: Boolean, required: true, default: false },
        edit: { type: Boolean, required: true, default: false },
        delete: { type: Boolean, required: true, default: false },
        view: { type: Boolean, required: true, default: false }
    },
    Vendor: {
        all: { type: Boolean, required: true, default: false },
        add: { type: Boolean, required: true, default: false },
        edit: { type: Boolean, required: true, default: false },
        delete: { type: Boolean, required: true, default: false },
        view: { type: Boolean, required: true, default: false }
    },
    CuisineType: {
        all: { type: Boolean, required: true, default: false },
        add: { type: Boolean, required: true, default: false },
        edit: { type: Boolean, required: true, default: false },
        delete: { type: Boolean, required: true, default: false },
        view: { type: Boolean, required: true, default: false }
    },
    SubCuisineType: {
        all: { type: Boolean, required: true, default: false },
        add: { type: Boolean, required: true, default: false },
        edit: { type: Boolean, required: true, default: false },
        delete: { type: Boolean, required: true, default: false },
        view: { type: Boolean, required: true, default: false }
    },
    Settings: {
        all: { type: Boolean, required: true, default: false },
        add: { type: Boolean, required: true, default: false },
        edit: { type: Boolean, required: true, default: false },
        delete: { type: Boolean, required: true, default: false },
        view: { type: Boolean, required: true, default: false }
    },
    Features: {
        all: { type: Boolean, required: true, default: false },
        add: { type: Boolean, required: true, default: false },
        edit: { type: Boolean, required: true, default: false },
        delete: { type: Boolean, required: true, default: false },
        view: { type: Boolean, required: true, default: false }
    },
    Subscription: {
        all: { type: Boolean, required: true, default: false },
        add: { type: Boolean, required: true, default: false },
        edit: { type: Boolean, required: true, default: false },
        delete: { type: Boolean, required: true, default: false },
        view: { type: Boolean, required: true, default: false }
    },
    Onboarding: {
        all: { type: Boolean, required: true, default: false },
        add: { type: Boolean, required: true, default: false },
        edit: { type: Boolean, required: true, default: false },
        delete: { type: Boolean, required: true, default: false },
        view: { type: Boolean, required: true, default: false }
    },
    Newsletter: {
        all: { type: Boolean, required: true, default: false },
        add: { type: Boolean, required: true, default: false },
        edit: { type: Boolean, required: true, default: false },
        delete: { type: Boolean, required: true, default: false },
        view: { type: Boolean, required: true, default: false }
    }
})

var SubadminSchema = new Schema({
    userId: {
        type: Number,
        unique: true,
        index: true
    },
    firstName: {
        type: String,
        unique: false,
        index: false
    },
    lastName: {
        type: String,
        unique: false,
        index: false
    },
    status: {
        type: String,
        unique: false,
        index: false
    },
    password: {
        type: String,
        unique: false,
        index: false
    },
    role: {
        type: String,
        unique: false,
        index: false
    },
    emailId: {
        type: String,
        unique: false,
        index: false
    },
    cloudKitchens: {
        type: Array,
        unique: false,
        index: false
    },
    accessControl: {
        type: accessControlSchema,
        required: true,
        default: {
            Registration: { all: false, add: false, edit: false, delete: false, view: false },
            CloudKitchens: { all: false, add: false, edit: false, delete: false, view: false },
            Vendor: { all: false, add: false, edit: false, delete: false, view: false },
            CuisineType: { all: false, add: false, edit: false, delete: false, view: false },
            SubCuisineType: { all: false, add: false, edit: false, delete: false, view: false },
            Settings: { all: false, add: false, edit: false, delete: false, view: false },
            Features: { all: false, add: false, edit: false, delete: false, view: false },
            Subscription: { all: false, add: false, edit: false, delete: false, view: false },
            Onboarding: { all: false, add: false, edit: false, delete: false, view: false },
            Newsletter: { all: false, add: false, edit: false, delete: false, view: false }
        }
    }
});
module.exports = SubadminSchema;