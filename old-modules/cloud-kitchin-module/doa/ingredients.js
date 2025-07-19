var mongoose = require('mongoose');
var IngredientsSchema = require('../model/ingredients');
IngredientsSchema.statics = {
    create: async function (data) {
        var ingredients = new this(data);
        let result = await ingredients.save();
        return result;
    },
    get: async function (query) {
        let result = await this.find(query, {
            "ingredients": 1,
        });
        return result;
    }
}
var MenuModel = mongoose.model('ingredient', IngredientsSchema);
module.exports = MenuModel;