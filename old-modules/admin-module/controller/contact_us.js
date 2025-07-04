var emailService = require('./email-sender');

exports.contactUs = async function(req, res, next) {
    try {
        if (req.body !== undefined && req.body !== null) {
        var obj = {
            type: "contactUs",
            name: req.body.name,
            customerId: req.body.customerId,
            email: req.body.email,
            description: req.body.description,
            issuesType: req.body.issuesType
        };
        let serviceRes = emailService.sendEmailNew(process.env.emailId, 'Welcome User', obj)
        if (serviceRes) {
            res.status(200).json({ message: "mail sent successfully" });
        } else {
            res.status(500).json({ error: "can't send mail" });
        }
        } else {
            res.status(400).json({ error: "required request body" });
        }
    } catch (e) {
        console.error(e)
    }
}