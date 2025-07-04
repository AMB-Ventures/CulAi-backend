/*
The code defines the schema for employee object.
*/
const { bold } = require('chalk');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var kitchenconfigSchema = new Schema({
    kitchenId: {
        type: Number,
        unquie: true,
        required: true,
        index: true
    },
    userId: {
        type: Number,
        unquie: true,
        required: true,
        index: true
    },
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
    thresholdLimit: [{
        role: {
            type: String,
            unique: false,
            index: false
        },
        incoming: {
            type: Number,
            unique: false,
            index: false
        },
        inPreparation: {
            type: Number,
            unique: false,
            index: false
        },
        completed: {
            type: Number,
            unique: false,
            index: false
        },
        all: {
            type: Number,
            unique: false,
            index: false
        }
    }],
    alerts: {
        // autoAssign: {
        //     type: Boolean,
        //     unique: false,
        //     index: false
        // },
        changeColorToRed: {
            type: Boolean,
            unique: false,
            index: false
        },
        blinkColumn: {
            type: Boolean,
            unique: false,
            index: false
        },
        generateNotification: {
            type: Boolean,
            unique: false,
            index: false
        },
        playAlertSound: {
            type: Boolean,
            unique: false,
            index: false
        }
    }
}, {
    timestamps: true
});
module.exports = kitchenconfigSchema;