var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var enquirySchema = new Schema({
    Name: {
        type: String,
        unique: false,
        required: false
    },
    enquiryId: {
        type: Number,
        unique: true,
        index: true,
    },
    emailId: {
        type: String,
        unique: true,
        index: true,
    },
    isNewEnquiry: {
        type: Boolean,
        default: true,
    },
    password: {
        type: String,
        unique: false,
        index: false
    },
    mobileNumber: {
        type: String,
        unique: false,
        index: false,
    },
    brandLogo: {
        type: String,
        unique: false,
        index: false
    },
    uploadFile: {
        type: String,
        unique: false,
        index: false
    },
    status: {
        type: String,
        default: "new",
        lowercase: true,
        unique: false,
        index: false
    },
    rejectionReason: {
        type: String,
        default: "",
        unique: false,
        index: false
    },
    brandName: {
        type: String,
        unique: false,
        index: false
    },
    webSite: {
        type: String,
        unique: false,
        index: false
    },
    cr_maroof: {
        type: String,
        unique: false,
        index: false
    },
    designation: {
        type: String,
        unique: false,
        index: false
    },
    city: {
        type: String,
        unique: false,
        index: false
    },
    dishes: [{
        type: String,
        unique: false,
        index: false
    }],
    assignedTo: {
        type: Number,
        unique: false,
        index: false,
        default: null
    },
    services: [{
        type: String,
        unique: false,
        index: false
    }],
    WayremServices: [{
        type: String,
        unique: false,
        index: false
    }],
    // description: {
    //     type: String,
    //     unique: false,
    //     index: false
    // },
    city_branches: {
        type: String,
        unique: false,
        index: false
    },
    subscription: {
        type: Object
    },
    bankDetailsUpload: {
        type: String,
        unique: false,
        index: false
    },
    // culin_services: [{
    //     type: String,
    //     unique: false,
    //     index: false
    // }]
    other: {
        type: String,
        unique: false,
        index: false
    },
    restaurantType: {
        type: String,
        unique: false,
        index: false
    },
    menuList: {
        type: String,
        unique: false,
        index: false
    },
    menuItemsPhoto: {
        type: String,
        unique: false,
        index: false
    },
    nda: {
        type: String,
        unique: false,
        index: false
    },
    contract: {
        type: String,
        unique: false,
        index: false
    },
    vat: {
        type: String,
        unique: false,
        index: false
    },
    managementContactNo: {
        type: String,
        unique: false,
        index: false
    },
    managementEmail: {
        type: String,
        unique: false,
        index: false
    },
    managementContactNoMarketing: {
        type: String,
        unique: false,
        index: false
    },
    managementEmailMarketing: {
        type: String,
        unique: false,
        index: false
    },
    onboardingRejection: {
        type: String,
        unique: false,
        index: false
    },
    userStatus: [{
        enquiryStatus: [{
            approved: {
                type: Boolean,
                default: false
            },
            submitted: {
                type: Boolean,
                default: false
            },
            correction: {
                type: Boolean,
                default: false
            }
        }],
        onboardingStatus: [{
            approved: {
                type: Boolean,
                default: false
            },
            submitted: {
                type: Boolean,
                default: false
            },
            correction: {
                type: Boolean,
                default: false
            }
        }],
        cloudKitchenStatus: [{
            approved: {
                type: Boolean,
                default: false
            },
            submitted: {
                type: Boolean,
                default: false
            },
            correction: {
                type: Boolean,
                default: false
            }
        }]
    }],
    branchTime: {
        branchTimeSlotStart: {
            type: String,
            unique: false,
            index: false
        },
        branchTimeSlotEnd: {
            type: String,
            unique: false,
            index: false
        }
    }
}, {
    timestamps: true
});

module.exports = enquirySchema;