const e = require('express');
var subCategory = require('../doa/subCategory.doa');
var log = require('../logger');
var fs = require('fs');
var exportDoc = require('./export-documents.controller');
var datetime = new Date();

exports.createSubCategory = async function(req, res, next) {
    try {
        if (req.body !== undefined && req.body !== null) {
            let data = await subCategory.getOne({ categoryName: req.body.categoryName, subCategoryName: req.body.subCategoryName });
            if (data) {
                res.status(500).json({ error: "subCategory is already exist." });
            } else {
                var Id = await getNextSequence();
                var subCategoryObject = {
                    categoryName: req.body.categoryName,
                    subCategoryName: req.body.subCategoryName,
                    subCategoryId: parseInt(Id) + 1,
                    description: req.body.description,
                    categoriesId: req.body.categoriesId,
                    publish: true
                };
                let result = await subCategory.create(subCategoryObject);
                if (result) {
                    res.status(200).json({ message: "subCategory created successfully" });
                } else {
                    res.status(500).json({ error: "can't create subCategory" });
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
        return subCategory.findOne().sort([
            ['subCategoryId', 'descending']
        ]).limit(1).exec((err, data) => {
            if (data != null) {
                if (data.subCategoryId != undefined) {
                    return resolve(data.subCategoryId)
                } else {
                    return resolve(0)
                }
            } else return resolve(0)
        })
    })
}
//get all category
exports.getSubCategories = async function(req, res, next) {
    let result = await subCategory.get();
    if (result) {
        res.status(200).json({ "success":"Sub Categories get successfully", data: result });
    } else {
        res.status(500).json({ error: "data not found" });
    }
}
// category getby categoryId etails 
exports.getSubCategoryById = async function(req, res, next) {
    if (req.params.subCategoryId != null && req.params.subCategoryId != undefined) {
        var subCategoryId = req.params.subCategoryId;
    } else {
        res.json({ "error": "request parameters required" });
    }
    let result = await subCategory.getById({ subCategoryId: subCategoryId });
    if (result) {
        res.status(200).json({ subCategory: result });
    } else {
        res.status(500).json({ error: "Id not found" });
    }
}
// update category detail
exports.updateSubCategory = async function(req, res, next) {

    if (req.params != null && req.params != undefined) {
        var subCategoryId = req.params.subCategoryId;
    } else {
        res.status(400).json({ error: "request parameters required" });
    }
    let subCategoryData = await subCategory.getOne({ subCategoryId: subCategoryId });
    if (subCategoryData) {
        if (req.body !== null && req.body !== undefined) {
            console.log("body", req.body)
            var newSubCategory = {
                categoryName: req.body.categoryName,
                subCategoryName: req.body.subCategoryName,
                description: req.body.description,
                categoryId: req.body.categoryId
            }
            log.info("Updating category =====> ");
            let result = await subCategory.update({ "subCategoryId": subCategoryId }, newSubCategory);
            if (result) {
                res.status(200).json({ message: "subCategory updated successfully" });
            } else {
                res.status(500).json({ error: "can't update category" });
            }
        } else {
            res.status(400).json({ error: "request body required" });
        }
    } else {
        res.status(400).json({ error: "subCategory data not found" });
    }
}
//remove category
exports.removeSubCategory = async function(req, res) {
    if (req.params.subCategoryId != null && req.params.subCategoryId != undefined) {
        var subCategoryId = req.params.subCategoryId;
    } else {
        res.status(500).json({ error: "request parameters required" });
    }
    let subCategoryData = await subCategory.getOne({ subCategoryId: subCategoryId });
    if (subCategoryData) {
        let result = await subCategory.delete({ subCategoryId: subCategoryId });
        log.info("category deletion started !");
        if (result) {
            res.status(200).json({ message: "subCategory deleted successfully" });
        } else {
            res.status(500).json({ error: "can't delete category" });
        }
    } else {
        res.status(400).json({ error: "subCategory with this subCategoryId does not exist!" });
    }
}
exports.exportDocument = async(req, res, next) => {
    if (req.params != null && req.params != undefined) {
        var exportType = req.params.exportType;
    } else {
        res.status(400).json({ error: "request parameters required" });
    }
    try {
        let result = await subCategory.get();
        // console.log("value of "+ result);
        var cuisinsub = JSON.stringify(result);
        var tempobj ={
            subCategoryId:"CuisineSubId",
            categoryName:"CuisineName",
            subCategoryName:"CuisineSubName"        
        }
        cuisinsub = JSON.parse(cuisinsub.replace(/\b(?:subCategoryId|categoryName|subCategoryName)\b/gi, matched => tempobj[matched]));
        var filePath;
        const fileName = "subCategory";
        const fields = ['CuisineName', 'CuisineSubName', 'CuisineSubId', 'description', "publish"];
        if (exportType === "csv") {
            filePath = await exportDoc.getCSV(cuisinsub, fields, fileName);
            res.download(filePath, function(err) {
                if (err) {
                    console.log(err);
                }
                fs.unlink(filePath, function() {
                    console.log("File was deleted")
                });
            });
            return "successfully downloaded";
        } else if (exportType === "xlsx") {
            filePath = await exportDoc.getXLSX(cuisinsub, fields, fileName);
            res.download(filePath, function(err) {
                if (err) {
                    console.log(err);
                }
                fs.unlink(filePath, function() {
                    console.log("File was deleted")
                });
            });
            return "successfully downloaded";
        } else if (exportType === "pdf") {
            filePath = await exportDoc.getPdf(result, fileName, 'subcategory');
            res.download(filePath, function(err) {
                if (err) {
                    console.log(err);
                }
                fs.unlink(filePath, function() {
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
exports.updatePublish = async function(req, res, next) {
    if (req.params.subCategoryId != null && req.params.subCategoryId != undefined) {
        var subCategoryId = req.params.subCategoryId;
    } else {
        res.status(400).json({ error: "request parameters required" });
    }
    log.info("updating publish===== ");
    let subCategoryData = await subCategory.getOne({ subCategoryId: subCategoryId });
    if (subCategoryData) {
        if (req.body !== null && req.body !== undefined) {
            var updatePublishObject = {};
            updatePublishObject.publish = req.body.publish;
            let result = await subCategory.update({ subCategoryId: subCategoryId }, updatePublishObject);
            if (result) {
                log.info(datetime + " === " + "success");
                res.status(200).json({ message: "subCategory publish Updated successfully" });
            } else {
                log.error(datetime + " === " + "failure");
                res.status(500).json({ error: "can't update publish" });
            }
        } else {
            res.status(400).json({ "error": "request body required" });
        }
    } else {
        res.status(400).json({ error: "subCategory data not found" })
    }
}