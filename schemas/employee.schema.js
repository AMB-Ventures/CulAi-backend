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
        type: String
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
            add: {
                type: Boolean,
                unique: false,
                index: false
            },
            edit: {
                type: Boolean,
                unique: false,
                index: false
            },
            delete: {
                type: Boolean,
                unique: false,
                index: false
            },
            view: {
                type: Boolean,
                unique: false,
                index: false
            }
        },
        menu: {
            add: {
                type: Boolean,
                unique: false,
                index: false
            },
            edit: {
                type: Boolean,
                unique: false,
                index: false
            },
            delete: {
                type: Boolean,
                unique: false,
                index: false
            },
            view: {
                type: Boolean,
                unique: false,
                index: false
            }
        },
        settings: {
            add: {
                type: Boolean,
                unique: false,
                index: false
            },
            edit: {
                type: Boolean,
                unique: false,
                index: false
            },
            delete: {
                type: Boolean,
                unique: false,
                index: false
            },
            view: {
                type: Boolean,
                unique: false,
                index: false
            }
        },
        kpireports: {
            add: {
                type: Boolean,
                unique: false,
                index: false
            },
            edit: {
                type: Boolean,
                unique: false,
                index: false
            },
            delete: {
                type: Boolean,
                unique: false,
                index: false
            },
            view: {
                type: Boolean,
                unique: false,
                index: false
            }
        },
        reports: {
            add: {
                type: Boolean,
                unique: false,
                index: false
            },
            edit: {
                type: Boolean,
                unique: false,
                index: false
            },
            delete: {
                type: Boolean,
                unique: false,
                index: false
            },
            view: {
                type: Boolean,
                unique: false,
                index: false
            }
        }
    }

}, {
    timestamps: true
});
module.exports = employeeSchema;