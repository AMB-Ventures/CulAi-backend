const e = require('express');
var newsletter = require('../doa/newsletter');
var log = require('../logger');

exports.createNewsletter = async (req, res, next) => {
    try {
        if (!Object.keys(req.body).length) return res.status(400).json({ error: "required request body" });
        let data = await newsletter.getOne({ description: req.body.description });
        if (data) return res.status(500).json({ error: "newsletter already exists." });
        else {
            let result = await newsletter.create(req.body);
            if (result) return res.status(200).json({ message: "newsletter created successfully" });
            else return res.status(500).json({ error: "can't create newsletter" });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "newsletter not found." })
    }
}

exports.getAllNewsletters = async (req, res, next) => {
    let result = await newsletter.get();
    if (result) {
        res.status(200).json({ items: result });
    } else {
        res.status(500).json({ error: "data not found" });
    }
}

exports.getNewsletterById = async (req, res, next) => {
    if (req.params._id != null && req.params._id != undefined) {
        var newsletterId = req.params._id;
    } else {
        res.json({ "error": "request parameters required" });
    }
    let result = await newsletter.getById({ _id: newsletterId });
    if (result) {
        res.status(200).json({ items: result });
    } else {
        res.status(500).json({ error: "Id not found" });
    }
}

exports.updateNewsletter = async (req, res, next) => {

    if (req.params != null && req.params != undefined) {
        var newsletterId = req.params._id;
    } else {
        res.status(400).json({ error: "request parameters required" });
    }
    let newsletterData = await newsletter.getOne({ _id: newsletterId });
    if (newsletterData) {
        if (req.body !== null && req.body !== undefined) {
            var newNewsletter = {
                description: req.body.description
            }
            log.info("Updating newsletter =====> ");
            let result = await newsletter.update({ "_id": newsletterId }, newNewsletter);
            if (result) {
                res.status(200).json({ message: "newsletter updated successfully" });
            } else {
                res.status(500).json({ error: "can't update newsletter" });
            }
        } else {
            res.status(400).json({ error: "request body required" });
        }
    } else {
        res.status(400).json({ error: "newsletter data not found" });
    }
}

exports.removeNewsletter = async function (req, res) {
    if (req.params._id != null && req.params._id != undefined) {
        var newsletterId = req.params._id;
    } else {
        res.status(500).json({ error: "request parameters required" });
    }
    let newsletterData = await newsletter.getOne({ _id: newsletterId });
    if (newsletterData) {
        let result = await newsletter.delete({ _id: newsletterId });
        log.info("newsletter deletion started !");
        if (result) {
            res.status(200).json({ message: "newsletter deleted successfully" });
        } else {
            res.status(500).json({ error: "can't delete newsletter" });
        }
    } else {
        res.status(400).json({ error: "newsletter with this newsletterId does not exist!" });
    }
}