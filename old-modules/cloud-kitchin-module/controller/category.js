const e = require('express');
var category = require('../doa/category');
var log = require('../logger');
var exportDoc = require('./export-documents');
var fs = require('fs');


var datetime = new Date();

exports.createCategory = async (req, res, next) => {
    try {
        if (req.body !== undefined && req.body !== null) {
            let data = await category.getOne({ categoryName: req.body.categoryName });
            if (data) {
                res.status(500).json({ error: "category is already exist." });
            } else {
                var Id = await getNextSequence();
                var categoryObject = {
                    categoryName: req.body.categoryName,
                    categoryId: parseInt(Id) + 1,
                    description: req.body.description,
                    publish: true,
                };
                let result = await category.create(categoryObject);
                if (result) {
                    res.status(200).json({ message: "category created successfully" });
                } else {
                    res.status(500).json({ error: "can't create category" });
                }
            }
        } else {
            res.status(400).json({ error: "required request body" });
        }
    } catch (e) {
        console.error(e)
    }
}

function getNextSequence() {
    return new Promise(resolve => {
        return category.findOne().sort([
            ['categoryId', 'descending']
        ]).limit(1).exec((err, data) => {
            if (data != null) {
                if (data.categoryId != undefined) {
                    return resolve(data.categoryId)
                } else {
                    return resolve(0)
                }
            } else return resolve(0)
        })
    })
}

//get all category
exports.getCategories = async (req, res, next) => {
    let result = await category.get();
    if (result) {
        res.status(200).json({ items: result });
    } else {
        res.status(500).json({ error: "data not found" });
    }
}

// category getby categoryId etails 
exports.getCategoryById = async (req, res, next) => {
    if (req.params.categoryId != null && req.params.categoryId != undefined) {
        var categoryId = req.params.categoryId;
    } else {
        res.json({ "error": "request parameters required" });
    }
    let result = await category.getById({ categoryId: categoryId });
    if (result) {
        res.status(200).json({ category: result });
    } else {
        res.status(500).json({ error: "Id not found" });
    }
}

// update category detail
exports.updateCategory = async (req, res, next) => {
    if (req.params != null && req.params != undefined) {
        var categoryId = req.params.categoryId;
    } else {
        res.status(400).json({ error: "request parameters required" });
    }
    let categoryData = await category.getOne({ categoryId: categoryId });
    if (categoryData) {
        if (req.body !== null && req.body !== undefined) {
            var newCategory = {
                categoryName: req.body.categoryName,
                description: req.body.description
            }
            let result = await category.update({ "categoryId": categoryId }, newCategory);
            if (result) {
                res.status(200).json({ message: "category updated successfully" });
            } else {
                res.status(500).json({ error: "can't update category" });
            }
        } else {
            res.status(400).json({ error: "request body required" });
        }
    } else {
        res.status(400).json({ error: "category data not found" });
    }
}


//remove category
exports.removeCategory = async function (req, res) {
    if (req.params.categoryId != null && req.params.categoryId != undefined) {
        var categoryId = req.params.categoryId;
    } else {
        res.status(500).json({ error: "request parameters required" });
    }
    let categoryData = await category.getOne({ categoryId: categoryId });
    if (categoryData) {
        let result = await category.delete({ categoryId: categoryId });
        if (result) {
            res.status(200).json({ message: "category deleted successfully" });
        } else {
            res.status(500).json({ error: "can't delete category" });
        }
    } else {
        res.status(400).json({ error: "categar with this categoryId does not exist!" });
    }
}

exports.exportDocument = async (req, res, next) => {
    if (req.params != null && req.params != undefined) {
        var exportType = JSON.parse(req.params.exportType);
    } else {
        res.status(400).json({ error: "request parameters required" });
    }
    try {
        let result = await category.get();
        var filePath;
        const fileName = "category";
        const fields = ['categoryName', 'description', 'status', "publish"];

        if (exportType === "csv") {
            filePath = await exportDoc.getCSV(result, fields, fileName);
            res.download(filePath, function (err) {
                if (err) {
                    console.log(err);
                }
                fs.unlink(filePath, function () {
                    console.log("File was deleted")
                });
            });
            return "successfully downloaded";
        } else if (exportType === "xlsx") {
            filePath = await exportDoc.getXLSX(result, fields, fileName);
            res.download(filePath, function (err) {
                if (err) {
                    console.log(err);
                }
                fs.unlink(filePath, function () {
                    console.log("File was deleted")
                });
            });
            return "successfully downloaded";
        } else if (exportType === "pdf") {
            filePath = await exportDoc.getPdf(result, fileName, 'category');
            res.download(filePath, function (err) {
                if (err) {
                    console.log(err);
                }
                fs.unlink(filePath, function () {
                    console.log("File was deleted")
                });
            });
            return "successfully downloaded";
        } else {
            console.log("Unsupported File Type")
        }
    } catch (err) {
        console.error(err);
    }
}
exports.updatePublish = async (req, res, next) => {
    if (req.params.categoryId != null && req.params.categoryId != undefined) {
        var categoryId = req.params.categoryId;
    } else {
        res.status(400).json({ error: "request parameters required" });
    }
    let categoryData = await category.getOne({ categoryId: categoryId });
    if (categoryData) {
        if (req.body !== null && req.body !== undefined) {
            var updatePublishObject = {};
            updatePublishObject.publish = req.body.publish;
            let result = await category.update({ categoryId: categoryId }, updatePublishObject);
            if (result) {
                res.status(200).json({ message: "category Status Updated successfully" });
            } else {
                res.status(500).json({ error: "can't update status" });
            }
        } else {
            res.status(400).json({ "error": "request body required" });
        }
    } else {
        res.status(400).json({ error: "category data not found" })
    }
}