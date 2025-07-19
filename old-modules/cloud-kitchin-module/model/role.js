var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var roleSchema = new Schema({
    role: {
        type: String,
        unique: false,
        index: false
    },
    kitchenId: {
        type: Number,
        unquie: true,
        required: true,
        index: true
    },
    status: {
        type: Boolean,
        unique: false,
        index: false
    },
    description: {
        type: String
    },
    accessControl:
        [{
            title: {
                type: String,
                required: true
            },
            add: {
                type: Boolean,
                unique: false,
                index: false,
                default: false
            },
            edit: {
                type: Boolean,
                unique: false,
                index: false,
                default: false
            },
            delete: {
                type: Boolean,
                unique: false,
                index: false,
                default: false
            },
            view: {
                type: Boolean,
                unique: false,
                index: false,
                default: false
            }
        }]
    // },
    // menu: {
    //     add: {
    //         type: Boolean,
    //         unique: false,
    //         index: false,
    //         default: false
    //     },
    //     edit: {
    //         type: Boolean,
    //         unique: false,
    //         index: false,
    //         default: false
    //     },
    //     delete: {
    //         type: Boolean,
    //         unique: false,
    //         index: false,
    //         default: false
    //     },
    //     view: {
    //         type: Boolean,
    //         unique: false,
    //         index: false,
    //         default: false
    //     }
    // },
    // settings: {
    //     add: {
    //         type: Boolean,
    //         unique: false,
    //         index: false,
    //         default: false
    //     },
    //     edit: {
    //         type: Boolean,
    //         unique: false,
    //         index: false,
    //         default: false
    //     },
    //     delete: {
    //         type: Boolean,
    //         unique: false,
    //         index: false,
    //         default: false
    //     },
    //     view: {
    //         type: Boolean,
    //         unique: false,
    //         index: false,
    //         default: false
    //     }
    // },
    // kpireports: {
    //     add: {
    //         type: Boolean,
    //         unique: false,
    //         index: false,
    //         default: false
    //     },
    //     edit: {
    //         type: Boolean,
    //         unique: false,
    //         index: false,
    //         default: false
    //     },
    //     delete: {
    //         type: Boolean,
    //         unique: false,
    //         index: false,
    //         default: false
    //     },
    //     view: {
    //         type: Boolean,
    //         unique: false,
    //         index: false,
    //         default: false
    //     }
    // },
    // reports: {
    //     add: {
    //         type: Boolean,
    //         unique: false,
    //         index: false,
    //         default: false
    //     },
    //     edit: {
    //         type: Boolean,
    //         unique: false,
    //         index: false,
    //         default: false
    //     },
    //     delete: {
    //         type: Boolean,
    //         unique: false,
    //         index: false,
    //         default: false
    //     },
    //     view: {
    //         type: Boolean,
    //         unique: false,
    //         index: false,
    //         default: false
    //     }
    // },
    // dashboard: {
    //     view: {
    //         type: Boolean,
    //         unique: false,
    //         index: false,
    //         default: false
    //     }
    // },
    // subscription: {
    //     view: {
    //         type: Boolean,
    //         unique: false,
    //         index: false,
    //         default: false
    //     }
    // }
    // }
}, { timestamps: true });

module.exports = roleSchema;