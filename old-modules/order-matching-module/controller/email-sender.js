const sgMail = require('@sendgrid/mail');
exports.sendEmail = async function emailService(userId, message, templateId) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: userId,
        from: process.env.sendFrom,
        dynamic_template_data: message,
        templateId: templateId
    };
    try {
        var res = await sgMail.send(msg);
        consoe.log("sdsad",JSON.stringify(res));
        return "successfully sent"
    } catch (error) {
        if (error.response) {
            console.error(error.response.body)
            return "error found";
        }
    }
}