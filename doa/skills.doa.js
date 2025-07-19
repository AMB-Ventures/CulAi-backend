var mongoose = require('mongoose');
var skillSchema = require('../schemas/skills.schema');

skillSchema.statics = {
    create: async function (data) {
        var skill = new this(data);
        let result = await skill.save();
        return result;
    },
    get: async function (query) {
        let result = await this.find(query, { skillId: 1, tag: 1, _id: 0, skills: 1, updatedBy: 1, createdAt: 1, updatedAt: 1 });
        return result;
    },
    getOne: async function (query) {
        let result = await this.findOne(query, { skillId: 1, tag: 1, _id: 0, skills: 1, updatedBy: 1, createdAt: 1, updatedAt: 1 });
        return result;
    },
    getById: async function (query) {
        let result = await this.findOne(query, { skillId: 1, tag: 1, _id: 0, skills: 1, updatedBy: 1, createdAt: 1, updatedAt: 1 });
        return result;
    },
    update: async function (query, updateData) {
        let result = await this.findOneAndUpdate(query, { $set: updateData }, { new: true });
        return result;
    },
    delete: async function (query) {
        let result = await this.findOneAndDelete(query);
        return result;
    },
    // countkpis: async function(query) {
    //     let result = await this.countDocuments((count) => count);
    //     return result;
    // }
}
var skillModel = mongoose.model('skill', skillSchema);
module.exports = skillModel;