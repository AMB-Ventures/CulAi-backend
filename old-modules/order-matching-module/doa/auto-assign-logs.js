var mongoose = require('mongoose');
var autoassignLogSchema = require('../model/auto-assign-log');
autoassignLogSchema.statics = {
    create: async function (data) {
        var autoassignLog = new this(data);
        let result = await autoassignLog.save();
        return result;
    }
}

var autoassignLogModel = mongoose.model('autoassign_log', autoassignLogSchema);
module.exports = autoassignLogModel;