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
    role: {
        type: String,
        unique: false,
        index: false
    },
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
        menuItem: {
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
    schedule: {
        sunday: {
            morningTimeSlotStart: {
                type: String,
                unique: false,
                index: false
            },
            afterNoonTimeSlotStart: {
                type: String,
                unique: false,
                index: false
            },
            eveningTimeSlotStart: {
                type: String,
                unique: false,
                index: false
            },
            nightTimeSlotStart: {
                type: String,
                unique: false,
                index: false
            },
            morningTimeSlotEnd: {
                type: String,
                unique: false,
                index: false
            },
            afterNoonTimeSlotEnd: {
                type: String,
                unique: false,
                index: false
            },
            eveningTimeSlotEnd: {
                type: String,
                unique: false,
                index: false
            },
            nightTimeSlotEnd: {
                type: String,
                unique: false,
                index: false
            },
            morningTimeSlot: {
                type: Boolean,
                unique: false,
                index: false
            },
            afterNoonTimeSlot: {
                type: Boolean,
                unique: false,
                index: false
            },
            eveningTimeSlot: {
                type: Boolean,
                unique: false,
                index: false
            },
            nightTimeSlot: {
                type: Boolean,
                unique: false,
                index: false
            }
        },
        monday: {
            morningTimeSlotStart: {
                type: String,
                unique: false,
                index: false
            },
            afterNoonTimeSlotStart: {
                type: String,
                unique: false,
                index: false
            },
            eveningTimeSlotStart: {
                type: String,
                unique: false,
                index: false
            },
            nightTimeSlotStart: {
                type: String,
                unique: false,
                index: false
            },
            morningTimeSlotEnd: {
                type: String,
                unique: false,
                index: false
            },
            afterNoonTimeSlotEnd: {
                type: String,
                unique: false,
                index: false
            },
            eveningTimeSlotEnd: {
                type: String,
                unique: false,
                index: false
            },
            nightTimeSlotEnd: {
                type: String,
                unique: false,
                index: false
            },
            morningTimeSlot: {
                type: Boolean,
                unique: false,
                index: false
            },
            afterNoonTimeSlot: {
                type: Boolean,
                unique: false,
                index: false
            },
            eveningTimeSlot: {
                type: Boolean,
                unique: false,
                index: false
            },
            nightTimeSlot: {
                type: Boolean,
                unique: false,
                index: false
            }
        },
        tuesday: {
            morningTimeSlotStart: {
                type: String,
                unique: false,
                index: false
            },
            afterNoonTimeSlotStart: {
                type: String,
                unique: false,
                index: false
            },
            eveningTimeSlotStart: {
                type: String,
                unique: false,
                index: false
            },
            nightTimeSlotStart: {
                type: String,
                unique: false,
                index: false
            },
            morningTimeSlotEnd: {
                type: String,
                unique: false,
                index: false
            },
            afterNoonTimeSlotEnd: {
                type: String,
                unique: false,
                index: false
            },
            eveningTimeSlotEnd: {
                type: String,
                unique: false,
                index: false
            },
            nightTimeSlotEnd: {
                type: String,
                unique: false,
                index: false
            },
            morningTimeSlot: {
                type: Boolean,
                unique: false,
                index: false
            },
            afterNoonTimeSlot: {
                type: Boolean,
                unique: false,
                index: false
            },
            eveningTimeSlot: {
                type: Boolean,
                unique: false,
                index: false
            },
            nightTimeSlot: {
                type: Boolean,
                unique: false,
                index: false
            }
        },
        wednesday: {
            morningTimeSlotStart: {
                type: String,
                unique: false,
                index: false
            },
            afterNoonTimeSlotStart: {
                type: String,
                unique: false,
                index: false
            },
            eveningTimeSlotStart: {
                type: String,
                unique: false,
                index: false
            },
            nightTimeSlotStart: {
                type: String,
                unique: false,
                index: false
            },
            morningTimeSlotEnd: {
                type: String,
                unique: false,
                index: false
            },
            afterNoonTimeSlotEnd: {
                type: String,
                unique: false,
                index: false
            },
            eveningTimeSlotEnd: {
                type: String,
                unique: false,
                index: false
            },
            nightTimeSlotEnd: {
                type: String,
                unique: false,
                index: false
            },
            morningTimeSlot: {
                type: Boolean,
                unique: false,
                index: false
            },
            afterNoonTimeSlot: {
                type: Boolean,
                unique: false,
                index: false
            },
            eveningTimeSlot: {
                type: Boolean,
                unique: false,
                index: false
            },
            nightTimeSlot: {
                type: Boolean,
                unique: false,
                index: false
            }
        },
        thursday: {
            morningTimeSlotStart: {
                type: String,
                unique: false,
                index: false
            },
            afterNoonTimeSlotStart: {
                type: String,
                unique: false,
                index: false
            },
            eveningTimeSlotStart: {
                type: String,
                unique: false,
                index: false
            },
            nightTimeSlotStart: {
                type: String,
                unique: false,
                index: false
            },
            morningTimeSlotEnd: {
                type: String,
                unique: false,
                index: false
            },
            afterNoonTimeSlotEnd: {
                type: String,
                unique: false,
                index: false
            },
            eveningTimeSlotEnd: {
                type: String,
                unique: false,
                index: false
            },
            nightTimeSlotEnd: {
                type: String,
                unique: false,
                index: false
            },
            morningTimeSlot: {
                type: Boolean,
                unique: false,
                index: false
            },
            afterNoonTimeSlot: {
                type: Boolean,
                unique: false,
                index: false
            },
            eveningTimeSlot: {
                type: Boolean,
                unique: false,
                index: false
            },
            nightTimeSlot: {
                type: Boolean,
                unique: false,
                index: false
            }
        },
        friday: {
            morningTimeSlotStart: {
                type: String,
                unique: false,
                index: false
            },
            afterNoonTimeSlotStart: {
                type: String,
                unique: false,
                index: false
            },
            eveningTimeSlotStart: {
                type: String,
                unique: false,
                index: false
            },
            nightTimeSlotStart: {
                type: String,
                unique: false,
                index: false
            },
            morningTimeSlotEnd: {
                type: String,
                unique: false,
                index: false
            },
            afterNoonTimeSlotEnd: {
                type: String,
                unique: false,
                index: false
            },
            eveningTimeSlotEnd: {
                type: String,
                unique: false,
                index: false
            },
            nightTimeSlotEnd: {
                type: String,
                unique: false,
                index: false
            },
            morningTimeSlot: {
                type: Boolean,
                unique: false,
                index: false
            },
            afterNoonTimeSlot: {
                type: Boolean,
                unique: false,
                index: false
            },
            eveningTimeSlot: {
                type: Boolean,
                unique: false,
                index: false
            },
            nightTimeSlot: {
                type: Boolean,
                unique: false,
                index: false
            }
        },
        saturday: {
            morningTimeSlotStart: {
                type: String,
                unique: false,
                index: false
            },
            afterNoonTimeSlotStart: {
                type: String,
                unique: false,
                index: false
            },
            eveningTimeSlotStart: {
                type: String,
                unique: false,
                index: false
            },
            nightTimeSlotStart: {
                type: String,
                unique: false,
                index: false
            },
            morningTimeSlotEnd: {
                type: String,
                unique: false,
                index: false
            },
            afterNoonTimeSlotEnd: {
                type: String,
                unique: false,
                index: false
            },
            eveningTimeSlotEnd: {
                type: String,
                unique: false,
                index: false
            },
            nightTimeSlotEnd: {
                type: String,
                unique: false,
                index: false
            },
            morningTimeSlot: {
                type: Boolean,
                unique: false,
                index: false
            },
            afterNoonTimeSlot: {
                type: Boolean,
                unique: false,
                index: false
            },
            eveningTimeSlot: {
                type: Boolean,
                unique: false,
                index: false
            },
            nightTimeSlot: {
                type: Boolean,
                unique: false,
                index: false
            }
        }
    },
    // password:{
    //     type: String,
    //     unique: false,
    //     index: false
    // },
    accessControl:
    {
        order: {
            type: Boolean,
            unique: false,
            index: false
        },
        menu: {
            type: Boolean,
            unique: false,
            index: false
        },
        settings: {
            type: Boolean,
            unique: false,
            index: false
        }
    }

}, {
    timestamps: true
});
module.exports = employeeSchema;