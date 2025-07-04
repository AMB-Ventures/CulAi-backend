var Skill = require('../doa/skills.doa');
var exportDoc = require('./export-documents.controller');
var fs = require('fs');
var log = require('../logger');
var datetime = new Date();

//create skill
exports.createSkill = async function(req, res, next) {
    let user = await Skill.getOne({ skillId: req.body.skillId });
    if (user) {
        res.json({ error: "SKILLS with this SkillId already exist.Team will get back to you soon !" });
    } else {
        var skill = {
            skillId: req.body.skillId,
            tag: req.body.tag,
            skills: req.body.skills,
        };
        let result = await Skill.create(skill);
        if (result) {
            let message = "Skill created successfully";
            res.json({ message });
        } else {
            res.json({ error: result });
        }
    }
}

//get all the skills details present
exports.getskill = async function(req, res, next) {
    let result = await Skill.get({});
    if (result) {
        res.json({ Skill: result });
    } else {
        res.json({ error: result });
    }
}

//get skills details based on skill id.
exports.getSkillsById = async function(req, res, next) {
    let result = await Skill.getById({ skillId: req.params.skillId });
    log.info(req.params.skillId);
    if (result) {
        res.json({ skills: result });
    } else {
        res.json({ error: result });
    }
}

//update employee detail
exports.updateSkill = async function(req, res, next) {
    var newskill = {
        tag: req.body.tag,
        skills: req.body.skills,
        updatedBy: req.body.updatedBy
    }
    log.info("Updating skill ===== " + newskill);
    let result = await Skill.update({ skillId: req.params.skillId }, newskill);
    if (result) {
        res.json({ message: "skill updated successfully" });
    } else {
        res.json({ error: result });
    }
}

//remove skill
exports.removeSkills = async function(req, res, next) {
    let user = await Skill.getOne({ skillId: req.params.skillId });
    if (user) {
        let result = await Skill.delete({ skillId: req.params.skillId });
        log.info("Skill deletion started !");
        if (result) {
            res.json({ message: "Skill deleted successfully" });
        } else {
            res.json({ error: result });
        }
    } else {
        res.json({ error: "Skill with this Email does not exist!" });
    }
}
exports.exportDocument = async(req, res, next) => {
    if (req.params != null && req.params != undefined) {
        var exportType = req.params.exportType;
    } else {
        res.status(400).json({ error: "request parameters required" });
    }
    try {
        let result = await Skill.get();
        var filePath;
        const fileName = "Skill";
        const fields = ['skillId', 'skills', 'tag', 'updatedBy'];

        if (exportType === "csv") {
            filePath = await exportDoc.getCSV(result, fields, fileName);
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
            filePath = await exportDoc.getXLSX(result, fields, fileName);
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
            filePath = await exportDoc.getPdf(result, fileName, 'Skill');
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